import { decryptBlob, encryptBlob } from './core'
import { CryptoError, TEXT_FOOTER, TEXT_HEADER } from './format'

// converto de pouco em pouco pq String.fromCharCode com array gigante
// estoura a pilha do navegador
const toBase64 = (bytes: Uint8Array) => {
  let binary = ''
  const step = 8192

  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step))
  }

  return btoa(binary)
}

const fromBase64 = (value: string) => {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

  return bytes
}

// quebro em linhas curtas pq colado no whatsapp uma linha unica gigante fica horrivel
const wrap = (value: string) => (value.match(/.{1,64}/g) ?? []).join('\n')

export const encryptText = async (
  text: string,
  password: string,
  onProgress: (value: number) => void,
  algo?: number
) => {
  const blob = new Blob([text], { type: 'text/plain' })
  const sealed = await encryptBlob(
    blob,
    { name: 'message.txt', type: 'text/plain', size: blob.size },
    password,
    onProgress,
    algo
  )

  const body = wrap(toBase64(new Uint8Array(await sealed.arrayBuffer())))

  return `${TEXT_HEADER}\n${body}\n${TEXT_FOOTER}`
}

export const decryptText = async (
  message: string,
  password: string,
  onProgress: (value: number) => void
) => {
  const body = message.replace(TEXT_HEADER, '').replace(TEXT_FOOTER, '').replace(/\s+/g, '').trim()

  if (!body) throw new CryptoError('not-our-file')

  let bytes: Uint8Array

  try {
    bytes = fromBase64(body)
  } catch {
    throw new CryptoError('not-our-file')
  }

  const result = await decryptBlob(new Blob([bytes as BlobPart]), password, onProgress)

  return result.blob.text()
}
