import {
  ALGO_AES_GCM,
  ALGO_AES_GCM_ARGON2,
  ARGON_MEMORY_KB,
  ARGON_PARALLELISM,
  ARGON_TIME,
  CHUNK_BYTES,
  CryptoError,
  HEADER_BYTES,
  IV_BYTES,
  KDF_ITERATIONS,
  MAGIC,
  MAX_FILE_BYTES,
  SALT_BYTES,
  VERSION,
  type FileMeta
} from './format'

type Progress = (value: number) => void

const enc = new TextEncoder()
const dec = new TextDecoder()

// deriva a chave a partir da senha. e de proposito lento, senao alguem testa
// milhoes de senhas por segundo num script
const derivePbkdf2 = async (password: string, salt: Uint8Array, iterations: number) => {
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveKey'
  ])

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

// o Argon2id nao existe na Web Crypto, entao vem de uma biblioteca em
// WebAssembly. a diferenca pro PBKDF2 e que ele tambem exige memoria, e nao
// so tempo. placa de video quebra PBKDF2 rapido porque roda milhares de
// contas em paralelo, mas nao tem 64 MB por nucleo pra sustentar Argon2
const deriveArgon2 = async (password: string, salt: Uint8Array) => {
  // carregado so na hora: e uma biblioteca em WebAssembly que a maioria
  // dos usos deste site nunca precisa
  const { argon2id } = await import('hash-wasm')

  const raw = await argon2id({
    password,
    salt,
    parallelism: ARGON_PARALLELISM,
    iterations: ARGON_TIME,
    memorySize: ARGON_MEMORY_KB,
    hashLength: 32,
    outputType: 'binary'
  })

  return crypto.subtle.importKey('raw', raw as BufferSource, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt'
  ])
}

const deriveKey = (algo: number, password: string, salt: Uint8Array, iterations: number) =>
  algo === ALGO_AES_GCM_ARGON2
    ? deriveArgon2(password, salt)
    : derivePbkdf2(password, salt, iterations)

// o indice do bloco entra como dado autenticado. sem isso daria pra pegar um
// arquivo cifrado e trocar a ordem dos blocos sem o AES reclamar
const indexAsAad = (index: number) => {
  const buf = new Uint8Array(4)
  new DataView(buf.buffer).setUint32(0, index, false)
  return buf
}

const buildHeader = (salt: Uint8Array, algo: number) => {
  const header = new Uint8Array(HEADER_BYTES)
  const view = new DataView(header.buffer)

  header.set(MAGIC, 0)
  header[4] = VERSION
  header[5] = algo
  view.setUint32(6, KDF_ITERATIONS, false)
  header.set(salt, 10)
  view.setUint32(26, CHUNK_BYTES, false)

  return header
}

const readHeader = (bytes: Uint8Array) => {
  const magicOk = MAGIC.every((b, i) => bytes[i] === b)
  if (!magicOk) throw new CryptoError('not-our-file')

  const version = bytes[4]
  if (version !== VERSION) throw new CryptoError('bad-version')

  if (bytes[5] !== ALGO_AES_GCM && bytes[5] !== ALGO_AES_GCM_ARGON2) {
    throw new CryptoError('bad-version')
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)

  return {
    algo: bytes[5],
    iterations: view.getUint32(6, false),
    salt: bytes.slice(10, 10 + SALT_BYTES),
    chunkSize: view.getUint32(26, false)
  }
}

// cada bloco vira: iv (12 bytes) + tamanho (4 bytes) + conteudo cifrado
const sealBlock = async (key: CryptoKey, index: number, data: Uint8Array) => {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))

  const cipher = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
        additionalData: indexAsAad(index) as BufferSource
      },
      key,
      data as BufferSource
    )
  )

  const out = new Uint8Array(IV_BYTES + 4 + cipher.length)
  out.set(iv, 0)
  new DataView(out.buffer).setUint32(IV_BYTES, cipher.length, false)
  out.set(cipher, IV_BYTES + 4)

  return out
}

const openBlock = async (key: CryptoKey, index: number, iv: Uint8Array, cipher: Uint8Array) => {
  try {
    return new Uint8Array(
      await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv as BufferSource,
          additionalData: indexAsAad(index) as BufferSource
        },
        key,
        cipher as BufferSource
      )
    )
  } catch {
    // o AES nao diz se foi senha errada ou arquivo mexido, os dois caem aqui.
    // pra quem ta usando o site o resultado pratico e o mesmo
    throw new CryptoError('wrong-password')
  }
}

export const encryptBlob = async (
  blob: Blob,
  meta: FileMeta,
  password: string,
  onProgress: Progress,
  algo: number = ALGO_AES_GCM
): Promise<Blob> => {
  if (blob.size > MAX_FILE_BYTES) throw new CryptoError('file-too-big')

  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))

  onProgress(0.02)
  const key = await deriveKey(algo, password, salt, KDF_ITERATIONS)
  onProgress(0.08)

  const parts: BlobPart[] = [buildHeader(salt, algo) as BlobPart]

  // o bloco 0 guarda nome e tipo do arquivo, cifrados junto. assim o arquivo
  // final nao entrega nem o nome original de quem mandou
  parts.push((await sealBlock(key, 0, enc.encode(JSON.stringify(meta)))) as BlobPart)

  const total = Math.max(1, Math.ceil(blob.size / CHUNK_BYTES))

  for (let i = 0; i < total; i++) {
    const slice = blob.slice(i * CHUNK_BYTES, (i + 1) * CHUNK_BYTES)
    const data = new Uint8Array(await slice.arrayBuffer())
    parts.push((await sealBlock(key, i + 1, data)) as BlobPart)
    onProgress(0.08 + ((i + 1) / total) * 0.92)
  }

  return new Blob(parts, { type: 'application/octet-stream' })
}

export const decryptBlob = async (
  blob: Blob,
  password: string,
  onProgress: Progress
): Promise<{ blob: Blob; meta: FileMeta }> => {
  if (blob.size < HEADER_BYTES) throw new CryptoError('not-our-file')

  const header = readHeader(new Uint8Array(await blob.slice(0, HEADER_BYTES).arrayBuffer()))

  onProgress(0.02)
  const key = await deriveKey(header.algo, password, header.salt, header.iterations)
  onProgress(0.08)

  let cursor = HEADER_BYTES
  let index = 0
  let meta: FileMeta | null = null
  const parts: BlobPart[] = []

  while (cursor < blob.size) {
    const frame = new Uint8Array(await blob.slice(cursor, cursor + IV_BYTES + 4).arrayBuffer())
    if (frame.length < IV_BYTES + 4) throw new CryptoError('corrupted')

    const iv = frame.slice(0, IV_BYTES)
    const length = new DataView(frame.buffer, frame.byteOffset).getUint32(IV_BYTES, false)
    const start = cursor + IV_BYTES + 4

    if (start + length > blob.size) throw new CryptoError('corrupted')

    const cipher = new Uint8Array(await blob.slice(start, start + length).arrayBuffer())
    const plain = await openBlock(key, index, iv, cipher)

    if (index === 0) meta = JSON.parse(dec.decode(plain)) as FileMeta
    else parts.push(plain as BlobPart)

    cursor = start + length
    index++
    onProgress(0.08 + (cursor / blob.size) * 0.92)
  }

  if (!meta) throw new CryptoError('corrupted')

  return { blob: new Blob(parts, { type: meta.type || 'application/octet-stream' }), meta }
}
