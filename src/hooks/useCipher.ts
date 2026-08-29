import { useCallback, useEffect, useRef, useState } from 'react'
import { CryptoError } from '../crypto/format'
import type { WorkerRequest, WorkerResponse } from '../crypto/worker'

export type CipherStatus = 'idle' | 'working' | 'done' | 'error'

export type CipherResult =
  | { kind: 'file'; blob: Blob; name: string }
  | { kind: 'text'; text: string }

// a barra nunca pula direto pro numero que o worker mandou, ela persegue esse
// numero de frame em frame, so pra ficar continuo
const CHASE = 0.08

// tempo minimo da animacao. arquivo de 2 KB termina em milissegundos e sem
// isso o lacre piscava e sumia antes da pessoa ver
const MIN_MS = 1000

export const useCipher = () => {
  const [status, setStatus] = useState<CipherStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<CipherResult | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  const workerRef = useRef<Worker | null>(null)
  const targetRef = useRef(0)
  const shownRef = useRef(0)
  const frameRef = useRef(0)
  const timerRef = useRef(0)
  const startedRef = useRef(0)

  const stopTimers = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    if (timerRef.current) clearTimeout(timerRef.current)
    frameRef.current = 0
    timerRef.current = 0
  }

  // o loop cuida so do numero na tela. a entrega do resultado NAO passa por
  // aqui de proposito: em aba escondida o requestAnimationFrame para de
  // rodar, e antes disso o resultado ficava preso pra sempre
  const startLoop = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)

    const step = () => {
      shownRef.current += (targetRef.current - shownRef.current) * CHASE
      setProgress(shownRef.current)
      frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    return () => {
      stopTimers()
      workerRef.current?.terminate()
    }
  }, [])

  const reset = useCallback(() => {
    stopTimers()
    targetRef.current = 0
    shownRef.current = 0
    setProgress(0)
    setResult(null)
    setErrorCode(null)
    setStatus('idle')
  }, [])

  const run = useCallback(
    (request: WorkerRequest) => {
      stopTimers()
      targetRef.current = 0
      shownRef.current = 0
      startedRef.current = performance.now()
      setProgress(0)
      setResult(null)
      setErrorCode(null)
      setStatus('working')

      // worker novo a cada rodada. e barato e evita ficar com estado velho
      // preso la dentro se a rodada anterior deu erro
      workerRef.current?.terminate()
      const worker = new Worker(new URL('../crypto/worker.ts', import.meta.url), { type: 'module' })
      workerRef.current = worker

      const finish = (value: CipherResult) => {
        stopTimers()
        shownRef.current = 1
        setProgress(1)
        setResult(value)
        setStatus('done')
      }

      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const message = event.data

        if (message.kind === 'progress') {
          targetRef.current = Math.max(targetRef.current, message.value)
          return
        }

        if (message.kind === 'failed') {
          stopTimers()
          setErrorCode(message.code)
          setStatus('error')
          return
        }

        const value: CipherResult =
          message.kind === 'file-done'
            ? { kind: 'file', blob: message.blob, name: message.name }
            : { kind: 'text', text: message.text }

        targetRef.current = 1

        // segura o final ate a animacao ter tido tempo de acontecer
        const left = Math.max(0, MIN_MS - (performance.now() - startedRef.current))
        timerRef.current = window.setTimeout(() => finish(value), left)
      }

      // sem isso, worker que falha ao carregar deixa a tela girando pra
      // sempre e a pessoa nao entende o que aconteceu
      worker.onerror = (event) => {
        console.error('worker morreu:', event.message)
        stopTimers()
        setErrorCode('unknown')
        setStatus('error')
      }

      worker.postMessage(request)
      startLoop()
    },
    [startLoop]
  )

  // esteganografia precisa de canvas, que nao existe dentro do worker.
  // entao ela roda aqui, mas passa pelo mesmo estado e pela mesma animacao
  const runLocal = useCallback(
    (task: (onProgress: (value: number) => void) => Promise<CipherResult>) => {
      stopTimers()
      targetRef.current = 0
      shownRef.current = 0
      startedRef.current = performance.now()
      setProgress(0)
      setResult(null)
      setErrorCode(null)
      setStatus('working')
      startLoop()

      task((value) => {
        targetRef.current = Math.max(targetRef.current, value)
      })
        .then((value) => {
          targetRef.current = 1
          const left = Math.max(0, MIN_MS - (performance.now() - startedRef.current))

          timerRef.current = window.setTimeout(() => {
            stopTimers()
            shownRef.current = 1
            setProgress(1)
            setResult(value)
            setStatus('done')
          }, left)
        })
        .catch((error: unknown) => {
          stopTimers()
          setErrorCode(error instanceof CryptoError ? error.code : 'unknown')
          setStatus('error')
        })
    },
    [startLoop]
  )

  return { status, progress, result, errorCode, run, runLocal, reset }
}
