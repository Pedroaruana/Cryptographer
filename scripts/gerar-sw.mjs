import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

// monta o service worker depois que o dist ja esta pronto, porque so aqui eu
// sei o nome final dos arquivos, que levam o hash do conteudo no nome
const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(raiz, 'dist')

// o que precisa estar guardado pro site abrir sem rede. sitemap, robots,
// llms.txt e o cartao de compartilhamento sao pra robo, nao pra pessoa
const FORA = new Set(['sw.js', 'sitemap.xml', 'robots.txt', 'llms.txt', 'og.png'])

const listar = (pasta) =>
  readdirSync(pasta).flatMap((nome) => {
    const cheio = join(pasta, nome)

    return statSync(cheio).isDirectory() ? listar(cheio) : [cheio]
  })

const arquivos = listar(dist)
  .map((cheio) => ({ cheio, url: `/${relative(dist, cheio).split(sep).join('/')}` }))
  .filter(({ url }) => !FORA.has(url.slice(1)))
  .sort((a, b) => a.url.localeCompare(b.url))

const digital = createHash('sha256')
for (const { cheio, url } of arquivos) {
  digital.update(url)
  digital.update(readFileSync(cheio))
}

const versao = digital.digest('hex').slice(0, 12)
const urls = arquivos.map(({ url }) => url)

const sw = `// gerado por scripts/gerar-sw.mjs, nao edite na mao
const VERSAO = '${versao}'
const CACHE = 'cryptographer-' + VERSAO
const ARQUIVOS = ${JSON.stringify(urls, null, 2)}

// guardo tudo de uma vez na instalacao. sao poucos arquivos e o site inteiro
// tem que funcionar sem rede, nao so a tela que a pessoa visitou
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  )
})

// versao nova entrando, as antigas saem junto, senao o disco so cresce
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) => Promise.all(nomes.filter((nome) => nome !== CACHE).map((nome) => caches.delete(nome))))
      .then(() => self.clients.claim())
  )
})

// ignoreVary e obrigatorio aqui: o servidor responde com Vary: Origin, e o
// pedido que eu guardei nao tem o mesmo Origin do pedido que o navegador faz
// depois. sem isso nada casa e o site nao abre sem rede
const OPCOES = { ignoreVary: true }

const paginaDe = (caminho) => {
  if (caminho === '/' || caminho === '') return '/index.html'
  if (caminho.endsWith('/')) caminho = caminho.slice(0, -1)

  return caminho.endsWith('.html') ? caminho : caminho + '.html'
}

self.addEventListener('fetch', (evento) => {
  const pedido = evento.request

  if (pedido.method !== 'GET') return

  const endereco = new URL(pedido.url)
  if (endereco.origin !== self.location.origin) return

  // tela: tenta a rede primeiro pra pegar versao nova, e cai pro guardado
  // quando nao tem rede. se o endereco nao existe, entrega a home
  if (pedido.mode === 'navigate') {
    evento.respondWith(
      fetch(pedido).catch(() =>
        caches
          .match(paginaDe(endereco.pathname), OPCOES)
          .then((achado) => achado || caches.match('/index.html', OPCOES))
      )
    )

    return
  }

  // o resto leva o hash do conteudo no nome, entao o guardado nunca fica velho
  evento.respondWith(caches.match(pedido, OPCOES).then((achado) => achado || fetch(pedido)))
})
`

writeFileSync(join(dist, 'sw.js'), sw)

console.log(`\nservice worker: ${urls.length} arquivos guardados, versao ${versao}`)
