import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type State = { message: string | null }

// sem isso qualquer erro de render deixa a pagina branca e a pessoa nao faz
// ideia do que aconteceu. pelo menos aqui aparece o motivo na tela
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { message: null }

  static getDerivedStateFromError(error: unknown): State {
    return { message: error instanceof Error ? error.message : String(error) }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('quebrou:', error, info.componentStack)
  }

  render() {
    if (!this.state.message) return this.props.children

    return (
      <section className="wrap py-24 text-center">
        <h1 className="display text-[clamp(1.6rem,4vw,2.4rem)] m-0">Alguma coisa quebrou aqui.</h1>
        <p className="text-faint mt-3">{this.state.message}</p>

        <button type="button" className="btn mt-6" onClick={() => window.location.reload()}>
          Recarregar
        </button>
      </section>
    )
  }
}
