import { useRef } from 'react'
import { useLang } from '../../i18n/context'

export const Timeline = () => {
  const { t } = useLang()
  const stripRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ from: number; left: number } | null>(null)

  const onDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const strip = stripRef.current
    if (!strip) return

    dragRef.current = { from: event.clientX, left: strip.scrollLeft }
    strip.setPointerCapture(event.pointerId)
  }

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const strip = stripRef.current
    if (!drag || !strip) return

    strip.scrollLeft = drag.left - (event.clientX - drag.from)
  }

  const onUp = () => {
    dragRef.current = null
  }

  return (
    <div>
      <div
        ref={stripRef}
        className="timeline"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="timeline-rail">
          {t.lab.time.marks.map(([year, note], index) => (
            <div
              key={year + index}
              className="stop"
              style={{ ['--turn' as string]: `${index % 2 ? 5 : -6}deg` }}
            >
              <span className="stop-seal">{index + 1}</span>
              <span className="stop-year">{year}</span>
              <p>{note}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="m-0 mt-2 text-[0.8rem] text-faint">{t.lab.time.drag}</p>
    </div>
  )
}
