import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { en, type Dict } from './en'
import { pt } from './pt'

export type Lang = 'pt' | 'en'

const STORAGE_KEY = 'cryptographer:lang'

const dictionaries: Record<Lang, Dict> = { pt, en }

type LangValue = {
  lang: Lang
  t: Dict
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangValue | null>(null)

// navegador com armazenamento bloqueado (aba anonima, bloqueador de anuncio)
// joga excecao so de encostar no localStorage. se isso estourar no meio do
// render a pagina inteira fica branca, entao vai tudo dentro de try
const readSaved = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const writeSaved = (lang: Lang) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // sem problema, a pessoa so perde a escolha quando recarregar
  }
}

// na primeira visita eu chuto pelo idioma do navegador, depois vale
// o que a pessoa escolheu
const firstGuess = (): Lang => {
  const saved = readSaved()
  if (saved === 'pt' || saved === 'en') return saved

  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(firstGuess)

  useEffect(() => {
    writeSaved(lang)
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  const setLang = useCallback((next: Lang) => setLangState(next), [])

  const value = useMemo(() => ({ lang, t: dictionaries[lang], setLang }), [lang, setLang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

// se por algum motivo o contexto nao chegou, devolvo o ingles em vez de
// derrubar a tela. texto errado e chato, tela branca e pior
const fallback: LangValue = { lang: 'en', t: en, setLang: () => {} }

export const useLang = () => useContext(LangContext) ?? fallback
