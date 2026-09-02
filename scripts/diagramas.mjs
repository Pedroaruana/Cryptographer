import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

// desenha as imagens do projeto: os dois diagramas do README e o cartao que
// aparece quando alguem manda o link no whatsapp ou no linkedin. tudo na mesma
// paleta e na mesma letra do site, e refeito por comando em vez de na mao
const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')

const fonte = readFileSync(
  join(raiz, 'node_modules/@fontsource-variable/shantell-sans/files/shantell-sans-latin-wght-normal.woff2')
).toString('base64')

const base = `
  @font-face {
    font-family: 'Shantell';
    src: url(data:font/woff2;base64,${fonte}) format('woff2');
    font-weight: 300 800;
  }

  :root {
    --papel: #f7f5f0;
    --papel-fundo: #efece3;
    --tinta: #1a1209;
    --fraco: #6b6154;
    --fio: #cec6b5;
    --lacre: #9b2418;
  }

  * { box-sizing: border-box; margin: 0; }

  body {
    font-family: 'Shantell', ui-sans-serif, system-ui, sans-serif;
    background: transparent;
    color: var(--tinta);
    padding: 0;
  }

  .quadro {
    width: 1180px;
    padding: 38px 44px 30px;
    background: var(--papel);
    border: 1.5px solid var(--tinta);
    border-radius: 3px;
  }

  h1 {
    font-size: 1.65rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .olho {
    margin-top: 6px;
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--fraco);
  }

  .risco {
    margin: 16px 0 30px;
    border-bottom: 1.5px solid var(--tinta);
  }

  .rodape {
    margin-top: 28px;
    text-align: center;
    font-size: 0.66rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--fraco);
  }

  .caixa {
    background: var(--papel);
    border: 1.4px solid var(--tinta);
    border-radius: 2px;
    padding: 12px 14px;
    text-align: center;
  }

  .caixa b { display: block; font-size: 0.95rem; font-weight: 700; }
  .caixa span { display: block; margin-top: 4px; font-size: 0.76rem; color: var(--fraco); }
`

