import type { Dict } from '../i18n/en'
import type { Lang } from '../i18n/context'

export const SITE = 'https://cryptographer-seven.vercel.app'

export type SeoKey = keyof Dict['seo'] extends infer K ? Extract<K, string> : never

const ROTAS = {
  '/': 'home',
  '/encrypt': 'encrypt',
  '/decrypt': 'decrypt',
  '/esconder': 'hide',
  '/metadados': 'metadata',
  '/hash': 'hash',
  '/simuladores': 'lab',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/cookies': 'cookies'
} as const

// a lista que o gerador de html estatico percorre
export const CAMINHOS = Object.keys(ROTAS) as (keyof typeof ROTAS)[]

type Chave = (typeof ROTAS)[keyof typeof ROTAS] | 'notFound'

export const chaveDaRota = (pathname: string): Chave =>
  ROTAS[pathname as keyof typeof ROTAS] ?? 'notFound'

const fichaDoSite = (descricao: string, recursos: readonly string[]) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Cryptographer',
  url: `${SITE}/`,
  description: descricao,
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requer um navegador com Web Crypto API',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
  featureList: recursos,
  author: { '@type': 'Person', name: 'Pedro Aruanã' },
  codeRepository: 'https://github.com/Pedroaruana/Cryptographer'
})

export type Cabecalho = {
  title: string
  description: string
  url: string
  locale: string
  htmlLang: string
  naoIndexar: boolean
  ficha: object | null
}

// so calcula, nao encosta em nada. o navegador usa isso pra trocar as tags na
// hora, e o gerador de html estatico usa pra escrever elas direto no arquivo
export const montarSeo = ({
  pathname,
  lang,
  t
}: {
  pathname: string
  lang: Lang
  t: Dict
}): Cabecalho => {
  const chave = chaveDaRota(pathname)
  const pagina = t.seo[chave]

  return {
    title: chave === 'home' ? pagina.title : `${pagina.title} | Cryptographer`,
    description: pagina.description,
    url: `${SITE}${pathname === '/' ? '/' : pathname}`,
    locale: lang === 'pt' ? 'pt_BR' : 'en_US',
    htmlLang: lang === 'pt' ? 'pt-BR' : 'en',
    naoIndexar: chave === 'notFound',
    ficha: chave === 'home' ? fichaDoSite(pagina.description, t.seo.features) : null
  }
}

export const DADOS_ID = 'dados-estruturados'

// acha a tag no cabecalho ou cria ela na hora. o index.html ja nasce com as
// principais, entao na maioria das vezes so troca o valor
const gravar = (seletor: string, criar: () => HTMLElement, valor: string, campo = 'content') => {
  let tag = document.head.querySelector(seletor)

  if (!tag) {
    tag = criar()
    document.head.appendChild(tag)
  }

  tag.setAttribute(campo, valor)
}

const meta = (campo: 'name' | 'property', valor: string) => () => {
  const tag = document.createElement('meta')
  tag.setAttribute(campo, valor)

  return tag
}

const apagar = (seletor: string) => document.head.querySelector(seletor)?.remove()

export const aplicarSeo = (cabecalho: Cabecalho) => {
  document.title = cabecalho.title
  document.documentElement.lang = cabecalho.htmlLang

  gravar('meta[name="description"]', meta('name', 'description'), cabecalho.description)
  gravar('meta[property="og:title"]', meta('property', 'og:title'), cabecalho.title)
  gravar(
    'meta[property="og:description"]',
    meta('property', 'og:description'),
    cabecalho.description
  )
  gravar('meta[property="og:url"]', meta('property', 'og:url'), cabecalho.url)
  gravar('meta[property="og:locale"]', meta('property', 'og:locale'), cabecalho.locale)

  gravar(
    'link[rel="canonical"]',
    () => {
      const tag = document.createElement('link')
      tag.setAttribute('rel', 'canonical')

      return tag
    },
    cabecalho.url,
    'href'
  )

  // a tela de erro nao entra em indice nenhum, senao endereco errado vira
  // pagina de resultado
  if (cabecalho.naoIndexar) gravar('meta[name="robots"]', meta('name', 'robots'), 'noindex')
  else apagar('meta[name="robots"]')

  apagar(`script#${DADOS_ID}`)

  if (cabecalho.ficha) {
    const script = document.createElement('script')
    script.id = DADOS_ID
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(cabecalho.ficha)
    document.head.appendChild(script)
  }
}
