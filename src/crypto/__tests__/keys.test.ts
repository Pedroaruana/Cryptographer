import { describe, expect, it } from 'vitest'
import { abrirCom, assinar, conferir, gerarPar, trancarPara } from '../keys'
import { PUB_HEADER } from '../format'

const noop = () => {}
const meta = (blob: Blob, name: string) => ({ name, type: blob.type, size: blob.size })

describe('trancar pra alguem sem combinar senha', () => {
  it('so o dono da chave privada abre', async () => {
    const ana = await gerarPar()
    const bruno = await gerarPar()

    const original = new Blob(['o pin do cofre e 4417'], { type: 'text/plain' })
    const lacrado = await trancarPara(original, meta(original, 'nota.txt'), ana.publica, noop)

    const aberto = await abrirCom(lacrado, ana.privada, noop)

    expect(await aberto.blob.text()).toBe('o pin do cofre e 4417')
    expect(aberto.meta.name).toBe('nota.txt')

    await expect(abrirCom(lacrado, bruno.privada, noop)).rejects.toMatchObject({
      code: 'not-for-you'
    })
  })

  // quem mandou nao abre de volta, e isso e o que diferencia de senha
  it('quem tranca nao consegue abrir depois', async () => {
    const ana = await gerarPar()
    const bruno = await gerarPar()

    const arquivo = new Blob(['segredo'], { type: 'text/plain' })
    const lacrado = await trancarPara(arquivo, meta(arquivo, 'x.txt'), ana.publica, noop)

    await expect(abrirCom(lacrado, bruno.privada, noop)).rejects.toMatchObject({
      code: 'not-for-you'
    })
  })

  it('o mesmo arquivo pra mesma pessoa sai diferente cada vez', async () => {
    const ana = await gerarPar()
    const arquivo = new Blob(['igual'], { type: 'text/plain' })

    const um = new Uint8Array(
      await (await trancarPara(arquivo, meta(arquivo, 'a.txt'), ana.publica, noop)).arrayBuffer()
    )

    const dois = new Uint8Array(
      await (await trancarPara(arquivo, meta(arquivo, 'a.txt'), ana.publica, noop)).arrayBuffer()
    )

    expect(Array.from(um)).not.toEqual(Array.from(dois))
  })

  it('o conteudo e o nome nao aparecem legiveis dentro do arquivo', async () => {
    const ana = await gerarPar()
    const arquivo = new Blob(['GAVIAO ATACA AS SEIS'], { type: 'text/plain' })
    const lacrado = await trancarPara(arquivo, meta(arquivo, 'ordem.txt'), ana.publica, noop)

    const texto = await lacrado.text()

    expect(texto.includes('GAVIAO')).toBe(false)
    expect(texto.includes('ordem.txt')).toBe(false)
  })

  it('a chave publica pode ser copiada e colada como texto', async () => {
    const ana = await gerarPar()

    expect(ana.publica.startsWith(PUB_HEADER)).toBe(true)
    expect(ana.publica.split('\n').length).toBeGreaterThan(2)
  })

  it('recusa chave que nao e chave', async () => {
    const arquivo = new Blob(['x'])

    await expect(
      trancarPara(arquivo, meta(arquivo, 'x'), 'isso aqui e so um texto', noop)
    ).rejects.toMatchObject({ code: 'bad-key' })
  })

  it('recusa arquivo que nao saiu daqui', async () => {
    const ana = await gerarPar()

    await expect(abrirCom(new Blob(['nada disso']), ana.privada, noop)).rejects.toMatchObject({
      code: 'not-our-file'
    })
  })
})

describe('assinatura', () => {
  it('confere com a chave publica de quem assinou', async () => {
    const ana = await gerarPar()
    const arquivo = new Blob(['contrato versao final'])

    const assinatura = await assinar(arquivo, ana.privada, noop)

    expect(await conferir(arquivo, ana.publica, assinatura, noop)).toBe(true)
  })

  it('nao confere com a chave de outra pessoa', async () => {
    const ana = await gerarPar()
    const bruno = await gerarPar()
    const arquivo = new Blob(['contrato versao final'])

    const assinatura = await assinar(arquivo, ana.privada, noop)

    expect(await conferir(arquivo, bruno.publica, assinatura, noop)).toBe(false)
  })

  it('nao confere se o arquivo mudou depois de assinado', async () => {
    const ana = await gerarPar()
    const assinatura = await assinar(new Blob(['pago 100 reais']), ana.privada, noop)

    expect(await conferir(new Blob(['pago 900 reais']), ana.publica, assinatura, noop)).toBe(false)
  })
})
