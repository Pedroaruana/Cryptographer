// desenhos a mao livre em svg. tudo com stroke, nada de preenchimento
// chapado. as cores vem por classe pra acompanhar o tema claro e escuro

// o emblema do lacre. selo de cera de verdade e um brasao prensado na cera,
// nao uma letra escrita. buraco de fechadura e o desenho que qualquer pessoa
// entende como trancado, e continua legivel em 20 pixels
// creme com sombra escura embaixo: a fechadura fica visivel tanto no lacre
// grande quanto no logo de 26 pixels, onde o tom escuro sumia na cera
export const Keyhole = ({ size = 34 }: { size?: number }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 24 32"
    aria-hidden="true"
    style={{ filter: 'drop-shadow(0 1.4px 0.6px rgba(60,10,4,0.7))' }}
  >
    <g fill="#f9e7df">
      <circle cx="12" cy="11" r="6.4" />
      <path d="M9.5 15.6 L6.4 28.6 h11.2 l-3.1 -13 Z" />
    </g>
  </svg>
)

// 01: uma foto presa com clipe, o arquivo que a pessoa vai trancar
export const SketchPhoto = () => (
  <svg viewBox="0 0 120 100" className="w-[120px] h-[100px]" aria-hidden="true">
    <rect
      x="18"
      y="16"
      width="80"
      height="68"
      rx="1"
      className="f-card s-ink"
      strokeWidth="1.8"
      transform="rotate(-3 58 50)"
    />
    <path
      d="M26 68 L44 48 L56 60 L70 40 L92 68"
      fill="none"
      className="s-ink"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="rotate(-3 58 50)"
    />
    <circle cx="76" cy="32" r="5" fill="none" className="s-ink" strokeWidth="1.6" />
    {/* o clipe de papel */}
    <path
      d="M84 8 C96 8 96 26 84 26 C74 26 74 12 82 12 C88 12 88 22 82 22"
      fill="none"
      className="s-pen"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

// 02: a chave com o corpo esticado feito mola. e literalmente o que o
// PBKDF2 faz com a senha, estica ela ate ficar cara de calcular
export const SketchKey = () => (
  <svg viewBox="0 0 120 100" className="w-[120px] h-[100px]" aria-hidden="true">
    <circle cx="26" cy="50" r="15" fill="none" className="s-ink" strokeWidth="1.9" />
    <circle cx="26" cy="50" r="6" fill="none" className="s-ink" strokeWidth="1.5" />
    <path
      d="M41 50 c4 0 4 -9 8 -9 s4 18 8 18 s4 -18 8 -18 s4 18 8 18 s4 -18 8 -18 s4 9 8 9"
      fill="none"
      className="s-ink"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path d="M89 50 h14" fill="none" className="s-ink" strokeWidth="1.9" strokeLinecap="round" />
    <path
      d="M95 50 v9 M103 50 v13"
      fill="none"
      className="s-ink"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <text x="60" y="88" fontSize="9" className="f-pen" textAnchor="middle" fontFamily="inherit">
      310.000x
    </text>
  </svg>
)

// 03: o envelope fechado com a cera, que e o que sai do site
export const SketchEnvelope = () => (
  <svg viewBox="0 0 120 100" className="w-[120px] h-[100px]" aria-hidden="true">
    <rect
      x="16"
      y="24"
      width="88"
      height="58"
      rx="1"
      className="f-card s-ink"
      strokeWidth="1.8"
      transform="rotate(2 60 53)"
    />
    <path
      d="M16 24 L60 58 L104 24"
      fill="none"
      className="s-ink"
      strokeWidth="1.6"
      transform="rotate(2 60 53)"
    />
    <path
      d="M60 53 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0"
      fill="#9b2418"
      stroke="#6f1810"
      strokeWidth="1.5"
    />
    <g fill="#f9e7df" transform="translate(55.5 45) scale(0.42)">
      <circle cx="12" cy="11" r="6.4" />
      <path d="M9.5 15.6 L6.4 28.6 h11.2 l-3.1 -13 Z" />
    </g>
  </svg>
)

// numero com um circulo torto de caneta em volta, tipo anotacao de caderno
export const CircledNumber = ({ value }: { value: string }) => (
  <span className="relative inline-block">
    <svg
      viewBox="0 0 56 44"
      className="absolute -left-2 -top-1 w-[56px] h-[44px]"
      aria-hidden="true"
    >
      <path
        d="M28 4 C44 4 52 13 52 22 C52 33 41 40 27 40 C13 40 4 32 4 22 C4 12 13 5 27 4 C36 4 44 7 48 12"
        fill="none"
        className="s-pen"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
    <span className="relative text-[1.5rem] font-bold leading-none">{value}</span>
  </span>
)

// seta tortinha entre um passo e outro
export const SketchArrow = () => (
  <svg viewBox="0 0 90 30" className="w-[90px] h-[30px]" aria-hidden="true">
    <path
      d="M4 18 C24 6 46 26 66 12"
      fill="none"
      className="s-ink"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeDasharray="5 5"
      opacity="0.55"
    />
    <path
      d="M60 8 L68 11 L62 18"
      fill="none"
      className="s-ink"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.55"
    />
  </svg>
)

// digital do polegar, pro passo do hash. arcos abertos em pontos diferentes,
// que e o que faz uma digital nao parecer um alvo de tiro
export const SketchFingerprint = () => (
  <svg viewBox="0 0 120 100" className="w-[120px] h-[100px]" aria-hidden="true">
    <g className="s-ink" fill="none" strokeWidth="1.7" strokeLinecap="round">
      <path d="M60 26 C70 26 77 34 77 44 C77 56 72 66 66 76" />
      <path d="M60 34 C67 34 71 40 71 47 C71 58 67 66 62 75" />
      <path d="M60 42 C64 42 66 45 66 49 C66 58 63 66 59 74" />
      <path d="M53 30 C45 34 42 42 43 52 C44 62 46 68 45 76" />
      <path d="M50 40 C46 45 45 52 46 60 C47 67 48 71 47 76" />
      <path d="M53 49 C51 54 51 60 52 66" />
    </g>
    <path
      d="M34 22 C44 12 76 12 86 22"
      className="s-pen"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeDasharray="4 5"
      opacity="0.7"
    />
  </svg>
)
