// repartir um segredo em varias partes, exigindo so algumas de volta. o
// bonito e que parte nenhuma sozinha entrega nada: nao e "metade da senha",
// e ruido puro ate juntar o numero combinado
import { armor, unarmor } from './armor'
import { CryptoError, PART_FOOTER, PART_HEADER } from './format'

// a conta acontece num corpo finito de 256 elementos, um por valor de byte.
// somar e o ou-exclusivo, e multiplicar precisa dessas duas tabelas
const EXP = new Uint8Array(512)
const LOG = new Uint8Array(256)

{
  let x = 1

  for (let i = 0; i < 255; i++) {
    EXP[i] = x
    LOG[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }

  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]
}

const mul = (a: number, b: number) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]])
const div = (a: number, b: number) => (a === 0 ? 0 : EXP[LOG[a] + 255 - LOG[b]])

const MAX_PARTES = 16

export const repartir = (segredo: Uint8Array, partes: number, minimo: number) => {
  if (minimo < 2 || minimo > partes) throw new CryptoError('few-parts')
  if (partes < 2 || partes > MAX_PARTES) throw new CryptoError('few-parts')
  if (segredo.length === 0) throw new CryptoError('corrupted')

  const saida = Array.from({ length: partes }, (_, i) => {
    const bytes = new Uint8Array(segredo.length + 1)
    bytes[0] = i + 1

    return bytes
  })

  // um polinomio novo pra cada byte do segredo. o segredo e o termo constante,
  // e os outros coeficientes sao sorteados na hora
  const coef = new Uint8Array(minimo - 1)

  for (let posicao = 0; posicao < segredo.length; posicao++) {
    crypto.getRandomValues(coef)

    for (let parte = 0; parte < partes; parte++) {
      const x = parte + 1
      let y = segredo[posicao]
      let potencia = 1

      for (let grau = 0; grau < coef.length; grau++) {
        potencia = mul(potencia, x)
        y ^= mul(coef[grau], potencia)
      }

      saida[parte][posicao + 1] = y
    }
  }

  return saida.map((bytes) => armor(PART_HEADER, PART_FOOTER, bytes))
}

export const juntar = (textos: string[]) => {
  const partes = textos
    .map((texto) => texto.trim())
    .filter(Boolean)
    .map((texto) => unarmor(PART_HEADER, PART_FOOTER, texto))

  if (partes.length < 2) throw new CryptoError('few-parts')

  const tamanho = partes[0].length

  // partes de segredos diferentes, ou uma parte repetida, dariam um resultado
  // errado em silencio. e isso e pior do que recusar
  if (partes.some((parte) => parte.length !== tamanho || parte.length < 2)) {
    throw new CryptoError('mixed-parts')
  }

  const xs = partes.map((parte) => parte[0])

  if (new Set(xs).size !== xs.length || xs.some((x) => x === 0)) {
    throw new CryptoError('mixed-parts')
  }

  const segredo = new Uint8Array(tamanho - 1)

  // interpolacao de Lagrange no ponto zero, que e onde o segredo estava
  for (let posicao = 0; posicao < segredo.length; posicao++) {
    let valor = 0

    for (let i = 0; i < partes.length; i++) {
      let termo = partes[i][posicao + 1]

      for (let j = 0; j < partes.length; j++) {
        if (i === j) continue
        termo = mul(termo, div(xs[j], xs[i] ^ xs[j]))
      }

      valor ^= termo
    }

    segredo[posicao] = valor
  }

  return segredo
}

export const repartirTexto = (texto: string, partes: number, minimo: number) =>
  repartir(new TextEncoder().encode(texto), partes, minimo)

export const juntarTexto = (textos: string[]) => new TextDecoder().decode(juntar(textos))
