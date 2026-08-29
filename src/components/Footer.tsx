import { Link } from 'react-router-dom'
import { useLang } from '../i18n/context'

export const Footer = () => {
  const { t } = useLang()

  return (
    <footer className="mt-24 border-t border-hair/70">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-8 text-[0.85rem] text-faint">
        <p className="m-0">{t.footer.tag}</p>

        <nav className="flex flex-wrap items-center gap-5">
          <Link to="/privacy" className="scribble text-ink">
            {t.footer.privacy}
          </Link>
          <Link to="/terms" className="scribble text-ink">
            {t.footer.terms}
          </Link>
          <Link to="/cookies" className="scribble text-ink">
            {t.footer.cookies}
          </Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="scribble text-ink"
          >
            {t.footer.source}
          </a>
        </nav>
      </div>
    </footer>
  )
}
