import { describe, expect, it } from 'vitest'
import { embedInWav, extractFromWav, findData, wavCapacity } from '../stegoWav'

// monta um WAV de verdade: cabecalho RIFF, pedaco fmt e pedaco data
const fazWav = (amostras: number, bits = 16) => {
  const bytesPorAmostra = bits / 8
  const tamanhoData = amostras * bytesPorAmostra
  const total = 44 + tamanhoData

  const bytes = new Uint8Array(total)
  const view = new DataView(bytes.buffer)
  const escreve = (at: number, texto: string) => {
    for (let i = 0; i < texto.length; i++) bytes[at + i] = texto.charCodeAt(i)
  }

  escreve(0, 'RIFF')
  view.setUint32(4, total - 8, true)
  escreve(8, 'WAVE')

  escreve(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, 44100, true)
  view.setUint32(28, 44100 * bytesPorAmostra, true)
  view.setUint16(32, bytesPorAmostra, true)
  view.setUint16(34, bits, true)

  escreve(36, 'data')
  view.setUint32(40, tamanhoData, true)

  // uma onda qualquer, pra nao ser silencio puro
  for (let i = 0; i < amostras; i++) {
    const valor = Math.round(Math.sin(i / 12) * 12000)
    if (bits === 16) view.setInt16(44 + i * 2, valor, true)
    else bytes[44 + i] = (valor & 0xff) ^ 0x80
  }

  return bytes
}

const texto = (valor: string) => new TextEncoder().encode(valor)

describe('esconder no som', () => {
  it('acha onde comeca o som dentro do arquivo', () => {
    const wav = fazWav(1000)
    const data = findData(wav)

    expect(data.start).toBe(44)
    expect(data.size).toBe(2000)
    expect(data.bitsPerSample).toBe(16)
  })

  it('devolve exatamente o que foi escondido', () => {
    const wav = fazWav(20_000)
    const segredo = texto('a senha do cofre e 4417')

    embedInWav(wav, segredo)

    expect(Array.from(extractFromWav(wav).payload)).toEqual(Array.from(segredo))
  })

  it('funciona tambem em 8 bits', () => {
    const wav = fazWav(20_000, 8)
    const segredo = texto('som de oito bits')

    embedInWav(wav, segredo)

    expect(Array.from(extractFromWav(wav).payload)).toEqual(Array.from(segredo))
  })

  // o cabecalho do arquivo nao pode ser tocado, senao o WAV para de tocar
  it('nao encosta no cabecalho do arquivo', () => {
    const antes = fazWav(20_000)
    const depois = fazWav(20_000)

    embedInWav(depois, texto('segredo'))

    for (let i = 0; i < 44; i++) expect(depois[i]).toBe(antes[i])
  })

  // em 16 bits so o byte de baixo muda: o de cima carrega o volume
  it('nao encosta no byte alto das amostras', () => {
    const antes = fazWav(20_000)
    const depois = fazWav(20_000)

    embedInWav(depois, texto('outro segredo qualquer'))

    for (let i = 45; i < depois.length; i += 2) expect(depois[i]).toBe(antes[i])
  })

  it('cabe menos do que o arquivo inteiro, e a conta bate', () => {
    const wav = fazWav(8000)

    expect(wavCapacity(wav)).toBe(Math.floor(16000 / 2 / 8) - 10)
  })

  it('avisa quando o som e curto demais', () => {
    const wav = fazWav(200)

    expect(() => embedInWav(wav, new Uint8Array(500))).toThrow()
  })

  it('avisa quando nao tem nada escondido', () => {
    expect(() => extractFromWav(fazWav(5000))).toThrowError(
      expect.objectContaining({ code: 'nothing-hidden' })
    )
  })

  it('recusa arquivo que nao e WAV', () => {
    expect(() => findData(new Uint8Array(100))).toThrowError(
      expect.objectContaining({ code: 'not-our-file' })
    )
  })
})
