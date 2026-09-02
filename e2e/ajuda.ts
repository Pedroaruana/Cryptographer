import type { Page } from '@playwright/test'

// o aviso de "se perder a senha o arquivo se perde" aparece na primeira visita
// e fica por cima do rodape. os testes ja nascem com ele lido, senao ele
// atrapalha os cliques
export const abrir = async (page: Page, caminho: string) => {
  await page.addInitScript(() => {
    localStorage.setItem('cryptographer:warn', '1')
    localStorage.setItem('cryptographer:lang', 'pt')
  })

  await page.goto(caminho)
}

// pega o arquivo que o botao de baixar entrega e devolve os bytes dele
export const baixar = async (page: Page, nomeDoBotao: RegExp) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: nomeDoBotao }).click()
  ])

  const stream = await download.createReadStream()
  const pedacos: Buffer[] = []

  for await (const pedaco of stream) pedacos.push(pedaco as Buffer)

  return { nome: download.suggestedFilename(), bytes: Buffer.concat(pedacos) }
}

// o html estatico nao tem data-theme de proposito, quem escreve esse atributo e
// um efeito do react. entao ele so aparece quando o site esta de pe pra valer,
// e nao so desenhado na tela
export const esperarReact = (page: Page) =>
  page.waitForFunction(() => Boolean(document.documentElement.dataset.theme), null, {
    timeout: 20_000
  })
