import { describe, expect, it } from 'vitest'
import { applyClassic, CLASSIC_IDS, NEEDS_KEY, type MethodId } from '../classic'

const FRASE = 'ataque ao amanhecer'
const CHAVE = 'chave'

// so as letras interessam pra comparar: varias cifras classicas comem espaco
// e pontuacao por definicao, e o Playfair ainda enfia X entre letras iguais
const soLetras = (texto: string) => texto.toLowerCase().replace(/[^a-z]/g, '')

describe('ida e volta de todas as cifras classicas', () => {
  for (const id of CLASSIC_IDS) {
    it(`${id} volta ao original`, () => {
      const cifrado = applyClassic(id, FRASE, CHAVE, false)
      const voltou = applyClassic(id, cifrado, CHAVE, true)

      expect(cifrado).not.toBe(FRASE)

      if (id === 'playfair') {
        // o X de enchimento e da propria cifra, entao comparo o comeco
        expect(soLetras(voltou).startsWith(soLetras(FRASE))).toBe(true)
        return
      }

      expect(soLetras(voltou)).toBe(soLetras(FRASE))
    })
  }
})

describe('resultados que dao pra conferir na mao', () => {
  it('Cesar com deslocamento 3', () => {
    expect(applyClassic('caesar', 'abc xyz', '3', false)).toBe('def abc')
  })

  it('ROT13 aplicado duas vezes devolve o original', () => {
    const uma = applyClassic('rot13', 'socorro', '', false)
    expect(uma).toBe('fbpbeeb')
    expect(applyClassic('rot13', uma, '', false)).toBe('socorro')
  })

  it('Atbash troca A por Z', () => {
    expect(applyClassic('atbash', 'abc', '', false)).toBe('zyx')
  })

  it('Morse do SOS', () => {
    expect(applyClassic('morse', 'sos', '', false)).toBe('... --- ...')
  })

  it('Base64 do texto conhecido', () => {
    expect(applyClassic('base64', 'oi', '', false)).toBe('b2k=')
  })

  it('binario da letra A', () => {
    expect(applyClassic('binary', 'A', '', false)).toBe('01000001')
  })

  it('hexadecimal da letra A', () => {
    expect(applyClassic('hex', 'A', '', false)).toBe('41')
  })

  it('A1Z26 numera as letras', () => {
    expect(applyClassic('a1z26', 'abc', '', false)).toBe('1 2 3')
  })

  it('OTAN soletra', () => {
    expect(applyClassic('nato', 'sos', '', false)).toBe('Sierra Oscar Sierra')
  })

  it('ROT47 aplicado duas vezes devolve o original', () => {
    const uma = applyClassic('rot47', 'Ola, 123!', '', false)
    expect(uma).not.toBe('Ola, 123!')
    expect(applyClassic('rot47', uma, '', false)).toBe('Ola, 123!')
  })
})

describe('a chave importa', () => {
  it('chaves diferentes dao resultados diferentes no Vigenere', () => {
    const a = applyClassic('vigenere', FRASE, 'chave', false)
    const b = applyClassic('vigenere', FRASE, 'outra', false)

    expect(a).not.toBe(b)
  })

  it('quem nao usa chave ignora a chave', () => {
    const semChave = CLASSIC_IDS.filter((id) => !NEEDS_KEY[id as MethodId])

    for (const id of semChave) {
      expect(applyClassic(id, FRASE, 'aaa', false)).toBe(applyClassic(id, FRASE, 'zzz', false))
    }
  })
})
