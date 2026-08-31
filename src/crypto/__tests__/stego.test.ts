import { describe, expect, it } from 'vitest'
import { capacityFor, embedBytes, extractBytes, opaqueCount, STEGO_HEADER_BYTES } from '../stego'

// os pixels de uma imagem, sem precisar de canvas: cada quatro numeros sao
// um pixel em R, G, B, alfa
const pixels = (quantidade: number, alfa = 255) => {
  const data = new Uint8ClampedArray(quantidade * 4)

  for (let i = 0; i < quantidade; i++) {
    data[i * 4] = 120 + (i % 7)
    data[i * 4 + 1] = 80 + (i % 5)
    data[i * 4 + 2] = 200 - (i % 3)
    data[i * 4 + 3] = alfa
  }

  return data
}

const texto = (valor: string) => new TextEncoder().encode(valor)

describe('esconder e achar', () => {
  it('devolve exatamente o que foi escondido', () => {
    const data = pixels(4000)
    const segredo = texto('a senha do cofre e 4417')

    embedBytes(data, segredo)

    expect(Array.from(extractBytes(data).payload)).toEqual(Array.from(segredo))
  })

  it('aguenta um segredo grande', () => {
    const data = pixels(60_000)
    const segredo = crypto.getRandomValues(new Uint8Array(8000))

    embedBytes(data, segredo)

    expect(Array.from(extractBytes(data).payload)).toEqual(Array.from(segredo))
  })

  // o ponto todo da esteganografia: a imagem nao pode parecer mexida
  it('quase nao muda a imagem', () => {
    const antes = pixels(4000)
    const depois = pixels(4000)

    embedBytes(depois, texto('segredo escondido aqui dentro'))

    let mudados = 0
    let maiorDiferenca = 0

    for (let i = 0; i < antes.length; i++) {
      const diferenca = Math.abs(antes[i] - depois[i])
      if (diferenca > 0) mudados++
      maiorDiferenca = Math.max(maiorDiferenca, diferenca)
    }

    // nenhum canal pode mudar mais de 1, senao daria pra ver
    expect(maiorDiferenca).toBe(1)
    // e so os primeiros pixels sao tocados, o resto da imagem fica intacto
    expect(mudados).toBeLessThan(antes.length * 0.05)
  })

  it('nao encosta no canal alfa', () => {
    const data = pixels(2000)
    embedBytes(data, texto('oi'))

    for (let i = 3; i < data.length; i += 4) expect(data[i]).toBe(255)
  })
})

describe('espaco disponivel', () => {
  it('conta tres bits por pixel opaco, menos o cabecalho', () => {
    const data = pixels(800)

    expect(opaqueCount(data)).toBe(800)
    expect(capacityFor(data)).toBe(Math.floor((800 * 3) / 8) - STEGO_HEADER_BYTES)
  })

  it('ignora pixel translucido', () => {
    const data = pixels(500, 128)

    expect(opaqueCount(data)).toBe(0)
    expect(capacityFor(data)).toBe(0)
  })

  it('avisa quando a imagem e pequena demais', () => {
    const data = pixels(40)

    expect(() => embedBytes(data, crypto.getRandomValues(new Uint8Array(200)))).toThrow()
  })
})

describe('quando nao tem nada escondido', () => {
  it('avisa que a imagem nao carrega segredo nenhum', () => {
    expect(() => extractBytes(pixels(2000))).toThrowError(
      expect.objectContaining({ code: 'nothing-hidden' })
    )
  })

  // se a imagem for salva em JPEG a compressao come os ultimos bits.
  // o site precisa perceber isso e nao devolver lixo
  it('percebe quando os bits foram destruidos', () => {
    const data = pixels(4000)
    embedBytes(data, texto('segredo que vai ser destruido'))

    // simula o estrago da compressao com perda
    for (let i = 0; i < data.length; i += 4) data[i] = data[i] ^ 1

    expect(() => extractBytes(data)).toThrow()
  })
})

describe('senha opcional', () => {
  it('marca no proprio arquivo se foi criptografado', () => {
    const comSenha = pixels(4000)
    const semSenha = pixels(4000)

    embedBytes(comSenha, texto('segredo'), true)
    embedBytes(semSenha, texto('segredo'), false)

    expect(extractBytes(comSenha).encrypted).toBe(true)
    expect(extractBytes(semSenha).encrypted).toBe(false)
  })

  // e isso que permite tirar de la sem perguntar nada: quem le descobre
  // pelo arquivo se vai precisar de senha ou nao
  it('o conteudo sai igual dos dois jeitos', () => {
    const data = pixels(4000)
    const segredo = texto('o pin e 4417')

    embedBytes(data, segredo, false)
    const lido = extractBytes(data)

    expect(lido.encrypted).toBe(false)
    expect(new TextDecoder().decode(lido.payload)).toBe('o pin e 4417')
  })
})
