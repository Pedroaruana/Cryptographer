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
