import { armor, unarmor } from './armor'
import { decryptBlob, encryptBlob } from './core'
import { TEXT_FOOTER, TEXT_HEADER } from './format'

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

  return armor(TEXT_HEADER, TEXT_FOOTER, new Uint8Array(await sealed.arrayBuffer()))
}

export const decryptText = async (
  message: string,
  password: string,
  onProgress: (value: number) => void
) => {
  const bytes = unarmor(TEXT_HEADER, TEXT_FOOTER, message)

  const result = await decryptBlob(new Blob([bytes as BlobPart]), password, onProgress)

  return result.blob.text()
}
