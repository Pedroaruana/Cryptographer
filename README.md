# Cryptographer

Criptografia que roda inteira dentro do navegador. Sem conta, sem banco de dados, sem servidor.

[![CI](https://github.com/Pedroaruana/Cryptographer/actions/workflows/ci.yml/badge.svg)](https://github.com/Pedroaruana/Cryptographer/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-100%20testes-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-20%20testes-2EAD33?style=flat-square&logo=playwright&logoColor=white)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://cryptographer-seven.vercel.app/)

**[cryptographer-seven.vercel.app](https://cryptographer-seven.vercel.app/)**

![A tela inicial do Cryptographer](docs/home.jpg)

## Funcionalidades

- **Lacrar** um arquivo ou uma mensagem com AES-256-GCM. Sai um `.cgph` ou um `.zip` com senha, que abre no 7-Zip de qualquer computador
- **Abrir** de volta com a mesma senha
- **Esconder** um segredo dentro dos pixels de um PNG ou das amostras de um WAV. O arquivo continua abrindo normal em qualquer programa, carregando o segredo dentro
- **Metadados**: ver o que a sua foto entrega sem você saber, câmera, data e a coordenada de GPS de onde foi tirada, e apagar isso
- **Impressão digital**: SHA-1, SHA-256, SHA-384 e SHA-512 de um arquivo ou texto, com comparação contra um valor esperado
- **Simuladores**: 22 cifras clássicas funcionando passo a passo, todas com o aviso de que nenhuma delas protege nada hoje

Tudo em português e inglês, com tema claro e escuro. Depois da primeira visita o site fica guardado no navegador e **abre sem internet**, com tudo funcionando.

## Como funciona

O arquivo nunca sai da máquina. Não é promessa, é o navegador que impede: a política de segurança do site declara `connect-src 'self'`, então qualquer tentativa de enviar alguma coisa pra fora é bloqueada antes de sair.

![O caminho do arquivo, do disco até o .cgph, sem sair do navegador](docs/fluxo-do-arquivo.png)

A criptografia roda num Web Worker pra tela não travar em arquivo grande, e o arquivo é lido em pedaços de 4 MB em vez de tudo de uma vez.

Como nada depende de servidor, um service worker guarda o site inteiro no navegador na primeira visita. Da segunda em diante ele abre com a internet desligada, e um teste desliga a rede de verdade pra conferir que essa frase continua sendo verdade.

### O formato .cgph

![A anatomia dos bytes de um arquivo .cgph](docs/anatomia-cgph.png)

Os dois desenhos acima saem de [`scripts/diagramas.mjs`](scripts/diagramas.mjs), então dá pra refazer eles quando o formato mudar.

## Stack

| | |
|---|---|
| Interface | React 19, React Router 7, Tailwind CSS 4 |
| Build | Vite 7, TypeScript 5.9 |
| Criptografia | Web Crypto API do próprio navegador, `hash-wasm` para Argon2id, `@zip.js/zip.js` para o ZIP com senha |
| Testes | Vitest no núcleo, Playwright nas telas |
| Qualidade | Biome, GitHub Actions |
| Hospedagem | Vercel, só arquivo estático |

Nenhuma biblioteca de criptografia caseira. Tudo que embaralha byte é Web Crypto ou implementação auditada.

## Arquitetura

```
src/
  crypto/      o núcleo, sem nenhuma referência a tela
    format.ts    o contrato: bytes, tamanhos, versão do formato
    core.ts      lacrar e abrir arquivo
    text.ts      lacrar e abrir mensagem
    archive.ts   o ZIP com senha
    stego.ts     esconder em imagem
    stegoWav.ts  esconder em áudio
    classic.ts   as 22 cifras clássicas
    hash.ts      as impressões digitais
    worker.ts    o que roda fora da tela principal
  hooks/       a ponte entre a tela e o worker
  components/  as peças de tela
  pages/       as telas
  i18n/        os dois dicionários, com o mesmo formato
  lib/         metadados EXIF, tipos de arquivo, cabeçalho das páginas
```

A regra que segurou tudo: `src/crypto` não sabe que existe tela. Não importa React, não toca no DOM. É por isso que dá pra testar o núcleo inteiro sem abrir navegador nenhum, e é por isso que o mesmo código roda no Web Worker sem adaptação.

O build também gera o HTML das dez telas em arquivo pronto, porque robô de busca em geral não roda JavaScript e ia encontrar uma página em branco.

## Rodando

```bash
npm install
npm run dev
```

## Testes

```bash
npm test          # 100 testes no núcleo, sem navegador
npm run test:e2e  # 20 testes abrindo o site e clicando
```

Os testes do núcleo conferem contra vetor oficial: o SHA-256 de `abc` tem que dar exatamente o valor do padrão. Os testes de tela lacram um arquivo, baixam, abrem de volta e comparam byte por byte.

Da primeira vez o Playwright precisa do navegador: `npx playwright install chromium`.

## Dificuldades

**A tela ficou branca e eu não achava.** Era um `useEffect` de uma linha que voltava o valor do `scrollTo`, e o React tentava usar aquilo como função de limpeza. Uma linha. Passei um tempo bom procurando em tudo quanto é lugar antes de olhar pra ela.

**A lupa da Mona Lisa foi a parte mais teimosa.** Tentei fazer o recorte redondo com máscara de CSS e o navegador ficava repetindo a máscara pela imagem inteira, ficava horrível. Só funcionou quando parei de insistir no CSS e fui recortar dentro do próprio canvas. Aí de quebra deu pra aumentar de verdade, e ficou parecendo lente em vez de buraco.

**O resultado travava em 0%.** Se a pessoa trocasse de aba durante a criptografia, o arquivo ficava preso pra sempre. Descobri que o `requestAnimationFrame` para de rodar em aba escondida, e eu tinha colocado a entrega do resultado dentro dele. O número na tela pode depender dele, o resultado não.

**O PNG que não entrava.** Eu comparava o nome do arquivo com uma lista de tipos MIME, então `foto.png` nunca ia bater com `image/png`. Levei um susto porque parecia um problema grande e era comparação errada.

**O idioma que mudou sozinho no servidor.** No último commit, o gerador de HTML rodava aqui e saía em português, rodava no GitHub e saía em inglês. É que o Node também tem `navigator`, e eu estava deixando o ambiente decidir em vez de mandar. Isso eu nem ia perceber, quem pegou foi um teste.

## Licença

MIT. Ver [LICENSE](LICENSE).
