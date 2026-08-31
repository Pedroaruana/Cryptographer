import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  alt: string
  hint: string
  // o pedaco de chave escondido no meio do binario. vem de fora porque
  // muda de idioma junto com o resto do site
  token: string
  radius?: number
}

// tamanho de cada caractere na grade. testei com 9 e de longe virava bolinha,
// nao dava pra ler que era zero e um
const CELL = 16
const ZOOM = 1.18

// desenha a folha inteira de 0 e 1 uma vez so, fora da tela. o brilho de cada
// pedacinho do quadro vira a forca da tinta, entao de longe ainda da pra ver
// o desenho, so que escrito em binario
const paintSheet = (
  sheet: HTMLCanvasElement,
  image: HTMLImageElement | null,
  width: number,
  height: number,
  dpr: number,
  token: string
) => {
  sheet.width = Math.round(width * dpr)
  sheet.height = Math.round(height * dpr)

  const ctx = sheet.getContext('2d')
  if (!ctx) return

  // as cores saem do tema atual, senao no modo escuro a lupa mostra uma
  // folha branca no meio de uma mesa escura
  const root = getComputedStyle(document.documentElement)
  const sheetColor = root.getPropertyValue('--color-paper-deep').trim() || '#f2ede2'
  const inkColor = root.getPropertyValue('--color-ink').trim() || '#1a1209'

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = sheetColor
  ctx.fillRect(0, 0, width, height)

  const cols = Math.ceil(width / CELL)
  const rows = Math.ceil(height / (CELL * 1.12))

  let pixels: Uint8ClampedArray | null = null

  if (image) {
    // reduzo a imagem pro tamanho da grade de caracteres e leio o brilho
    // dali. ler pixel a pixel do tamanho real seria desperdicio
    const small = document.createElement('canvas')
    small.width = cols
    small.height = rows

    const smallCtx = small.getContext('2d', { willReadFrequently: true })

    if (smallCtx) {
      const scale = Math.max(cols / image.width, rows / image.height)
      const drawWidth = image.width * scale
      const drawHeight = image.height * scale

      smallCtx.drawImage(
        image,
        (cols - drawWidth) / 2,
        (rows - drawHeight) / 2,
        drawWidth,
        drawHeight
      )
      pixels = smallCtx.getImageData(0, 0, cols, rows).data
    }
  }

  ctx.font = `700 ${CELL - 2}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.textBaseline = 'top'

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let light = Math.random()

      if (pixels) {
        const at = (row * cols + col) * 4
        light = (pixels[at] * 0.299 + pixels[at + 1] * 0.587 + pixels[at + 2] * 0.114) / 255
      }

      // e tinta em papel, entao quanto mais escuro o pedaco do quadro, mais
      // forte o numero
      const alpha = 0.08 + (1 - light) * 0.92

      ctx.globalAlpha = alpha
      ctx.fillStyle = inkColor
      ctx.fillText(light > 0.5 ? '1' : '0', col * CELL, row * CELL * 1.12)
    }
  }

  ctx.globalAlpha = 1

  const waxColor = root.getPropertyValue('--color-wax').trim() || '#9b2418'
  const room = Math.max(1, cols - token.length)

  // um pedaco de chave, uma vez so, escondido em algum lugar do quadro.
  // quem passar a lupa por cima acha, quem nao passar nunca vai saber
  const tokenRow = Math.floor(rows * 0.42)
  const tokenCol = Math.min(room, Math.floor(cols * 0.34))

  // apaga os digitos que estavam nessas casas antes de escrever por cima.
  // sem isso o vermelho fica em cima do zero e nao da pra ler nenhum dos dois
  ctx.fillStyle = sheetColor
  ctx.fillRect(tokenCol * CELL - 2, tokenRow * CELL * 1.12 - 2, token.length * CELL + 4, CELL + 4)

  ctx.fillStyle = waxColor

  for (let i = 0; i < token.length; i++) {
    ctx.fillText(token[i], (tokenCol + i) * CELL, tokenRow * CELL * 1.12)
  }
}

export const XrayLens = ({ src, alt, hint, token, radius = 150 }: Props) => {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const sheetRef = useRef<HTMLCanvasElement | null>(null)
  const spotRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef(0)
  const driftRef = useRef(0)

  const [lensOn, setLensOn] = useState(false)
  const [artOk, setArtOk] = useState(true)

  // o recorte redondo e feito aqui dentro, com clip no canvas. tentei antes
  // com mask no css e o navegador ladrilhava a mascara pela imagem inteira
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const sheet = sheetRef.current
    const box = boxRef.current
    if (!canvas || !sheet || !box) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = box.clientWidth
    const height = box.clientHeight
    const dpr = Math.min(2, window.devicePixelRatio || 1)

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    if (!lensOn) return

    const { x, y } = spotRef.current

    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.clip()

    // aumenta em volta do ponto onde a lupa esta, senao nao parece lente,
    // parece buraco recortado
    ctx.translate(x, y)
    ctx.scale(ZOOM, ZOOM)
    ctx.translate(-x, -y)
    ctx.drawImage(sheet, 0, 0, width, height)
    ctx.restore()
  }, [lensOn, radius])

  const rebuild = useCallback(() => {
    const box = boxRef.current
    const canvas = canvasRef.current
    if (!box || !canvas) return

    const width = box.clientWidth
    const height = box.clientHeight
    if (!width || !height) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)

    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)

    if (!sheetRef.current) sheetRef.current = document.createElement('canvas')

    const image = imageRef.current
    paintSheet(
      sheetRef.current,
      image?.complete && image.naturalWidth ? image : null,
      width,
      height,
      dpr,
      token
    )

    if (!spotRef.current.x) spotRef.current = { x: width / 2, y: height / 2 }

    draw()
  }, [draw, token])

  useEffect(() => {
    rebuild()

    const box = boxRef.current
    if (!box) return

    const observer = new ResizeObserver(rebuild)
    observer.observe(box)

    // trocou o tema, a folha de binario tem que ser repintada nas cores novas
    const themeWatch = new MutationObserver(rebuild)
    themeWatch.observe(document.documentElement, { attributeFilter: ['data-theme'] })

    return () => {
      observer.disconnect()
      themeWatch.disconnect()
    }
  }, [rebuild])

  useEffect(() => {
    draw()
  }, [draw])

  const move = useCallback(
    (x: number, y: number) => {
      spotRef.current = { x, y }

      const box = boxRef.current
      if (box) {
        box.style.setProperty('--mx', `${x}px`)
        box.style.setProperty('--my', `${y}px`)
      }

      // uma redesenhada por quadro, senao o mouse rapido enfileira dezenas
      if (frameRef.current) return
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = 0
        draw()
      })
    },
    [draw]
  )

  // no celular nao existe passar o mouse, entao a lupa anda sozinha
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (canHover || calm) return

    const box = boxRef.current
    if (!box) return

    setLensOn(true)
    const started = performance.now()

    const step = (now: number) => {
      const time = (now - started) / 1000
      move(
        box.clientWidth * (0.5 + 0.28 * Math.sin(time * 0.6)),
        box.clientHeight * (0.5 + 0.22 * Math.sin(time * 0.9))
      )
      driftRef.current = requestAnimationFrame(step)
    }

    driftRef.current = requestAnimationFrame(step)

    return () => cancelAnimationFrame(driftRef.current)
  }, [move])

  const onPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = boxRef.current
    if (!box) return

    const rect = box.getBoundingClientRect()
    move(event.clientX - rect.left, event.clientY - rect.top)
  }

  return (
    <div
      ref={boxRef}
      className="xray"
      data-lens={lensOn}
      style={{ ['--r' as string]: `${radius}px` }}
      onPointerMove={(event) => {
        setLensOn(true)
        onPointer(event)
      }}
      onPointerDown={(event) => {
        setLensOn(true)
        onPointer(event)
      }}
      onPointerLeave={() => setLensOn(false)}
    >
      <img
        ref={imageRef}
        className="xray-art"
        src={src}
        alt={alt}
        style={{ display: artOk ? 'block' : 'none' }}
        onLoad={() => {
          setArtOk(true)
          rebuild()
        }}
        onError={() => {
          // se a imagem nao estiver na pasta public o efeito continua de pe,
          // so que com numero aleatorio no lugar do quadro
          setArtOk(false)
          rebuild()
        }}
      />
      <canvas ref={canvasRef} className="xray-code" aria-hidden="true" tabIndex={-1} />
      <div className="xray-ring" />
      <span className="xray-hint">{hint}</span>
    </div>
  )
}
