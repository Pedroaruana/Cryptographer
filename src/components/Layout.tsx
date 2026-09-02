import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { WarningBar } from './WarningBar'
import { useLang } from '../i18n/context'
import { aplicarSeo, montarSeo } from '../lib/seo'

export const Layout = () => {
  const { t, lang } = useLang()
  const { pathname } = useLocation()

  // titulo, descricao e endereco oficial de cada tela. antes as dez rotas
  // serviam o mesmo cabecalho, entao pro buscador so a home existia
  useEffect(() => {
    aplicarSeo(montarSeo({ pathname, lang, t }))
  }, [lang, pathname, t])

  // trocando de pagina eu volto pro topo. sem isso a pessoa cai no meio
  // da pagina nova, que e estranho.
  // as chaves aqui sao obrigatorias: sem elas o effect devolve o retorno do
  // scrollTo e o react tenta usar aquilo como funcao de limpeza
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-dvh flex flex-col">
      <a className="skip" href="#conteudo">
        {t.nav.skip}
      </a>

      <Header />

      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <WarningBar />
    </div>
  )
}
