import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CAMINHOS } from '../seo'

const vercel = JSON.parse(
  readFileSync(new URL('../../../vercel.json', import.meta.url), 'utf8')
) as { rewrites: { source: string; destination: string }[] }

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
