import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CAMINHOS } from '../seo'

const vercel = JSON.parse(
  readFileSync(new URL('../../../vercel.json', import.meta.url), 'utf8')
) as {
  rewrites: { source: string; destination: string }[]
  headers: { source: string; headers: { key: string; value: string }[] }[]
}

describe('as rotas e o arquivo estatico de cada uma', () => {
  // se alguem criar uma tela nova e esquecer disso, ela cai no desvio geral
  // e serve a home. o teste existe pra isso nao passar batido
  it('toda rota tem o proprio arquivo declarado na vercel', () => {
    for (const rota of CAMINHOS) {
      if (rota === '/') continue

      expect(vercel.rewrites, `falta a rota ${rota} na vercel.json`).toContainEqual({
        source: rota,
        destination: `${rota}.html`
      })
    }
  })

  it('o desvio geral fica por ultimo, senao ele engole as outras', () => {
    const ultima = vercel.rewrites[vercel.rewrites.length - 1]

    expect(ultima).toEqual({ source: '/(.*)', destination: '/index.html' })
    expect(vercel.rewrites.filter((r) => r.source === '/(.*)')).toHaveLength(1)
  })
})

describe('o cartao de compartilhamento', () => {
  // o site inteiro manda o navegador nao exibir nada dele em outro site, e isso
  // esta certo. mas o cartao existe pra ser exibido de fora, entao ele precisa
  // da excecao, senao o link no whatsapp aparece com a figura quebrada
  it('pode ser exibido de fora do site', () => {
    const regra = vercel.headers.find((h) => h.source.includes('og.png'))

    expect(regra, 'falta a excecao de og.png na vercel.json').toBeDefined()
    expect(regra?.headers).toContainEqual({
      key: 'Cross-Origin-Resource-Policy',
      value: 'cross-origin'
    })
  })

  it('a excecao vem depois da regra geral, senao ela nao vale', () => {
    const geral = vercel.headers.findIndex((h) => h.source === '/(.*)')
    const cartao = vercel.headers.findIndex((h) => h.source.includes('og.png'))

    expect(cartao).toBeGreaterThan(geral)
  })
})
