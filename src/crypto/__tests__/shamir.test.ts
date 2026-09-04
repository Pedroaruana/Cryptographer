import { describe, expect, it } from 'vitest'
import { juntar, juntarTexto, repartir, repartirTexto } from '../shamir'

describe('repartir um segredo', () => {
  it('tres partes de cinco remontam o segredo', () => {
    const partes = repartirTexto('a senha do cofre e 4417', 5, 3)

    expect(partes).toHaveLength(5)
    expect(juntarTexto([partes[0], partes[2], partes[4]])).toBe('a senha do cofre e 4417')
    expect(juntarTexto([partes[1], partes[3], partes[0]])).toBe('a senha do cofre e 4417')
  })

  // com uma parte a menos a conta ainda roda, mas devolve lixo. e isso que faz
  // cada parte sozinha nao valer nada
  it('duas partes nao remontam nada parecido', () => {
    const segredo = 'a senha do cofre e 4417'
    const partes = repartirTexto(segredo, 5, 3)

    expect(juntarTexto([partes[0], partes[1]])).not.toBe(segredo)
  })

  it('cada parte sozinha nao parece com o segredo', () => {
    const segredo = new TextEncoder().encode('GAVIAO')
    const partes = repartir(segredo, 4, 2)

    for (const parte of partes) {
      expect(parte.includes('GAVIAO')).toBe(false)
    }
  })

  it('aguenta byte de qualquer valor, nao so texto', () => {
    const segredo = new Uint8Array(256).map((_, i) => i)
    const partes = repartir(segredo, 4, 3)

    expect(Array.from(juntar([partes[3], partes[1], partes[2]]))).toEqual(Array.from(segredo))
  })

  it('todas as combinacoes do minimo funcionam', () => {
    const partes = repartirTexto('teste', 4, 2)

    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        expect(juntarTexto([partes[i], partes[j]])).toBe('teste')
      }
    }
  })

  it('recusa parte repetida', () => {
    const partes = repartirTexto('teste', 3, 2)

    expect(() => juntar([partes[0], partes[0]])).toThrowError(
      expect.objectContaining({ code: 'mixed-parts' })
    )
  })

  it('recusa partes de segredos diferentes', () => {
    const um = repartirTexto('segredo curto', 3, 2)
    const dois = repartirTexto('um segredo bem mais comprido que o outro', 3, 2)

    expect(() => juntar([um[0], dois[1]])).toThrowError(
      expect.objectContaining({ code: 'mixed-parts' })
    )
  })

  it('recusa pedir mais partes do que existe', () => {
    expect(() => repartirTexto('x', 3, 5)).toThrowError(
      expect.objectContaining({ code: 'few-parts' })
    )
  })

  it('recusa juntar uma parte so', () => {
    const partes = repartirTexto('x', 3, 2)

    expect(() => juntar([partes[0]])).toThrowError(expect.objectContaining({ code: 'few-parts' }))
  })
})
