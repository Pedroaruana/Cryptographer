import { useLang } from '../i18n/context'

type Which = 'privacy' | 'terms' | 'cookies'

export const Legal = ({ which }: { which: Which }) => {
  const { t } = useLang()
  const page = t.legal[which]

  return (
    <section className="wrap py-14 max-w-[720px]">
      <h1 className="display text-[clamp(2rem,5vw,3rem)] m-0">{page.title}</h1>

      <p className="mt-2 text-[0.8rem] text-faint">
        {t.legal.updated} {t.legal.date}
      </p>

      <p className="mt-6 text-[1.05rem] leading-relaxed">{page.lead}</p>

      <div className="mt-10 grid gap-7">
        {page.blocks.map((block) => (
          <article key={block.h}>
            <h2 className="text-[1.15rem] font-bold m-0 mb-2">{block.h}</h2>
            <p className="m-0 leading-relaxed text-faint">{block.p}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
