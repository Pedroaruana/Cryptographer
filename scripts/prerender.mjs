import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CAMINHOS, render } from '../dist-ssr/entry-server.js'

// desenha as telas em texto e grava um html pronto pra cada endereco. sem isso
// quem nao roda javascript, que e boa parte dos robos, abre o site e recebe
// uma div vazia
const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(raiz, 'dist')

const escapar = (texto) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

const tags = ({ title, description, url, locale, naoIndexar, ficha }) => {
  const linhas = [
    `<title>${escapar(title)}</title>`,
    `<meta name="description" content="${escapar(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${escapar(title)}" />`,
    `<meta property="og:description" content="${escapar(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${locale}" />`
  ]

  if (naoIndexar) linhas.push('<meta name="robots" content="noindex" />')

  if (ficha) {
    // escapo o < pra que nenhum texto dentro da ficha consiga fechar o script
    const json = JSON.stringify(ficha).replace(/</g, '\\u003c')
    linhas.push(`<script id="dados-estruturados" type="application/ld+json">${json}</script>`)
  }

  return linhas.join('\n    ')
}

const molde = readFileSync(join(dist, 'index.html'), 'utf8')

if (!molde.includes('<!--seo-->')) {
  throw new Error('o index.html perdeu a marca <!--seo-->, o cabecalho nao tem onde entrar')
}

for (const rota of CAMINHOS) {
  const { corpo, cabecalho } = render(rota)

  const html = molde
    .replace('<html lang="pt-BR">', `<html lang="${cabecalho.htmlLang}">`)
    .replace('<!--seo-->', tags(cabecalho))
    .replace('<div id="root"></div>', `<div id="root">${corpo}</div>`)

  // encrypt.html e nao encrypt/index.html: assim tanto a vercel quanto o
  // servidor local resolvem /encrypt sem precisar da barra no fim
  const destino = rota === '/' ? join(dist, 'index.html') : join(dist, `${rota.slice(1)}.html`)

  mkdirSync(dirname(destino), { recursive: true })
  writeFileSync(destino, html)

  console.log(`  ${rota.padEnd(14)} ${(html.length / 1024).toFixed(1)} kB`)
}

console.log(`\n${CAMINHOS.length} telas geradas em texto`)
