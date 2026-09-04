// trancar pra alguem sem combinar senha antes. e a unica coisa que o site
// nao sabia fazer: pra mandar um .cgph as duas pessoas precisavam combinar a
// senha por fora, e esse combinado por fora era o elo fraco de tudo
import { armor, fromBase64, toBase64, unarmor } from './armor'
import { openStream, sealStream } from './core'
import {
  CURVE,
  CryptoError,
  MAX_FILE_BYTES,
  PK_MAGIC,
  PK_VERSION,
  PRIV_FOOTER,
  PRIV_HEADER,
  PUB_FOOTER,
  PUB_HEADER,
  SIGN_FOOTER,
  SIGN_HEADER,
  type FileMeta
} from './format'

type Progress = (value: number) => void

const enc = new TextEncoder()
const dec = new TextDecoder()

// sao dois pares, nao um. trocar chave e assinar sao trabalhos diferentes, e
// usar a mesma chave pros dois e um erro classico. entao o "meu par" do site
// na verdade guarda quatro chaves
type Bolsa = { v: number; troca: string; assina: string }

const lerBolsa = (texto: string, header: string, footer: string): Bolsa => {
  try {
    const bolsa = JSON.parse(dec.decode(unarmor(header, footer, texto))) as Bolsa

    if (!bolsa?.troca || !bolsa?.assina) throw new Error('incompleta')

    return bolsa
  } catch {
    throw new CryptoError('bad-key')
  }
}

export const gerarPar = async () => {
  const troca = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: CURVE }, true, [
    'deriveBits'
  ])

  const assina = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: CURVE }, true, [
    'sign',
    'verify'
  ])

  const exportar = async (formato: 'spki' | 'pkcs8', chave: CryptoKey) =>
    toBase64(new Uint8Array(await crypto.subtle.exportKey(formato, chave)))

  const publica: Bolsa = {
    v: 1,
    troca: await exportar('spki', troca.publicKey),
    assina: await exportar('spki', assina.publicKey)
  }

  const privada: Bolsa = {
    v: 1,
    troca: await exportar('pkcs8', troca.privateKey),
    assina: await exportar('pkcs8', assina.privateKey)
  }

  return {
    publica: armor(PUB_HEADER, PUB_FOOTER, enc.encode(JSON.stringify(publica))),
    privada: armor(PRIV_HEADER, PRIV_FOOTER, enc.encode(JSON.stringify(privada)))
  }
}

const importar = (
  formato: 'spki' | 'pkcs8',
  base64: string,
  algoritmo: 'ECDH' | 'ECDSA',
  usos: KeyUsage[]
) =>
  crypto.subtle
    .importKey(
      formato,
      fromBase64(base64) as BufferSource,
      { name: algoritmo, namedCurve: CURVE },
      true,
      usos
    )
    .catch(() => {
      throw new CryptoError('bad-key')
    })

// o segredo que sai da troca de chaves nao vira chave AES direto: passa pelo
// HKDF antes, com a chave efemera como sal. sem isso duas mensagens pro mesmo
// destinatario poderiam repetir material de chave
const chaveDaTroca = async (bits: ArrayBuffer, sal: Uint8Array) => {
  const base = await crypto.subtle.importKey('raw', bits, 'HKDF', false, ['deriveKey'])

  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: sal as BufferSource,
      info: enc.encode('cryptographer/troca/v1') as BufferSource
    },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export const trancarPara = async (
  blob: Blob,
  meta: FileMeta,
  publicaTexto: string,
  onProgress: Progress
): Promise<Blob> => {
  if (blob.size > MAX_FILE_BYTES) throw new CryptoError('file-too-big')

  const bolsa = lerBolsa(publicaTexto, PUB_HEADER, PUB_FOOTER)
  const deles = await importar('spki', bolsa.troca, 'ECDH', [])

  onProgress(0.02)

  // um par novo a cada arquivo, usado uma vez e jogado fora. e o que faz duas
  // mensagens pra mesma pessoa nao terem nada em comum
  const efemero = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: CURVE }, true, [
    'deriveBits'
  ])

  const spki = new Uint8Array(await crypto.subtle.exportKey('spki', efemero.publicKey))
  const bits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: deles },
    efemero.privateKey,
    256
  )

  const chave = await chaveDaTroca(bits, spki)
  onProgress(0.08)

  const cabecalho = new Uint8Array(4 + 1 + 2 + spki.length)
  cabecalho.set(PK_MAGIC, 0)
  cabecalho[4] = PK_VERSION
  new DataView(cabecalho.buffer).setUint16(5, spki.length, false)
  cabecalho.set(spki, 7)

  return sealStream(chave, blob, meta, cabecalho, onProgress)
}

export const abrirCom = async (
  blob: Blob,
  privadaTexto: string,
  onProgress: Progress
): Promise<{ blob: Blob; meta: FileMeta }> => {
  if (blob.size < 7) throw new CryptoError('not-our-file')

  const inicio = new Uint8Array(await blob.slice(0, 7).arrayBuffer())

  if (!PK_MAGIC.every((byte, i) => inicio[i] === byte)) throw new CryptoError('not-our-file')
  if (inicio[4] !== PK_VERSION) throw new CryptoError('bad-version')

  const tamanho = new DataView(inicio.buffer, inicio.byteOffset).getUint16(5, false)
  const spki = new Uint8Array(await blob.slice(7, 7 + tamanho).arrayBuffer())

  if (spki.length !== tamanho) throw new CryptoError('corrupted')

  const bolsa = lerBolsa(privadaTexto, PRIV_HEADER, PRIV_FOOTER)
  const minha = await importar('pkcs8', bolsa.troca, 'ECDH', ['deriveBits'])
  const dele = await importar('spki', toBase64(spki), 'ECDH', [])

  onProgress(0.04)

  const bits = await crypto.subtle.deriveBits({ name: 'ECDH', public: dele }, minha, 256)
  const chave = await chaveDaTroca(bits, spki)

  onProgress(0.08)

  try {
    return await openStream(chave, blob, 7 + tamanho, onProgress)
  } catch (erro) {
    // aqui senha errada nao existe: ou o arquivo nao era pra voce, ou ele
    // chegou danificado
    if (erro instanceof CryptoError && erro.code === 'wrong-password') {
      throw new CryptoError('not-for-you')
    }

    throw erro
  }
}

export const assinar = async (blob: Blob, privadaTexto: string, onProgress: Progress) => {
  const bolsa = lerBolsa(privadaTexto, PRIV_HEADER, PRIV_FOOTER)
  const chave = await importar('pkcs8', bolsa.assina, 'ECDSA', ['sign'])

  onProgress(0.3)

  const assinatura = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    chave,
    await blob.arrayBuffer()
  )

  onProgress(1)

  return armor(SIGN_HEADER, SIGN_FOOTER, new Uint8Array(assinatura))
}

export const conferir = async (
  blob: Blob,
  publicaTexto: string,
  assinaturaTexto: string,
  onProgress: Progress
) => {
  const bolsa = lerBolsa(publicaTexto, PUB_HEADER, PUB_FOOTER)
  const chave = await importar('spki', bolsa.assina, 'ECDSA', ['verify'])
  const assinatura = unarmor(SIGN_HEADER, SIGN_FOOTER, assinaturaTexto)

  onProgress(0.3)

  const bate = await crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    chave,
    assinatura as BufferSource,
    await blob.arrayBuffer()
  )

  onProgress(1)

  return bate
}
