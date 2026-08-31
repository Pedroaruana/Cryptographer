import { describe, expect, it } from 'vitest'
import { HASH_IDS, hashText } from '../hash'

const noop = () => {}

describe('impressao digital', () => {
  // vetores de teste oficiais, dos proprios padroes
  it('SHA-256 de abc bate com o vetor oficial', async () => {
    expect(await hashText('abc', 'SHA-256', noop)).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    )
  })

  it('SHA-1 de abc bate com o vetor oficial', async () => {
    expect(await hashText('abc', 'SHA-1', noop)).toBe('a9993e364706816aba3e25717850c26c9cd0d89d')
  })

  it('SHA-256 de texto vazio bate com o vetor oficial', async () => {
    expect(await hashText('', 'SHA-256', noop)).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    )
  })

  it('cada algoritmo tem o tamanho certo', async () => {
    const tamanhos: Record<string, number> = {
      'SHA-1': 40,
      'SHA-256': 64,
      'SHA-384': 96,
      'SHA-512': 128
    }

    for (const id of HASH_IDS) {
      expect((await hashText('teste', id, noop)).length).toBe(tamanhos[id])
    }
  })

  it('o mesmo texto sempre da a mesma impressao', async () => {
    const a = await hashText('mesma coisa', 'SHA-256', noop)
    const b = await hashText('mesma coisa', 'SHA-256', noop)

    expect(a).toBe(b)
  })

  // o efeito avalanche: uma letra diferente muda perto de metade dos bits
  it('mudar uma letra vira perto de metade dos bits', async () => {
    const a = await hashText('ataque ao amanhecer', 'SHA-256', noop)
    const b = await hashText('ataque ao amanhecar', 'SHA-256', noop)

    const bits = (hex: string) =>
      hex.split('').flatMap((c) => Number.parseInt(c, 16).toString(2).padStart(4, '0').split(''))

    const um = bits(a)
    const dois = bits(b)
    const mudados = um.filter((bit, i) => bit !== dois[i]).length

    expect(mudados).toBeGreaterThan(90)
    expect(mudados).toBeLessThan(166)
  })
})
