import { Link } from 'react-router-dom'
import { Bookshelf } from '../components/Bookshelf'
import { CipherDisc } from '../components/CipherDisc'
import { StepsNote } from '../components/StepsNote'
import { XrayLens } from '../components/XrayLens'
import { useLang } from '../i18n/context'

export const Home = () => {
  const { lang, t } = useLang()

  const lensHint = lang === 'pt' ? 'passe a lupa por cima' : 'run the lens over it'

  return (
    <>
      <section className="wrap pt-16 pb-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="eyebrow">{t.home.eyebrow}</p>

          <h1 className="display text-[clamp(2.6rem,7.5vw,4.4rem)] mt-3 mb-5">
            {t.home.titleA}
            <br />
            {t.home.titleB}
            <br />
            {t.home.titleC}
          </h1>

          <p className="max-w-[46ch] text-[1.05rem] leading-relaxed m-0">{t.home.lead}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/encrypt" className="btn no-underline">
              {t.home.ctaPrimary}
            </Link>
            <Link to="/decrypt" className="scribble font-bold">
              {t.home.ctaSecondary}
            </Link>
          </div>

          <p className="mt-6 text-[0.82rem] text-faint m-0">{t.home.trust}</p>
        </div>

        {/* o quadro mais visto do mundo, e mesmo assim ninguem sabe o que
            tem por baixo da tinta. achei que combinava */}
        <div className="tilt-b">
          <XrayLens
            src="/monalisa.webp"
            alt="Mona Lisa"
            hint={lensHint}
            token={t.home.lensToken}
            radius={150}
          />
        </div>
      </section>

      <section className="wrap py-16">
        <p className="eyebrow">{t.home.stepsEyebrow}</p>
        <h2 className="display text-[clamp(1.9rem,4.5vw,3rem)] mt-2 mb-14">{t.home.stepsTitle}</h2>

        <StepsNote />
      </section>

      <section className="wrap py-16 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <p className="eyebrow">{t.home.whyEyebrow}</p>
          <h2 className="display text-[clamp(1.8rem,4vw,2.7rem)] mt-2 mb-4">{t.home.whyTitle}</h2>
          <p className="m-0 leading-relaxed max-w-[52ch]">{t.home.whyText}</p>
        </div>

        <ul className="sheet tilt-c list-none m-0 p-7 grid gap-3">
          {t.home.whyPoints.map((point) => (
            <li key={point} className="flex gap-3 items-start text-[0.95rem]">
              <span className="text-accent font-bold">+</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* disco de cifra do Alberti, de 1467. gira sozinho devagar e para
          quando o mouse encosta. e o avo de tudo que o site faz */}
      <section className="wrap py-20 grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <CipherDisc />

        <div>
          <p className="eyebrow">{t.lab.eyebrow}</p>
          <h2 className="display text-[clamp(2rem,5vw,3.2rem)] mt-2 mb-4">{t.lab.title}</h2>
          <p className="text-faint m-0 max-w-[46ch] leading-relaxed">{t.lab.lead}</p>

          <p className="mt-7 mb-8 max-w-[46ch] leading-relaxed">{t.disc.lead}</p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/simuladores" className="btn no-underline">
              {t.lab.seeAll}
            </Link>
            <Link to="/encrypt" className="scribble font-bold">
              {t.home.closingCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap py-16">
        <p className="eyebrow">{t.shelf.eyebrow}</p>
        <h2 className="display text-[clamp(1.9rem,4.5vw,3rem)] mt-2 mb-3">{t.shelf.title}</h2>
        <p className="max-w-[58ch] text-faint m-0 mb-12 leading-relaxed">{t.shelf.lead}</p>

        <Bookshelf />
      </section>
    </>
  )
}
