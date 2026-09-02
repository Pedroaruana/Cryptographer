import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/shantell-sans'
import './styles/globals.css'
import { App } from './App'

const root = document.getElementById('root')

if (!root) throw new Error('nao achei a div root no index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// o site inteiro fica guardado no navegador depois da primeira visita, entao
// ele abre sem rede. so em producao: em desenvolvimento isso serviria arquivo
// velho e ia confundir mais do que ajudar
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // navegador sem suporte ou aba anonima. o site funciona igual, so nao
      // fica disponivel offline
    })
  })
}
