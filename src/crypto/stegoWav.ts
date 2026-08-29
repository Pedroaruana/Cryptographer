import { decryptBlob, encryptBlob } from './core'
import { CryptoError } from './format'

// mesma ideia da imagem, mas em som. um arquivo WAV guarda a onda amostra
// por amostra, sem compressao nenhuma, entao mexer no ultimo bit de cada
// amostra muda o volume dela numa fracao que ouvido nenhum pega.
//
// MP3 nao serve pelo mesmo motivo que JPEG nao serve: a compressao com perda
// joga fora exatamente esses bits

const MAGIC = [0x43, 0x47, 0x53, 0x57] // "CGSW"
const VERSION = 1
const HEADER_BYTES = 10

// percorre os pedacos do RIFF ate achar onde comeca o som de verdade
export const findData = (bytes: Uint8Array) => {
  const texto = (at: number) =>
    String.fromCharCode(bytes[at], bytes[at + 1], bytes[at + 2], bytes[at + 3])

  if (bytes.length < 44 || texto(0) !== 'RIFF' || texto(8) !== 'WAVE') {
    throw new CryptoError('not-our-file')
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let at = 12
  let bitsPerSample = 16

  while (at + 8 <= bytes.length) {
    const nome = texto(at)
    const tamanho = view.getUint32(at + 4, true)

    if (nome === 'fmt ') bitsPerSample = view.getUint16(at + 8 + 14, true)

    if (nome === 'data') {
      return {
        start: at + 8,
        size: Math.min(tamanho, bytes.length - at - 8),
        bitsPerSample
      }
    }

    // os pedacos tem tamanho par por especificacao
    at += 8 + tamanho + (tamanho % 2)
  }

  throw new CryptoError('not-our-file')
}

// em 16 bits cada amostra ocupa dois bytes e eu so mexo no de baixo, que e
// o que carrega a parte fina do som. em 8 bits, todo byte serve
const stepFor = (bits: number) => (bits === 8 ? 1 : 2)

export const wavCapacity = (bytes: Uint8Array) => {
  const { size, bitsPerSample } = findData(bytes)
  return Math.max(0, Math.floor(size / stepFor(bitsPerSample) / 8) - HEADER_BYTES)
}

// mesmo byte de aviso da imagem: diz se precisa de senha pra ler
const buildHeader = (length: number, encrypted: boolean) => {
  const header = new Uint8Array(HEADER_BYTES)
  header.set(MAGIC, 0)
  header[4] = VERSION
  header[5] = encrypted ? 1 : 0
  new DataView(header.buffer).setUint32(6, length, false)
  return header
}

export const embedInWav = (bytes: Uint8Array, payload: Uint8Array, encrypted = true) => {
  const { start, size, bitsPerSample } = findData(bytes)
  const step = stepFor(bitsPerSample)

  const all = new Uint8Array(HEADER_BYTES + payload.length)
  all.set(buildHeader(payload.length, encrypted), 0)
  all.set(payload, HEADER_BYTES)

  const totalBits = all.length * 8
  if (totalBits > Math.floor(size / step)) throw new CryptoError('image-too-small')

  for (let bit = 0; bit < totalBits; bit++) {
    const at = start + bit * step
    const value = (all[bit >> 3] >> (7 - (bit % 8))) & 1
    bytes[at] = (bytes[at] & 0xfe) | value
  }

  return bytes
}

export const extractFromWav = (bytes: Uint8Array) => {
  const { start, size, bitsPerSample } = findData(bytes)
  const step = stepFor(bitsPerSample)

  const read = (howMany: number, skip: number) => {
    const out = new Uint8Array(Math.ceil(howMany / 8))

    for (let bit = 0; bit < howMany; bit++) {
      const at = start + (skip + bit) * step
      if (at >= start + size) break

      out[bit >> 3] |= (bytes[at] & 1) << (7 - (bit % 8))
    }

    return out
  }

  const header = read(HEADER_BYTES * 8, 0)

  if (!MAGIC.every((byte, index) => header[index] === byte)) {
    throw new CryptoError('nothing-hidden')
  }

  if (header[4] !== VERSION) throw new CryptoError('bad-version')

  const length = new DataView(header.buffer).getUint32(6, false)
  if (length === 0 || length > wavCapacity(bytes) + HEADER_BYTES) throw new CryptoError('corrupted')

  return { payload: read(length * 8, HEADER_BYTES * 8), encrypted: header[5] === 1 }
}

export const hideInAudio = async (
  file: Blob,
  secret: string,
  password: string,
  onProgress: (value: number) => void
): Promise<Blob> => {
  const bytes = new Uint8Array(await file.arrayBuffer())
  onProgress(0.15)

  const encrypted = password.length > 0

  const payload = encrypted
    ? new Uint8Array(
        await (
          await encryptBlob(
            new Blob([secret]),
            { name: 'secret.txt', type: 'text/plain', size: secret.length },
            password,
            (value) => onProgress(0.15 + value * 0.7)
          )
        ).arrayBuffer()
      )
    : new TextEncoder().encode(secret)

  embedInWav(bytes, payload, encrypted)
  onProgress(1)

  return new Blob([bytes as BlobPart], { type: 'audio/wav' })
}

export const revealFromAudio = async (
  file: Blob,
  password: string,
  onProgress: (value: number) => void
): Promise<string> => {
  const bytes = new Uint8Array(await file.arrayBuffer())
  onProgress(0.2)

  const { payload, encrypted } = extractFromWav(bytes)
  onProgress(0.4)

  if (!encrypted) {
    onProgress(1)
    return new TextDecoder().decode(payload)
  }

  if (!password) throw new CryptoError('needs-password')

  const opened = await decryptBlob(new Blob([payload as BlobPart]), password, (value) =>
    onProgress(0.4 + value * 0.6)
  )

  return opened.blob.text()
}
