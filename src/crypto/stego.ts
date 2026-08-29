import { decryptBlob, encryptBlob } from './core'
import { CryptoError } from './format'

// esteganografia: em vez de trancar o arquivo, esconde um segredo dentro
// dele. a imagem continua abrindo normalmente e parece a mesma a olho nu.
//
// o truque e o ultimo bit de cada cor. mudar o vermelho de 200 pra 201 e
// invisivel pra qualquer pessoa, e sao tres bits por pixel (R, G e B).
// o alfa nao entra: pixel translucido pode ter a cor alterada pelo navegador
// na hora de salvar, e ai o segredo se perde

const MAGIC = [0x43, 0x47, 0x53, 0x54] // "CGST"
const VERSION = 1
const HEADER_BYTES = 10

export const STEGO_HEADER_BYTES = HEADER_BYTES

// so pixel totalmente opaco serve. conto quantos existem pra saber o espaco
export const opaqueCount = (data: Uint8ClampedArray) => {
  let total = 0
  for (let i = 3; i < data.length; i += 4) if (data[i] === 255) total++
  return total
}

export const capacityFor = (data: Uint8ClampedArray) =>
  Math.max(0, Math.floor((opaqueCount(data) * 3) / 8) - HEADER_BYTES)

// o byte 5 diz se o que esta escondido foi criptografado ou nao. e ele que
// permite a senha ser opcional: na hora de tirar de la, o proprio arquivo
// informa se vai precisar de senha
const buildHeader = (length: number, encrypted: boolean) => {
  const header = new Uint8Array(HEADER_BYTES)
  header.set(MAGIC, 0)
  header[4] = VERSION
  header[5] = encrypted ? 1 : 0
  new DataView(header.buffer).setUint32(6, length, false)
  return header
}

// escreve os bytes um bit por vez no ultimo bit de cada canal de cor
export const embedBytes = (data: Uint8ClampedArray, payload: Uint8Array, encrypted = true) => {
  const all = new Uint8Array(HEADER_BYTES + payload.length)
  all.set(buildHeader(payload.length, encrypted), 0)
  all.set(payload, HEADER_BYTES)

  let bit = 0
  const totalBits = all.length * 8

  for (let i = 0; i < data.length && bit < totalBits; i += 4) {
    if (data[i + 3] !== 255) continue

    for (let channel = 0; channel < 3 && bit < totalBits; channel++) {
      const value = (all[bit >> 3] >> (7 - (bit % 8))) & 1
      data[i + channel] = (data[i + channel] & 0xfe) | value
      bit++
    }
  }

  if (bit < totalBits) throw new CryptoError('image-too-small')

  return data
}

export const extractBytes = (data: Uint8ClampedArray) => {
  const readBits = (howMany: number, skipBits: number) => {
    const out = new Uint8Array(Math.ceil(howMany / 8))
    let bit = 0
    let seen = 0

    for (let i = 0; i < data.length && bit < howMany; i += 4) {
      if (data[i + 3] !== 255) continue

      for (let channel = 0; channel < 3 && bit < howMany; channel++) {
        if (seen < skipBits) {
          seen++
          continue
        }

        const value = data[i + channel] & 1
        out[bit >> 3] |= value << (7 - (bit % 8))
        bit++
      }
    }

    return out
  }

  const header = readBits(HEADER_BYTES * 8, 0)

  if (!MAGIC.every((byte, index) => header[index] === byte)) {
    throw new CryptoError('nothing-hidden')
  }

  if (header[4] !== VERSION) throw new CryptoError('bad-version')

  const length = new DataView(header.buffer).getUint32(6, false)

  if (length === 0 || length > capacityFor(data) + HEADER_BYTES) {
    throw new CryptoError('corrupted')
  }

  return { payload: readBits(length * 8, HEADER_BYTES * 8), encrypted: header[5] === 1 }
}

// ---------- as partes que precisam do canvas ----------

const toImageData = async (file: Blob) => {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new CryptoError('unknown')

  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  return { canvas, ctx, image: ctx.getImageData(0, 0, canvas.width, canvas.height) }
}

export const imageCapacity = async (file: Blob) => {
  const { image } = await toImageData(file)
  return capacityFor(image.data)
}

export const hideInImage = async (
  file: Blob,
  secret: string,
  password: string,
  onProgress: (value: number) => void
): Promise<Blob> => {
  const { canvas, ctx, image } = await toImageData(file)

  onProgress(0.15)

  // com senha, o segredo vai criptografado antes de ser escondido, e mesmo
  // quem desconfiar da imagem so acha ruido. sem senha, ele vai como texto
  // puro, e qualquer ferramenta de esteganografia consegue ler
  const encrypted = password.length > 0

  const payload = encrypted
    ? new Uint8Array(
        await (
          await encryptBlob(
            new Blob([secret]),
            { name: 'secret.txt', type: 'text/plain', size: secret.length },
            password,
            (value) => onProgress(0.15 + value * 0.6)
          )
        ).arrayBuffer()
      )
    : new TextEncoder().encode(secret)

  if (payload.length > capacityFor(image.data)) throw new CryptoError('image-too-small')

  embedBytes(image.data, payload, encrypted)
  ctx.putImageData(image, 0, 0)
  onProgress(0.9)

  // sai sempre em PNG. salvar em JPEG destruiria os bits na hora
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      onProgress(1)
      if (blob) resolve(blob)
      else reject(new CryptoError('unknown'))
    }, 'image/png')
  })
}

export const revealFromImage = async (
  file: Blob,
  password: string,
  onProgress: (value: number) => void
): Promise<string> => {
  const { image } = await toImageData(file)
  onProgress(0.2)

  const { payload, encrypted } = extractBytes(image.data)
  onProgress(0.4)

  // sem senha guardada, o texto sai direto. e o proprio arquivo que diz
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
