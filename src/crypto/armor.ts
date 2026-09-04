// bytes viram texto que sobrevive a copiar e colar no whatsapp, no email ou
// num bloco de notas. estava tudo escondido dentro do text.ts, mas agora
// chave, assinatura e parte de segredo tambem precisam disso
import { CryptoError } from './format'

// converto de pouco em pouco pq String.fromCharCode com array gigante
// estoura a pilha do navegador
export const toBase64 = (bytes: Uint8Array) => {
  let binary = ''
  const step = 8192

  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step))
  }

  return btoa(binary)
}

export const fromBase64 = (value: string) => {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

  return bytes
}

// quebro em linhas curtas pq colado no whatsapp uma linha unica gigante fica horrivel
export const wrap = (value: string) => (value.match(/.{1,64}/g) ?? []).join('\n')

export const armor = (header: string, footer: string, bytes: Uint8Array) =>
  `${header}\n${wrap(toBase64(bytes))}\n${footer}`

export const unarmor = (header: string, footer: string, text: string) => {
  const body = text.replace(header, '').replace(footer, '').replace(/\s+/g, '').trim()

  if (!body) throw new CryptoError('not-our-file')

  try {
    return fromBase64(body)
  } catch {
    throw new CryptoError('not-our-file')
  }
}
