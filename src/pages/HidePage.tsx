import { useEffect, useId, useMemo, useState } from 'react'
import { FileDrop } from '../components/FileDrop'
import { PasswordField } from '../components/PasswordField'
import { useCipher } from '../hooks/useCipher'
import { MAX_FILE_BYTES } from '../crypto/format'
import { hideInImage, imageCapacity, revealFromImage } from '../crypto/stego'
import { hideInAudio, revealFromAudio, wavCapacity } from '../crypto/stegoWav'
import { useLang } from '../i18n/context'

type Tab = 'hide' | 'reveal'

const enxuto = (valor: number, casas: number) =>
  Number.isInteger(valor) ? String(valor) : valor.toFixed(casas)

const readable = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${enxuto(bytes / 1024, 1)} KB`

  return `${enxuto(bytes / 1024 / 1024, 1)} MB`
}

export const HidePage = () => {
  const { t } = useLang()
  const secretId = useId()

  const [tab, setTab] = useState<Tab>('hide')
  const [file, setFile] = useState<File | null>(null)
  const [secret, setSecret] = useState('')
  const [password, setPassword] = useState('')
  const [room, setRoom] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const { status, progress, result, errorCode, runLocal, reset } = useCipher()

  const ehAudio = Boolean(file && /\.wav$/i.test(file.name))
  const busy = status === 'working'
  const hiding = tab === 'hide'

  const ready = Boolean(file) && (hiding ? secret.trim().length > 0 : true)

  // mostro o espaco disponivel assim que a foto entra, senao a pessoa escreve
  // um texto longo e so descobre que nao cabe depois de clicar
  useEffect(() => {
    if (!file || !hiding) {
      setRoom(null)
      return
    }

    let alive = true

    const medir = ehAudio
      ? file.arrayBuffer().then((buffer) => wavCapacity(new Uint8Array(buffer)))
      : imageCapacity(file)

    medir
      .then((value) => {
        if (alive) setRoom(value)
      })
      .catch(() => {
        if (alive) setRoom(null)
      })

    return () => {
      alive = false
    }
  }, [file, hiding, ehAudio])

  const downloadUrl = useMemo(
    () => (result?.kind === 'file' ? URL.createObjectURL(result.blob) : null),
    [result]
  )

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    }
  }, [downloadUrl])

  const start = () => {
    if (!ready || !file) return

    const semExtensao = file.name.replace(/\.[^.]+$/, '')

    if (hiding) {
      runLocal(async (onProgress) => ({
        kind: 'file',
        blob: ehAudio
          ? await hideInAudio(file, secret, password, onProgress)
          : await hideInImage(file, secret, password, onProgress),
        name: `${semExtensao}-com-segredo${ehAudio ? '.wav' : '.png'}`
      }))
      return
    }

    runLocal(async (onProgress) => ({
      kind: 'text',
      text: ehAudio
        ? await revealFromAudio(file, password, onProgress)
        : await revealFromImage(file, password, onProgress)
    }))
  }

  const errorText = errorCode
    ? (t.errors[errorCode as keyof typeof t.errors] ?? t.errors.unknown)
    : null

  return (
    <section className="wrap py-14">
      <p className="eyebrow">{t.hide.eyebrow}</p>
      <h1 className="display text-[clamp(2.2rem,6vw,3.6rem)] mt-2 mb-4">{t.hide.title}</h1>
      <p className="max-w-[62ch] text-faint m-0 leading-relaxed">{t.hide.lead}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <div className="sheet tilt-a p-6 sm:p-8">
          <div className="flex gap-2 mb-6">
            {(['hide', 'reveal'] as const).map((option) => (
              <button
                key={option}
                type="button"
                className="chip"
                data-on={tab === option}
                disabled={busy}
                onClick={() => {
                  setTab(option)
                  setFile(null)
                  reset()
                }}
              >
                {option === 'hide' ? t.hide.tabHide : t.hide.tabReveal}
              </button>
            ))}
          </div>

          <FileDrop
            label={hiding ? t.hide.drop : t.hide.dropReveal}
            hint={ehAudio ? t.hide.dropHintAudio : t.hide.dropHint}
            formats={t.hide.formats}
            accept="image/png,image/bmp,image/webp,audio/wav,.wav"
            maxBytes={MAX_FILE_BYTES}
            file={file}
            onPick={(picked) => {
              setFile(picked)
              reset()
            }}
          />

          {room !== null && (
            <p className="m-0 mt-3 text-[0.82rem] text-faint">
              {t.hide.room.replace('{size}', readable(room))}
            </p>
          )}

          <div className="mt-7 grid gap-6">
            {hiding && (
              <div>
                <label className="eyebrow block mb-1" htmlFor={secretId}>
                  {t.hide.secret}
                </label>
                <textarea
                  id={secretId}
                  className="field min-h-[110px] resize-y px-3 py-3"
                  style={{ border: '1.5px solid var(--color-ink)' }}
                  value={secret}
                  placeholder={t.hide.secretPlaceholder}
                  spellCheck={false}
                  onChange={(event) => {
                    setSecret(event.target.value)
                    reset()
                  }}
                />
              </div>
            )}

            <div>
              <PasswordField
                value={password}
                onChange={(value) => {
                  setPassword(value)
                  if (status !== 'idle') reset()
                }}
                withMeter={hiding && password.length > 0}
              />

              {/* a senha e opcional de proposito. sem ela o segredo entra
                  como texto puro e qualquer ferramenta le, que e como a
                  maioria dos sites de esteganografia funciona */}
              {hiding && (
                <p
                  className={password.length > 0 ? 'lock-note' : 'lock-note lock-note--open'}
                  role="status"
                >
                  {password.length > 0 ? t.hide.withPassword : t.hide.withoutPassword}
                </p>
              )}

              {!hiding && (
                <p className="m-0 mt-3 text-[0.82rem] text-faint leading-relaxed">
                  {t.hide.revealNote}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn" disabled={!ready || busy} onClick={start}>
              {busy
                ? hiding
                  ? t.hide.working
                  : t.hide.workingReveal
                : hiding
                  ? t.hide.action
                  : t.hide.actionReveal}
            </button>

            {status !== 'idle' && !busy && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  reset()
                  setFile(null)
                  setSecret('')
                  setPassword('')
                  setCopied(false)
                }}
              >
                {t.hide.again}
              </button>
            )}
          </div>

          {errorText && (
            <p className="m-0 mt-5 text-[0.88rem] text-wax leading-relaxed" role="alert">
              {errorText}
            </p>
          )}

          {status === 'done' && (
            <p className="m-0 mt-5 text-[0.88rem]" role="status">
              {hiding ? t.hide.done : t.hide.doneReveal}
            </p>
          )}

          {busy && (
            <div className="gauge mt-5">
              <div className="gauge-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          )}

          {result?.kind === 'file' && downloadUrl && (
            <div className="rise mt-6">
              <a className="btn no-underline" href={downloadUrl} download={result.name}>
                {ehAudio ? t.hide.downloadAudio : t.hide.download}
              </a>
            </div>
          )}

          {result?.kind === 'text' && (
            <div className="rise mt-6">
              <p className="m-0 mb-3 font-mono text-[1rem] break-all sheet-soft p-4">
                {result.text}
              </p>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={async () => {
                  await navigator.clipboard.writeText(result.text)
                  setCopied(true)
                }}
              >
                {copied ? t.hide.copied : t.hide.copy}
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-8 content-start">
          <div className="sheet-soft p-6">
            <h2 className="text-[1.05rem] font-bold m-0 mb-4">{t.hide.howTitle}</h2>

            <ol className="list-none m-0 p-0 grid gap-4">
              {t.hide.howSteps.map((step, index) => (
                <li key={step.slice(0, 14)} className="flex gap-3">
                  <span className="font-mono text-[0.9rem] font-bold text-hair shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="m-0 text-[0.92rem] leading-relaxed text-faint">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* os avisos ficam do lado do formulario de proposito. essas quatro
              coisas sao o que faz o segredo se perder na pratica */}
          <div className="warn-box">
            <h2 className="text-[1.05rem] font-bold m-0 mb-4">{t.hide.warnTitle}</h2>

            <div className="grid gap-4">
              {[
                t.hide.warnJpeg,
                t.hide.warnMp3,
                t.hide.warnEdit,
                t.hide.warnSocial,
                t.hide.warnAlpha
              ].map((aviso) => (
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
