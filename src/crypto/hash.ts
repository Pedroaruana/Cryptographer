// hash nao e criptografia, e caminho de mao unica. serve pra provar que um
// arquivo nao foi mexido, nao pra esconder o que tem dentro. de proposito
// isso fica numa tela separada, pra ninguem confundir as duas coisas

export type HashId = 'SHA-256' | 'SHA-512' | 'SHA-384' | 'SHA-1'

export const HASH_IDS: HashId[] = ['SHA-256', 'SHA-512', 'SHA-384', 'SHA-1']

const toHex = (buffer: ArrayBuffer) =>
  [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')

export const hashBlob = async (
  blob: Blob,
  id: HashId,
  onProgress: (value: number) => void
): Promise<string> => {
  onProgress(0.15)

  // a Web Crypto nao aceita hash em pedacos, entao o arquivo inteiro vai pra
  // memoria de uma vez. e o mesmo limite que a tela de criptografia tem
  const bytes = await blob.arrayBuffer()
  onProgress(0.6)

  const digest = await crypto.subtle.digest(id, bytes)
  onProgress(1)

  return toHex(digest)
}

export const hashText = (text: string, id: HashId, onProgress: (value: number) => void) =>
  hashBlob(new Blob([text]), id, onProgress)
