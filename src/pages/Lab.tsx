import { Link } from 'react-router-dom'
import { CipherDisc } from '../components/CipherDisc'
import { Avalanche } from '../components/sims/Avalanche'
import { CaesarCracker } from '../components/sims/CaesarCracker'
import { Enigma } from '../components/sims/Enigma'
import { Timeline } from '../components/sims/Timeline'
import { Vault } from '../components/sims/Vault'
import { useLang } from '../i18n/context'

export const Lab = () => {
  const { t } = useLang()

  // a bancada alterna de lado a cada simulador, senao vira uma pilha de
  // blocos iguais descendo a pagina
  const benches = [
    { key: 'enigma', copy: t.lab.enigma, rig: <Enigma /> },
    { key: 'crack', copy: t.lab.crack, rig: <CaesarCracker /> },
    { key: 'ava', copy: t.lab.ava, rig: <Avalanche /> },
    { key: 'vault', copy: t.lab.vault, rig: <Vault /> },
    { key: 'disc', copy: t.disc, rig: <CipherDisc /> },
    { key: 'time', copy: t.lab.time, rig: <Timeline /> }
  ]

  return (
    <section className="wrap py-14">
      <p className="eyebrow">{t.lab.eyebrow}</p>
      <h1 className="display text-[clamp(2.2rem,6vw,3.6rem)] mt-2 mb-4">{t.lab.title}</h1>
      <p className="max-w-[60ch] text-faint m-0 leading-relaxed">{t.lab.lead}</p>

      <div className="mt-14 grid gap-0">
        {benches.map((bench, index) => (
          <article key={bench.key} className={`bench ${index % 2 ? 'bench-flip' : ''}`}>
            <div className="bench-brief">
              <span className="bench-num">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="display text-[clamp(1.5rem,3vw,2.1rem)] mt-2 mb-3">
                {bench.copy.title}
              </h2>
              <p className="m-0 text-[1.02rem] leading-relaxed max-w-[52ch]">{bench.copy.lead}</p>

              <div className="bench-body grid gap-4 mt-5">
                {bench.copy.body.map((paragrafo) => (
                  <p
                    key={paragrafo.slice(0, 16)}
                    className="m-0 text-[0.93rem] leading-relaxed text-faint max-w-[56ch]"
                  >
                    {paragrafo}
                  </p>
                ))}
              </div>

              {/* como usar fica destacado, porque e a unica parte que a
                  pessoa precisa ler antes de mexer */}
              <p className="bench-tip">{bench.copy.tip}</p>
            </div>

            <div className="sheet tilt-c p-6 sm:p-8">{bench.rig}</div>
          </article>
        ))}
      </div>

      <div className="mt-16">
        <Link to="/" className="btn no-underline">
          {t.lab.back}
        </Link>
      </div>
    </section>
  )
}
