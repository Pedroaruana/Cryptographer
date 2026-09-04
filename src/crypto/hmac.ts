// o selo com senha. e o meio termo entre a impressao digital, que qualquer um
// refaz, e a assinatura, que exige par de chaves: aqui as duas pessoas
// combinam uma senha e so quem tem ela consegue produzir o selo
import { fromBase64, toBase64 } from './armor'
import { KDF_ITERATIONS, SALT_BYTES } from './format'

const enc = new TextEncoder()

const chaveDaSenha = async (senha: string, sal: Uint8Array) => {
  // a senha nao vira chave direto: senha curta usada como chave de HMAC seria
  // adivinhada rapido por quem tivesse o arquivo e o selo
  const base = await crypto.subtle.importKey('raw', enc.encode(senha), 'PBKDF2', false, [
    'deriveKey'
  ])

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: sal as BufferSource, iterations: KDF_ITERATIONS, hash: 'SHA-256' },
    base,
    { name: 'HMAC', hash: 'SHA-256', length: 256 },
    false,
    ['sign']
  )
}

export const selar = async (blob: Blob, senha: string, onProgress: (valor: number) => void) => {
  const sal = crypto.getRandomValues(new Uint8Array(SALT_BYTES))

  onProgress(0.2)
  const chave = await chaveDaSenha(senha, sal)
  onProgress(0.7)

  const marca = new Uint8Array(await crypto.subtle.sign('HMAC', chave, await blob.arrayBuffer()))

  const saida = new Uint8Array(sal.length + marca.length)
  saida.set(sal, 0)
  saida.set(marca, sal.length)

  onProgress(1)

  return toBase64(saida)
}

export const conferirSelo = async (
  blob: Blob,
  senha: string,
  selo: string,
  onProgress: (valor: number) => void
) => {
  let bytes: Uint8Array

  try {
    bytes = fromBase64(selo.replace(/\s+/g, ''))
  } catch {
    return false
  }

  if (bytes.length !== SALT_BYTES + 32) return false

  onProgress(0.2)
  const chave = await chaveDaSenha(senha, bytes.slice(0, SALT_BYTES))
  onProgress(0.7)

  const marca = new Uint8Array(await crypto.subtle.sign('HMAC', chave, await blob.arrayBuffer()))
  const esperado = bytes.slice(SALT_BYTES)

  // comparacao de tempo constante: sair no primeiro byte diferente entrega,
  // pelo relogio, quantos bytes ja batiam
  let diferenca = 0
  for (let i = 0; i < marca.length; i++) diferenca |= marca[i] ^ esperado[i]

  onProgress(1)

  return diferenca === 0
}
