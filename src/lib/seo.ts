export const SITE = 'https://cryptographer-seven.vercel.app'

export type SeoKey =
  | 'home'
  | 'encrypt'
  | 'decrypt'
  | 'hide'
  | 'metadata'
  | 'hash'
  | 'lab'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'notFound'

const ROTAS: Record<string, SeoKey> = {
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
}

export const chaveDaRota = (pathname: string): SeoKey => ROTAS[pathname] ?? 'notFound'

const DADOS_ID = 'dados-estruturados'

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

type Entrada = {
  pathname: string
  lang: 'pt' | 'en'
  title: string
  description: string
  // o cartao do site, so a home carrega. os buscadores de resposta leem isso
  // pra saber o que a pagina e sem ter que adivinhar pelo texto
  ficha?: object
}

export const aplicarSeo = ({ pathname, lang, title, description, ficha }: Entrada) => {
  const url = `${SITE}${pathname === '/' ? '/' : pathname}`

  document.title = title

  gravar('meta[name="description"]', meta('name', 'description'), description)
  gravar('meta[property="og:title"]', meta('property', 'og:title'), title)
  gravar('meta[property="og:description"]', meta('property', 'og:description'), description)
  gravar('meta[property="og:url"]', meta('property', 'og:url'), url)
  gravar(
    'meta[property="og:locale"]',
    meta('property', 'og:locale'),
    lang === 'pt' ? 'pt_BR' : 'en_US'
  )

  gravar(
    'link[rel="canonical"]',
    () => {
      const tag = document.createElement('link')
      tag.setAttribute('rel', 'canonical')

      return tag
    },
    url,
    'href'
  )

  // a tela de erro nao entra em indice nenhum, senao endereco errado vira
  // pagina de resultado
  if (chaveDaRota(pathname) === 'notFound') {
    gravar('meta[name="robots"]', meta('name', 'robots'), 'noindex')
  } else {
    apagar('meta[name="robots"]')
  }

  apagar(`script#${DADOS_ID}`)

  if (ficha) {
    const script = document.createElement('script')
    script.id = DADOS_ID
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(ficha)
    document.head.appendChild(script)
  }
}

export const fichaDoSite = (nome: string, descricao: string, recursos: string[]) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: nome,
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
