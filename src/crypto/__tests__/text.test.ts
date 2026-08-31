import { describe, expect, it } from 'vitest'
import { decryptText, encryptText } from '../text'
import { TEXT_FOOTER, TEXT_HEADER } from '../format'

const noop = () => {}

describe('mensagem lacrada', () => {
  it('volta exatamente o que entrou', async () => {
    const segredo = 'o pin do cofre e 4417'
    const lacrada = await encryptText(segredo, 'senha', noop)

    expect(await decryptText(lacrada, 'senha', noop)).toBe(segredo)
  })

  it('vem com cabecalho e rodape pra pessoa saber o que e', async () => {
    const lacrada = await encryptText('oi', 'x', noop)

    expect(lacrada.startsWith(TEXT_HEADER)).toBe(true)
    expect(lacrada.trimEnd().endsWith(TEXT_FOOTER)).toBe(true)
  })

  it('aguenta acento e emoji', async () => {
    const original = 'ação, coração e 🔐 no meio'
    const lacrada = await encryptText(original, 'senha', noop)

    expect(await decryptText(lacrada, 'senha', noop)).toBe(original)
  })

  it('recusa senha errada', async () => {
    const lacrada = await encryptText('segredo', 'certa', noop)

    await expect(decryptText(lacrada, 'errada', noop)).rejects.toMatchObject({
      code: 'wrong-password'
    })
  })

  it('recusa texto que nao e uma mensagem lacrada', async () => {
    await expect(decryptText('isso aqui e so um texto', 'x', noop)).rejects.toMatchObject({
      code: 'not-our-file'
    })
  })

  it('recusa mensagem vazia', async () => {
    await expect(decryptText('   ', 'x', noop)).rejects.toMatchObject({ code: 'not-our-file' })
  })

  // quebrar em linhas e o que faz a mensagem sobreviver ao whatsapp
  it('quebra a saida em linhas curtas', async () => {
    const lacrada = await encryptText('a'.repeat(400), 'x', noop)
    const linhas = lacrada.split('\n').slice(1, -1)

    expect(linhas.length).toBeGreaterThan(1)
    for (const linha of linhas) expect(linha.length).toBeLessThanOrEqual(64)
  })
})
