import { useEffect, useId, useMemo, useState } from 'react'
import { FileDrop } from '../components/FileDrop'
import { MethodPicker } from '../components/MethodPicker'
import { PasswordField } from '../components/PasswordField'
import { SealStage } from '../components/SealStage'
import { useCipher } from '../hooks/useCipher'
import { useLang } from '../i18n/context'
import { NEEDS_KEY, type MethodId } from '../crypto/classic'
import { ALGO_AES_GCM_ARGON2, EXTENSION, MAX_FILE_BYTES } from '../crypto/format'

type Mode = 'encrypt' | 'decrypt'
type Tab = 'file' | 'text'

export const CipherPage = ({ mode }: { mode: Mode }) => {
  const { t } = useLang()
  const copy = mode === 'encrypt' ? t.encrypt : t.decrypt

  const [tab, setTab] = useState<Tab>('file')
  const [method, setMethod] = useState<MethodId>('aes')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [copied, setCopied] = useState(false)
  const [archiveMode, setArchiveMode] = useState(false)
  const confirmId = useId()

  const { status, progress, result, errorCode, run, reset } = useCipher()

  const seguro = method === 'aes' || method === 'argon'
  const zipping = archiveMode && tab === 'file' && seguro
  const needsKey = NEEDS_KEY[method]
  const asksConfirm = mode === 'encrypt' && seguro
  const mismatch = asksConfirm && confirm.length > 0 && confirm !== password

  const ready =
    (!needsKey || password.length > 0) &&
    !mismatch &&
    (tab === 'file' ? Boolean(file) : text.trim().length > 0)

  // o link de download so existe enquanto o resultado existe. se eu esquecer
  // de revogar, o blob fica preso na memoria do navegador
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
    if (!ready) return

    const algo = method === 'argon' ? ALGO_AES_GCM_ARGON2 : undefined

    if (method !== 'aes' && method !== 'argon') {
      run({ kind: 'classic', id: method, text, key: password, back: mode === 'decrypt' })
      return
    }

    if (tab === 'file' && file) {
      if (zipping) {
        run({ kind: mode === 'encrypt' ? 'zip' : 'unzip', file, password })
        return
      }

      run({ kind: mode === 'encrypt' ? 'encrypt-file' : 'decrypt-file', file, password })
      return
    }

    if (mode === 'encrypt') run({ kind: 'encrypt-text', text, password, algo })
    else run({ kind: 'decrypt-text', text, password })
  }

  const startOver = () => {
    reset()
    setCopied(false)
    setFile(null)
    setText('')
    setPassword('')
    setConfirm('')
  }

  const stageLabel = tab === 'file' ? (file?.name ?? copy.drop) : copy.tabText

  const errorText = errorCode
    ? (t.errors[errorCode as keyof typeof t.errors] ?? t.errors.unknown)
    : null

  const busy = status === 'working'

  return (
    <section className="wrap py-14">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 className="display text-[clamp(2.2rem,6vw,3.6rem)] mt-2 mb-3">{copy.title}</h1>
      <p className="max-w-[46ch] text-faint m-0">{copy.lead}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-14">
        <div className="sheet tilt-a p-6 sm:p-8">
          <div className="flex gap-2 mb-6">
            {(['file', 'text'] as const).map((option) => (
              <button
                key={option}
                type="button"
                className="chip"
                data-on={tab === option}
                disabled={busy}
                onClick={() => {
                  setTab(option)
                  // arquivo so aceita AES, cifra classica nao mexe em binario
                  if (option === 'file') setMethod('aes')
                  reset()
                }}
              >
                {option === 'file' ? copy.tabFile : copy.tabText}
              </button>
            ))}
          </div>

          {tab === 'file' ? (
            <FileDrop
              label={copy.drop}
              hint={copy.dropHint}
              formats={mode === 'decrypt' ? (archiveMode ? '.zip' : '.cgph') : t.form.anyFile}
              accept={mode === 'decrypt' ? (archiveMode ? '.zip' : EXTENSION) : undefined}
              maxBytes={MAX_FILE_BYTES}
              file={file}
              onPick={(picked) => {
                setFile(picked)
                reset()
              }}
            />
          ) : (
            <textarea
              className="field min-h-[170px] resize-y px-3 py-3"
              style={{ border: '1.5px solid var(--color-ink)' }}
              value={text}
              placeholder={copy.textPlaceholder}
              spellCheck={false}
              onChange={(event) => {
                setText(event.target.value)
                reset()
              }}
            />
          )}

          <div className="mt-7 grid gap-6">
            {needsKey ? (
              <PasswordField
                value={password}
                onChange={(value) => {
                  setPassword(value)
                  if (status !== 'idle') reset()
                }}
                withMeter={mode === 'encrypt' && seguro}
              />
            ) : (
              <p className="m-0 text-[0.85rem] text-faint">{t.methods.noKey}</p>
            )}

            {asksConfirm && (
              <div>
                <label className="eyebrow block mb-1" htmlFor={confirmId}>
                  {t.form.confirm}
                </label>
                <input
                  id={confirmId}
                  className="field"
                  type="password"
                  value={confirm}
                  autoComplete="off"
                  onChange={(event) => setConfirm(event.target.value)}
                />
                {mismatch && (
                  <p className="m-0 mt-2 text-[0.82rem] text-wax" role="alert">
                    {t.form.mismatch}
                  </p>
                )}
              </div>
            )}

            {tab === 'file' && seguro && (
              <div>
                <span className="eyebrow block mb-2">{t.archive.pick}</span>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="chip"
                    data-on={!archiveMode}
                    disabled={busy}
                    onClick={() => {
                      setArchiveMode(false)
                      setFile(null)
                      reset()
                    }}
                  >
                    {t.archive.cgph}
                    <span className="opacity-70 text-[0.72rem]">{t.archive.cgphNote}</span>
                  </button>

                  <button
                    type="button"
                    className="chip"
                    data-on={archiveMode}
                    disabled={busy}
                    onClick={() => {
                      setArchiveMode(true)
                      setFile(null)
                      reset()
                    }}
                  >
                    {t.archive.zip}
                    <span className="opacity-70 text-[0.72rem]">{t.archive.zipNote}</span>
                  </button>
                </div>

                {archiveMode && (
                  <p className="m-0 mt-3 text-[0.82rem] text-faint leading-relaxed">
                    {t.archive.note}
                  </p>
                )}
              </div>
            )}

            <MethodPicker
              value={method}
              textMode={tab === 'text'}
              disabled={busy}
              onChange={(id) => {
                setMethod(id)
                reset()
              }}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" className="btn" disabled={!ready || busy} onClick={start}>
              {busy ? copy.working : copy.action}
            </button>

            {status !== 'idle' && !busy && (
              <button type="button" className="btn btn-ghost" onClick={startOver}>
                {copy.again}
              </button>
            )}
          </div>
        </div>

        <div className="lg:pt-6">
          <SealStage
            mode={mode}
            status={status}
            progress={progress}
            label={stageLabel}
            hint={status === 'done' ? copy.done : ''}
            errorText={errorText}
          />

          {result?.kind === 'file' && downloadUrl && (
            <div className="rise mt-6 flex justify-center">
              <a
                className="btn no-underline"
                href={downloadUrl}
                download={result.name}
                onClick={() => setCopied(false)}
              >
                {copy.download}
              </a>
            </div>
          )}

          {result?.kind === 'text' && (
            <div className="rise mt-6">
              <textarea
                className="sheet-soft w-full min-h-[150px] p-3 text-[0.78rem] font-mono resize-y"
                readOnly
                value={result.text}
              />

              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={async () => {
                    await navigator.clipboard.writeText(result.text)
                    setCopied(true)
                  }}
                >
                  {copied ? copy.copied : copy.copy}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
