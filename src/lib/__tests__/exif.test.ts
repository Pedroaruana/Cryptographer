import { describe, expect, it } from 'vitest'
import { lerExifDeJpeg, lerTextoDePng } from '../exif'

// monta um JPEG minimo com um segmento EXIF de verdade dentro. e trabalhoso,
// mas e a unica forma de testar o leitor sem depender de uma foto no disco
const fazJpegComExif = (opcoes: { gps?: boolean } = {}) => {
  const partes: number[] = []
  const escreverTexto = (texto: string) => [...texto].map((ch) => ch.charCodeAt(0))

  // ---- monta a area TIFF ----
  const tiff: number[] = []
  const u16 = (v: number) => [v & 0xff, (v >> 8) & 0xff]
  const u32 = (v: number) => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >> 24) & 0xff]

  tiff.push(0x49, 0x49) // little endian
  tiff.push(...u16(42))
  tiff.push(...u32(8)) // primeira IFD logo depois do cabecalho

  const fabricante = escreverTexto('Canon\0')
  const modelo = escreverTexto('EOS 80D\0')
  const data = escreverTexto('2026:08:28 21:30:00\0')

  const entradas = opcoes.gps ? 4 : 3
  // 8 (cabecalho) + 2 (contador) + entradas*12 + 4 (proxima IFD)
  let livre = 8 + 2 + entradas * 12 + 4

  const posFabricante = livre
  livre += fabricante.length
  const posModelo = livre
  livre += modelo.length
  const posData = livre
  livre += data.length

  const posGpsIfd = livre

  const ifd: number[] = []
  ifd.push(...u16(entradas))

  const entrada = (tag: number, tipo: number, quantidade: number, valor: number[]) => {
    ifd.push(...u16(tag), ...u16(tipo), ...u32(quantidade))
    ifd.push(...valor, ...new Array(Math.max(0, 4 - valor.length)).fill(0))
  }

  entrada(0x010f, 2, fabricante.length, u32(posFabricante))
  entrada(0x0110, 2, modelo.length, u32(posModelo))
  entrada(0x0132, 2, data.length, u32(posData))
  if (opcoes.gps) entrada(0x8825, 4, 1, u32(posGpsIfd))

  ifd.push(...u32(0)) // nao tem proxima IFD

  tiff.push(...ifd.slice(0))
  tiff.push(...fabricante, ...modelo, ...data)

  if (opcoes.gps) {
    // a IFD de GPS: referencia e os tres racionais de grau, minuto e segundo
    const posLat = posGpsIfd + 2 + 4 * 12 + 4
    const posLon = posLat + 24

    const gps: number[] = []
    gps.push(...u16(4))
    gps.push(...u16(0x0001), ...u16(2), ...u32(2), ...escreverTexto('S\0'), 0, 0)
    gps.push(...u16(0x0002), ...u16(5), ...u32(3), ...u32(posLat))
    gps.push(...u16(0x0003), ...u16(2), ...u32(2), ...escreverTexto('W\0'), 0, 0)
    gps.push(...u16(0x0004), ...u16(5), ...u32(3), ...u32(posLon))
    gps.push(...u32(0))

    // 23 graus, 33 minutos, 0 segundos  /  46 graus, 38 minutos, 0 segundos
    const racional = (cima: number, baixo: number) => [...u32(cima), ...u32(baixo)]
    gps.push(...racional(23, 1), ...racional(33, 1), ...racional(0, 1))
    gps.push(...racional(46, 1), ...racional(38, 1), ...racional(0, 1))

    tiff.push(...gps)
  }

  // ---- embrulha no JPEG ----
  const corpoApp1 = [...escreverTexto('Exif'), 0, 0, ...tiff]
  const tamanhoApp1 = corpoApp1.length + 2

  partes.push(0xff, 0xd8)
  partes.push(0xff, 0xe1, (tamanhoApp1 >> 8) & 0xff, tamanhoApp1 & 0xff)
  partes.push(...corpoApp1)
  partes.push(0xff, 0xd9)

  return new Uint8Array(partes)
}

describe('metadados escondidos a vista', () => {
  it('acha a camera e a data', () => {
    const meta = lerExifDeJpeg(fazJpegComExif())

    expect(meta.temExif).toBe(true)
    expect(meta.achados.find((a) => a.chave === 'Fabricante')?.valor).toBe('Canon')
    expect(meta.achados.find((a) => a.chave === 'Modelo')?.valor).toBe('EOS 80D')
    expect(meta.achados.find((a) => a.chave === 'Data do arquivo')?.valor).toBe(
      '2026:08:28 21:30:00'
    )
  })

  // o mais serio: a coordenada de onde a foto foi tirada
  it('converte a coordenada de GPS para decimal', () => {
    const meta = lerExifDeJpeg(fazJpegComExif({ gps: true }))

    expect(meta.coordenadas).not.toBeNull()
    // 23 graus e 33 minutos ao sul, 46 graus e 38 minutos a oeste
    expect(meta.coordenadas?.lat).toBeCloseTo(-23.55, 2)
    expect(meta.coordenadas?.lon).toBeCloseTo(-46.633, 2)
  })

  it('nao inventa coordenada quando a foto nao tem GPS', () => {
    expect(lerExifDeJpeg(fazJpegComExif()).coordenadas).toBeNull()
  })

  it('devolve vazio quando nao e JPEG', () => {
    const meta = lerExifDeJpeg(new Uint8Array([1, 2, 3, 4, 5]))

    expect(meta.temExif).toBe(false)
    expect(meta.achados).toEqual([])
  })

  it('nao quebra com arquivo cortado no meio', () => {
    const inteiro = fazJpegComExif({ gps: true })

    for (const corte of [10, 25, 60, inteiro.length - 5]) {
      expect(() => lerExifDeJpeg(inteiro.slice(0, corte))).not.toThrow()
    }
  })
})

describe('texto dentro de PNG', () => {
  const fazPngComTexto = (chave: string, valor: string) => {
    const texto = new TextEncoder().encode(`${chave}\0${valor}`)
    const bytes: number[] = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

    const u32 = (v: number) => [(v >> 24) & 0xff, (v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff]

    bytes.push(...u32(texto.length))
    bytes.push(...[...'tEXt'].map((ch) => ch.charCodeAt(0)))
    bytes.push(...texto)
    bytes.push(...u32(0))

    bytes.push(...u32(0))
    bytes.push(...[...'IEND'].map((ch) => ch.charCodeAt(0)))
    bytes.push(...u32(0))

    return new Uint8Array(bytes)
  }

  it('acha o que ficou escrito no arquivo', () => {
    const meta = lerTextoDePng(fazPngComTexto('Software', 'Photoshop 2026'))

    expect(meta.temExif).toBe(true)
    expect(meta.achados[0]).toEqual({ chave: 'Software', valor: 'Photoshop 2026' })
  })

  it('devolve vazio quando nao e PNG', () => {
    expect(lerTextoDePng(new Uint8Array([1, 2, 3])).temExif).toBe(false)
  })
})