const paginas = [
  {
    arquivo: 'fluxo-do-arquivo.png',
    estilo: `
      .navegador {
        border: 1.6px dashed var(--tinta);
        border-radius: 4px;
        padding: 30px 26px 24px;
        position: relative;
        background: var(--papel-fundo);
      }

      .etiqueta {
        position: absolute;
        top: -11px;
        left: 26px;
        background: var(--papel);
        padding: 0 10px;
        font-size: 0.7rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--tinta);
        border: 1.4px solid var(--tinta);
        border-radius: 2px;
      }

      .trilha {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        align-items: stretch;
        gap: 0;
      }

      .trilha .caixa {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .passo { position: relative; padding: 0 9px; }

      .passo + .passo::before {
        content: '';
        position: absolute;
        left: -9px;
        top: 50%;
        width: 18px;
        border-top: 1.4px solid var(--tinta);
      }

      .passo + .passo::after {
        content: '';
        position: absolute;
        left: 3px;
        top: 50%;
        margin-top: -3.5px;
        border-left: 6px solid var(--tinta);
        border-top: 3.5px solid transparent;
        border-bottom: 3.5px solid transparent;
      }

      .numero {
        display: block;
        margin-bottom: 7px;
        text-align: center;
        font-size: 0.66rem;
        letter-spacing: 0.14em;
        color: var(--fraco);
        font-weight: 700;
      }

      .barreira {
        margin-top: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }

      .barreira .aviso {
        font-size: 0.78rem;
        color: var(--lacre);
        font-weight: 700;
      }

      .parede {
        width: 44px;
        border-top: 1.6px dashed var(--fraco);
        position: relative;
      }

      .parede::before,
      .parede::after {
        content: '';
        position: absolute;
        left: 12px;
        top: -10px;
        width: 20px;
        border-top: 2.4px solid var(--lacre);
      }

      .parede::before { transform: rotate(45deg); }
      .parede::after { transform: rotate(-45deg); }

      .fora {
        border: 1.4px dashed var(--fraco);
        border-radius: 2px;
        padding: 9px 16px;
        text-align: center;
        color: var(--fraco);
        font-size: 0.85rem;
      }

      .lei {
        margin-top: 10px;
        text-align: center;
        font-size: 0.82rem;
        color: var(--fraco);
      }

      .lei b { color: var(--lacre); }
    `,
    corpo: `
      <h1>O caminho do arquivo</h1>
      <p class="olho">do seu disco até o arquivo lacrado</p>
      <div class="risco"></div>

      <div class="navegador">
        <span class="etiqueta">tudo dentro do seu navegador</span>

        <div class="trilha">
          <div class="passo">
            <span class="numero">01</span>
            <div class="caixa"><b>você escolhe</b><span>o arquivo nunca sobe</span></div>
          </div>
          <div class="passo">
            <span class="numero">02</span>
            <div class="caixa"><b>Web Worker</b><span>fora da tela principal</span></div>
          </div>
          <div class="passo">
            <span class="numero">03</span>
            <div class="caixa"><b>a senha vira chave</b><span>PBKDF2, 310.000 voltas<br />ou Argon2id</span></div>
          </div>
          <div class="passo">
            <span class="numero">04</span>
            <div class="caixa"><b>AES-256-GCM</b><span>4 MB por vez</span></div>
          </div>
          <div class="passo">
            <span class="numero">05</span>
            <div class="caixa"><b>arquivo .cgph</b><span>salvo no seu disco</span></div>
          </div>
        </div>

      </div>

      <div class="barreira">
        <span class="fora">qualquer envio pra fora</span>
        <span class="parede"></span>
        <span class="fora">servidor</span>
      </div>

      <p class="lei">barrado pelo próprio navegador: <b>connect-src 'self'</b></p>

      <p class="rodape">não existe servidor pra receber, e nem se existisse a requisição sairia</p>
    `
  },
  {
    arquivo: 'anatomia-cgph.png',
    estilo: `
      .fita { display: flex; }

      .campo {
        flex: 1;
        border: 1.4px solid var(--tinta);
        border-left-width: 0;
        padding: 11px 6px 9px;
        text-align: center;
        background: var(--papel);
      }

      .campo:first-child { border-left-width: 1.4px; }
      .campo b { display: block; font-size: 0.82rem; font-weight: 700; }
      .campo span { display: block; margin-top: 3px; font-size: 0.72rem; color: var(--fraco); }

      .assinatura { background: var(--tinta); color: var(--papel); }
      .assinatura span { color: var(--fio); }
      .cifrado { background: var(--papel-fundo); }

      .titulo-faixa {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin: 26px 0 8px;
      }

      .titulo-faixa b { font-size: 0.9rem; }
      .titulo-faixa i {
        font-style: normal;
        font-size: 0.68rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--fraco);
      }

      .titulo-faixa:first-of-type { margin-top: 0; }

      .repete {
        margin-top: 6px;
        text-align: center;
        font-size: 0.8rem;
        color: var(--fraco);
        letter-spacing: 0.3em;
      }

      .notas {
        margin-top: 26px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
      }

      .nota {
        border-left: 2.4px solid var(--lacre);
        padding-left: 12px;
        font-size: 0.82rem;
        line-height: 1.5;
        color: var(--fraco);
      }

      .nota b { color: var(--tinta); }
    `,
    corpo: `
      <h1>Anatomia do .cgph</h1>
      <p class="olho">o que existe dentro de um arquivo lacrado</p>
      <div class="risco"></div>

      <div class="titulo-faixa"><b>cabeçalho</b><i>sempre 30 bytes, em texto claro</i></div>
      <div class="fita">
        <div class="campo assinatura"><b>CGPH</b><span>4</span></div>
        <div class="campo"><b>versão</b><span>1</span></div>
        <div class="campo"><b>algoritmo</b><span>1</span></div>
        <div class="campo"><b>iterações</b><span>4</span></div>
        <div class="campo"><b>sal</b><span>16</span></div>
        <div class="campo"><b>tamanho do bloco</b><span>4</span></div>
      </div>

      <div class="titulo-faixa"><b>registro 0</b><i>o que o arquivo era</i></div>
      <div class="fita">
        <div class="campo"><b>IV</b><span>12 bytes</span></div>
        <div class="campo"><b>tamanho</b><span>4 bytes</span></div>
        <div class="campo cifrado" style="flex: 4"><b>nome, tipo e peso do original</b><span>cifrado</span></div>
      </div>

      <div class="titulo-faixa"><b>registro 1 até n</b><i>o arquivo, em pedaços de 4 MB</i></div>
      <div class="fita">
        <div class="campo"><b>IV</b><span>12 bytes</span></div>
        <div class="campo"><b>tamanho</b><span>4 bytes</span></div>
        <div class="campo cifrado" style="flex: 4"><b>um pedaço do arquivo</b><span>cifrado</span></div>
      </div>
      <p class="repete">· · ·</p>

      <div class="notas">
        <p class="nota">
          O número do pedaço entra como <b>dado autenticado</b> em cada registro.
          Trocar dois de lugar não passa: a abertura falha.
        </p>
        <p class="nota">
          O nome do original vai cifrado, no registro 0. Um <b>.cgph</b> largado
          numa pasta não conta nem o que ele era.
        </p>
      </div>

      <p class="rodape">o cabeçalho é o único pedaço legível, e ele não diz nada sobre o conteúdo</p>
    `
  },
  {
    arquivo: 'og.png',
    pasta: 'public',
    seletor: '.cartao',
    escala: 1,
    estilo: `
      .cartao {
        width: 1200px;
        height: 630px;
        background: var(--papel);
        border: 0;
        padding: 68px 74px 60px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
      }

      /* uns zeros e uns bem apagados no fundo, a mesma ideia da lupa da home */
      .fundo {
        position: absolute;
        inset: 0;
        font-family: ui-monospace, monospace;
        font-size: 19px;
        line-height: 1.25;
        letter-spacing: 0.34em;
        color: var(--tinta);
        opacity: 0.04;
        word-break: break-all;
        padding: 14px;
        user-select: none;
      }

      /* o :not e obrigatorio: sem ele o fundo perde o absolute e empurra o resto pra fora */
      .cartao > *:not(.fundo) { position: relative; }

      .marca { display: flex; align-items: center; gap: 16px; }
      .marca b { font-size: 1.7rem; font-weight: 700; letter-spacing: -0.01em; }

      .frase {
        font-size: 4.15rem;
        font-weight: 700;
        line-height: 1.03;
        letter-spacing: -0.02em;
        max-width: 17ch;
      }

      .abaixo { font-size: 1.28rem; color: var(--fraco); margin-top: 18px; max-width: 34ch; }

      .pe {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        border-top: 1.5px solid var(--tinta);
        padding-top: 20px;
      }

      .pe span { font-size: 1.02rem; color: var(--fraco); }
      .pe .selo { font-size: 0.98rem; color: var(--lacre); font-weight: 700; }
    `,
    corpo: `
      <div class="fundo">${'01101000 01101001 00100000 01110011 01100101 01100111 01110010 01100101 01100100 01101111 '.repeat(26)}</div>

      <div class="marca"><svg viewBox="0 0 64 64" width="62" height="62"><defs><radialGradient id="cera" cx="34%" cy="28%" r="72%"><stop offset="0%" stop-color="#c4402f"/><stop offset="55%" stop-color="#9b2418"/><stop offset="100%" stop-color="#6f1810"/></radialGradient></defs><path d="M32 3c9 0 16 4 20 10s7 12 7 19-3 15-9 20-13 9-20 9-14-3-19-8S3 40 3 32s2-15 7-20S23 3 32 3Z" fill="url(#cera)" stroke="#5e1409" stroke-width="2.5"/><g fill="#f9e7df"><circle cx="32" cy="27" r="10"/><path d="M28 34 L23 53 h18 l-5 -19 Z"/></g></svg><b>cryptographer</b></div>

      <div>
        <p class="frase">Tranque um arquivo como se tranca uma gaveta.</p>
        <p class="abaixo">Criptografia que roda inteira dentro do seu navegador. Sem conta, sem upload, sem servidor.</p>
      </div>

      <div class="pe">
        <span>cryptographer-seven.vercel.app</span>
        <span class="selo">nada sai do seu navegador</span>
      </div>
    `
  }
]

const navegador = await chromium.launch()

for (const pagina of paginas) {
  const contexto = await navegador.newContext({ deviceScaleFactor: pagina.escala ?? 2 })
  const page = await contexto.newPage()

  const classe = pagina.seletor ?? '.quadro'
  const html = `<!doctype html><meta charset="utf-8" /><style>${base}${pagina.estilo}</style><div class="${classe.slice(1)}">${pagina.corpo}</div>`

  await page.setContent(html)
  await page.waitForTimeout(300)

  const pasta = pagina.pasta ?? 'docs'
  await page.locator(classe).screenshot({ path: join(raiz, pasta, pagina.arquivo) })

  console.log(`  ${pasta}/${pagina.arquivo}`)
  await contexto.close()
}

await navegador.close()

