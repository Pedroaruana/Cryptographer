import { useEffect, useMemo, useState } from 'react'
import { FileDrop } from '../components/FileDrop'
import { MAX_FILE_BYTES } from '../crypto/format'
import { lerMetadados, limparMetadados, type Metadados } from '../lib/exif'
import { useLang } from '../i18n/context'

export const MetadataPage = () => {
  const { t } = useLang()

  const [file, setFile] = useState<File | null>(null)
  const [meta, setMeta] = useState<Metadados | null>(null)
  const [lendo, setLendo] = useState(false)
  const [limpa, setLimpa] = useState<Blob | null>(null)

  // lê assim que a foto entra: aqui não tem senha nem botão, o dado já está
  // aberto no arquivo, só não estava à vista
  useEffect(() => {
    if (!file) {
      setMeta(null)
      setLimpa(null)
      return
    }

    let alive = true
    setLendo(true)

    lerMetadados(file)
      .then((achado) => {
        if (alive) setMeta(achado)
      })
      .catch(() => {
        if (alive) setMeta({ achados: [], coordenadas: null, temExif: false })
      })
      .finally(() => {
        if (alive) setLendo(false)
      })

    return () => {
      alive = false
    }
  }, [file])

  const urlLimpa = useMemo(() => (limpa ? URL.createObjectURL(limpa) : null), [limpa])

  useEffect(() => {
    return () => {
      if (urlLimpa) URL.revokeObjectURL(urlLimpa)
    }
  }, [urlLimpa])

  const limpar = async () => {
    if (!file) return
    setLimpa(await limparMetadados(file))
  }

  const coord = meta?.coordenadas

  return (
    <section className="wrap py-14">
      <p className="eyebrow">{t.meta.eyebrow}</p>
      <h1 className="display text-[clamp(2.2rem,6vw,3.6rem)] mt-2 mb-4">{t.meta.title}</h1>
      <p className="max-w-[62ch] text-faint m-0 leading-relaxed">{t.meta.lead}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <div className="sheet tilt-a p-6 sm:p-8">
          <FileDrop
            label={t.meta.drop}
            hint={t.meta.dropHint}
            formats={t.meta.formats}
            accept="image/*"
            maxBytes={MAX_FILE_BYTES}
            file={file}
            onPick={setFile}
          />

          {lendo && <p className="m-0 mt-5 text-[0.88rem] text-faint">{t.meta.reading}</p>}

          {meta && !lendo && !meta.temExif && (
            <p className="m-0 mt-5 text-[0.9rem]" role="status">
              {t.meta.nothing}
            </p>
          )}

          {meta?.temExif && (
            <div className="rise mt-6">
              {coord && (
                <div className="warn-box mb-6">
                  <h2 className="text-[1rem] font-bold m-0 mb-2">{t.meta.gpsTitle}</h2>
                  <p className="m-0 mb-3 text-[0.88rem] leading-relaxed">{t.meta.gpsNote}</p>

                  <p className="m-0 font-mono text-[1rem]">
                    {coord.lat.toFixed(6)}, {coord.lon.toFixed(6)}
                  </p>

                  <a
                    className="scribble text-[0.85rem] inline-block mt-3"
                    href={`https://www.openstreetmap.org/?mlat=${coord.lat}&mlon=${coord.lon}#map=16/${coord.lat}/${coord.lon}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.meta.gpsOpen}
                  </a>

                  <p className="m-0 mt-2 text-[0.78rem] text-faint">{t.meta.gpsLinkNote}</p>
                </div>
              )}

              <div className="anatomy">
                {meta.achados.map((achado) => (
                  <div key={achado.chave} className="anatomy-row" data-block={achado.sensivel}>
                    <code className="anatomy-name">{achado.chave}</code>
                    <span className="anatomy-note col-span-2">{achado.valor}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" className="btn" onClick={limpar}>
                  {t.meta.clean}
                </button>

                {urlLimpa && (
                  <a
                    className="btn btn-ghost no-underline"
                    href={urlLimpa}
                    download={`limpa-${file?.name ?? 'foto'}`}
                  >
                    {t.meta.download}
                  </a>
                )}
              </div>

              {limpa && (
                <p className="m-0 mt-4 text-[0.85rem] text-faint leading-relaxed" role="status">
                  {t.meta.cleanDone}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-8 content-start">
          <div className="sheet-soft p-6">
            <h2 className="text-[1.05rem] font-bold m-0 mb-4">{t.meta.howTitle}</h2>

            <ol className="list-none m-0 p-0 grid gap-4">
              {t.meta.howSteps.map((passo, index) => (
                <li key={passo.slice(0, 14)} className="flex gap-3">
                  <span className="font-mono text-[0.9rem] font-bold text-hair shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="m-0 text-[0.92rem] leading-relaxed text-faint">{passo}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="warn-box">
            <h2 className="text-[1.05rem] font-bold m-0 mb-4">{t.meta.warnTitle}</h2>

            <div className="grid gap-4">
              {t.meta.warns.map((aviso) => (
                <p key={aviso.slice(0, 16)} className="m-0 text-[0.88rem] leading-relaxed">
                  {aviso}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
