import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const KEY = 'cryptographer:theme'

const firstGuess = (): Theme => {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // armazenamento bloqueado, segue o sistema
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(firstGuess)

  useEffect(() => {
    // o atributo fica no html porque as variaveis de cor vivem no :root
    document.documentElement.dataset.theme = theme

    try {
      localStorage.setItem(KEY, theme)
    } catch {
      // sem problema, volta a seguir o sistema na proxima visita
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggle }
}
