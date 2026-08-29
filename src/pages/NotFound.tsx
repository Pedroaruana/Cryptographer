import { Link } from 'react-router-dom'
import { useLang } from '../i18n/context'

export const NotFound = () => {
  const { t } = useLang()

  return (
    <section className="wrap py-24 text-center">
      {/* um envelope vazio, que e bem o que a pessoa achou aqui */}
      <svg
        width="120"
        height="88"
        viewBox="0 0 120 88"
        className="mx-auto mb-8 rotate-[-3deg]"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="116" height="84" className="f-card s-ink" strokeWidth="2" rx="2" />
        <path d="M2 2 L60 52 L118 2" fill="none" className="s-ink" strokeWidth="2" />
        <path
          d="M40 44 L80 44"
          className="s-ink"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>

      <h1 className="display text-[clamp(1.8rem,5vw,2.8rem)] m-0">{t.notFound.title}</h1>
      <p className="text-faint mt-3 mb-8">{t.notFound.text}</p>

      <Link to="/" className="btn no-underline">
        {t.notFound.cta}
      </Link>
    </section>
  )
}
