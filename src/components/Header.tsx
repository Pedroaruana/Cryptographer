import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useLang } from '../i18n/context'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `scribble text-[0.95rem] ${isActive ? 'font-bold' : ''}`

export const Header = () => {
  const { lang, setLang, t } = useLang()
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()

  const [open, setOpen] = useState(false)

  // trocou de pagina, fecha o menu. senao a pessoa clica num link e o painel
  // fica aberto por cima do conteudo novo
  useEffect(() => setOpen(false), [pathname])

  const links = (
    <>
      <NavLink to="/encrypt" className={linkClass}>
        {t.nav.encrypt}
      </NavLink>
      <NavLink to="/decrypt" className={linkClass}>
        {t.nav.decrypt}
      </NavLink>
      <NavLink to="/esconder" className={linkClass}>
        {t.nav.navHide}
      </NavLink>
      <NavLink to="/chaveiro" className={linkClass}>
        {t.nav.navKeys}
      </NavLink>
      <NavLink to="/metadados" className={linkClass}>
        {t.nav.navMeta}
      </NavLink>
      <NavLink to="/hash" className={linkClass}>
        {t.nav.hash}
      </NavLink>
      <NavLink to="/simuladores" className={linkClass}>
        {t.nav.navLab}
      </NavLink>
    </>
  )

  const langPicker = (
    <div className="flex items-center gap-1 text-[0.8rem]">
      {(['pt', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          className={`px-1.5 py-0.5 cursor-pointer bg-transparent border-0 font-sketch ${
            lang === option ? 'font-bold text-accent' : 'text-faint'
          }`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  )

  const themeButton = (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
      title={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
    >
      {theme === 'dark' ? (
        // sol desenhado a mao, com os raios de tamanhos diferentes
        <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.6" className="s-ink" fill="none" strokeWidth="1.7" />
          <g className="s-ink" strokeWidth="1.7" strokeLinecap="round">
            <path d="M12 1.8v3.1M12 19.2v3M2.2 12h3M18.9 12h3" />
            <path d="M5.1 5.4l2.1 2.2M16.9 16.6l2.1 2.1M18.8 5.3l-2 2.2M5.2 18.8l2.2-2.1" />
          </g>
        </svg>
      ) : (
        // lua, com a barriga um pouco torta pra nao parecer clipart
        <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20.4 14.6A8.9 8.9 0 0 1 9.1 3.4a9 9 0 1 0 11.3 11.2Z"
            className="s-ink"
            fill="none"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )

  return (
    <header className="border-b border-hair/70 relative">
      <div className="wrap flex items-center justify-between gap-4 py-5">
        <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
          {/* o lacrezinho do logo, com a mesma fechadura prensada do lacre
              grande. em svg pra nao depender de imagem */}
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            <circle cx="13" cy="13" r="10.5" fill="#9b2418" stroke="#6f1810" strokeWidth="1.4" />
            <g fill="#f9e7df" transform="translate(8.6 5.4) scale(0.37)">
              <circle cx="12" cy="11" r="6.4" />
              <path d="M9.5 15.6 L6.4 28.6 h11.2 l-3.1 -13 Z" />
            </g>
          </svg>
          <span className="font-bold tracking-tight">cryptographer</span>
        </Link>

        {/* a partir de 1040px cabe tudo numa linha. abaixo disso vira gaveta */}
        <nav className="hidden min-[1400px]:flex items-center gap-3 2xl:gap-5 [&>a]:whitespace-nowrap">
          {links}
          {langPicker}
          {themeButton}
          <Link to="/encrypt" className="btn no-underline text-[0.9rem] py-2 px-4">
            {t.home.ctaPrimary}
          </Link>
        </nav>

        <div className="flex min-[1400px]:hidden items-center gap-3">
          {themeButton}

          <button
            type="button"
            className="burger"
            aria-label={t.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {/* tres riscos tortos, cada um de um tamanho */}
            <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
              <g className="s-ink" strokeWidth="1.9" strokeLinecap="round">
                <path d={open ? 'M3 3 L19 13' : 'M2 3 C8 2.4 15 3.6 20 2.8'} />
                <path
                  d={open ? 'M19 3 L3 13' : 'M2 8 C9 7.4 14 8.6 19 8'}
                  opacity={open ? 1 : 0.9}
                />
                <path d="M2 13 C7 12.4 13 13.6 17 12.9" opacity={open ? 0 : 0.9} />
              </g>
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="drawer">
          <nav className="wrap flex flex-col gap-4 py-6">
            {links}

            <div className="flex items-center justify-between gap-4 pt-2">
              {langPicker}

              <Link to="/encrypt" className="btn no-underline text-[0.9rem] py-2 px-4">
                {t.home.ctaPrimary}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
