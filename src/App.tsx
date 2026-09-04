import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { LangProvider } from './i18n/context'
import { CipherPage } from './pages/CipherPage'
import { HashPage } from './pages/HashPage'
import { KeyringPage } from './pages/KeyringPage'
import { Lab } from './pages/Lab'
import { HidePage } from './pages/HidePage'
import { MetadataPage } from './pages/MetadataPage'
import { Home } from './pages/Home'
import { Legal } from './pages/Legal'
import { NotFound } from './pages/NotFound'

// as rotas ficam soltas porque o gerador de html estatico monta elas com
// outro roteador, que nao depende da barra de endereco do navegador
export const Rotas = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/encrypt" element={<CipherPage mode="encrypt" />} />
      <Route path="/decrypt" element={<CipherPage mode="decrypt" />} />
      <Route path="/esconder" element={<HidePage />} />
      <Route path="/chaveiro" element={<KeyringPage />} />
      <Route path="/metadados" element={<MetadataPage />} />
      <Route path="/hash" element={<HashPage />} />
      <Route path="/simuladores" element={<Lab />} />
      <Route path="/privacy" element={<Legal which="privacy" />} />
      <Route path="/terms" element={<Legal which="terms" />} />
      <Route path="/cookies" element={<Legal which="cookies" />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)

export const App = () => (
  <ErrorBoundary>
    <LangProvider>
      <BrowserRouter>
        <Rotas />
      </BrowserRouter>
    </LangProvider>
  </ErrorBoundary>
)
