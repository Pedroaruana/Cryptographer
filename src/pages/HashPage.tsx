import { useId, useState } from 'react'
import { FileDrop } from '../components/FileDrop'
import { useCipher } from '../hooks/useCipher'
import { HASH_IDS, type HashId } from '../crypto/hash'
import { MAX_FILE_BYTES } from '../crypto/format'
import { useLang } from '../i18n/context'

export const HashPage = () => {
  const { t } = useLang()

  const [tab, setTab] = useState<'file' | 'text'>('file')
  const [algo, setAlgo] = useState<HashId>('SHA-256')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [expected, setExpected] = useState('')
  const [copied, setCopied] = useState(false)
  const verifyId = useId()

  const { status, progress, result, run, reset } = useCipher()

  const busy = status === 'working'
  const ready = tab === 'file' ? Boolean(file) : text.length > 0
  const digest = result?.kind === 'text' ? result.text : ''

  // comparo sem ligar pra maiuscula e pra espaco colado sem querer
  const cleaned = expected.trim().toLowerCase()
  const verdict = digest && cleaned ? cleaned === digest : null

  const start = () => {
    if (!ready) return

    if (tab === 'file' && file) run({ kind: 'hash-file', file, algo })
    else run({ kind: 'hash-text', text, algo })
  }

  return (
    <section className="wrap py-14">
      <p className="eyebrow">{t.hash.eyebrow}</p>
      <h1 className="display text-[clamp(2.2rem,6vw,3.6rem)] mt-2 mb-4">{t.hash.title}</h1>
      <p className="max-w-[62ch] text-faint m-0 leading-relaxed">{t.hash.lead}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
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
                  reset()
                }}
              >
                {option === 'file' ? t.hash.tabFile : t.hash.tabText}
              </button>
            ))}
          </div>

          {tab === 'file' ? (
            <FileDrop
              label={t.hash.drop}
              hint={t.hash.dropHint}
              formats={t.form.anyFile}
              maxBytes={MAX_FILE_BYTES}
              file={file}
              onPick={(picked) => {
                setFile(picked)
                reset()
              }}
            />
          ) : (
            <textarea
              className="field min-h-[150px] resize-y px-3 py-3"
              style={{ border: '1.5px solid var(--color-ink)' }}
              value={text}
              placeholder={t.hash.textPlaceholder}
              spellCheck={false}
              onChange={(event) => {
                setText(event.target.value)
                reset()
              }}
            />
          )}

          <div className="mt-7">
            <span className="eyebrow block mb-2">{t.hash.algo}</span>

            <div className="flex flex-wrap gap-2">
              {HASH_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="chip"
                  data-on={algo === id}
                  disabled={busy}
                  onClick={() => {
                    setAlgo(id)
                    reset()
                  }}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn" disabled={!ready || busy} onClick={start}>
              {busy ? t.hash.working : t.hash.action}
            </button>

            {status !== 'idle' && !busy && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  reset()
                  setFile(null)
                  setText('')
                  setExpected('')
                  setCopied(false)
                }}
              >
                {t.hash.again}
              </button>
            )}
          </div>

          <p className="mt-7 mb-0 text-[0.82rem] text-faint leading-relaxed">{t.hash.note}</p>
        </div>

        <div>
          {/* a impressao digital sai numa faixa larga, quebrada em blocos de
              oito, que e como todo site de download mostra */}
          <div className="sheet-soft p-6 min-h-[140px] flex items-center">
            <p className="m-0 font-mono text-[0.95rem] break-all leading-relaxed">
              {digest
                ? digest.match(/.{1,8}/g)?.join(' ')
                : busy
                  ? `${Math.round(progress * 100)}%`
                  : '...'}
            </p>
          </div>

          {digest && (
            <>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={async () => {
                    await navigator.clipboard.writeText(digest)
                    setCopied(true)
                  }}
                >
                  {copied ? t.hash.copied : t.hash.copy}
                </button>
              </div>

              <div className="mt-8">
                <label className="eyebrow block mb-2" htmlFor={verifyId}>
                  {t.hash.verify}
                </label>
                <input
                  id={verifyId}
                  className="field font-mono text-[0.85rem]"
                  value={expected}
                  placeholder={t.hash.verifyPlaceholder}
                  spellCheck={false}
                  onChange={(event) => setExpected(event.target.value)}
                />

                {verdict !== null && (
                  <p
                    className="mt-3 mb-0 text-[0.9rem] font-bold"
                    role="status"
                    style={{ color: verdict ? 'var(--color-pen)' : 'var(--color-wax)' }}
                  >
                    {verdict ? t.hash.match : t.hash.noMatch}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
