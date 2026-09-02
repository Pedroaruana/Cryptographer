import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LangProvider } from './i18n/context'
import { Rotas } from './App'
import { pt } from './i18n/pt'
import { montarSeo } from './lib/seo'

// desenha uma tela inteira em texto, sem navegador nenhum. e isso que o robo
// que nao roda javascript vai ler quando abrir o site
export const render = (rota: string) => ({
  corpo: renderToString(
    <ErrorBoundary>
      <LangProvider inicial="pt">
        <StaticRouter location={rota}>
          <Rotas />
        </StaticRouter>
      </LangProvider>
    </ErrorBoundary>
  ),
  cabecalho: montarSeo({ pathname: rota, lang: 'pt', t: pt })
})

export { CAMINHOS } from './lib/seo'
