# Como este projeto é tocado

Regras que eu sigo aqui. Estão escritas porque, seis meses depois, eu não vou
lembrar por que decidi cada coisa.

## Antes de tudo

Nunca commite `.env`, `node_modules` ou qualquer arquivo pessoal. Nunca cole
uma senha de verdade em issue, PR ou comentário de código. Este é um site de
criptografia e um segredo vazado aqui é pior do que em qualquer outro lugar.

## O ciclo

A `main` nunca recebe commit direto. Todo código entra por PR, mesmo quando
sou eu sozinho revisando.

```bash
git checkout -b feat/nome-curto
# escreve o código
npm run lint && npm test && npm run build
npm run test:e2e   # sobe o site e clica nele, precisa do navegador instalado
git commit -m "feat: what changed in english"
git push -u origin feat/nome-curto
```

Depois abre o PR no GitHub, espera a CI ficar verde e faz merge com **rebase**.
Nunca com squash: squash reescreve a data de autoria do commit, e aqui a data
de cada commit é escolhida de propósito.

## Nome de branch

```
feat/    funcionalidade nova
fix/     correção
chore/   configuração, dependência, build
docs/    texto, README, páginas legais
test/    testes
```

## Mensagem de commit

Título em inglês, no padrão Conventional Commits, curto e no imperativo:

```
feat: add file fingerprint page
fix: accept mime list in the file drop
```

O corpo vai em português, explicando **por que**, não o quê. O diff já mostra
o quê.

```
feat: add AES-256-GCM core with versioned file format

coloquei o byte de versao no cabecalho desde o comeco. se eu mudar as
iteracoes depois sem isso, todo arquivo que ja saiu do site vira lixo e
ninguem mais abre.
cada bloco leva o indice assinado junto, senao dava pra embaralhar a
ordem dos pedacos sem o AES reclamar.
```

Sem assinatura de ferramenta, sem `Co-Authored-By`, sem emoji.

## Issue

Issue para bug de verdade e funcionalidade de verdade. Não para ajustar
padding. O PR referencia com `Closes #12`, e o merge fecha a issue sozinho.

## Os dois tipos de teste

`npm test` roda o Vitest em cima do núcleo: formato do arquivo, cifras, hash,
esteganografia, metadados. É rápido e não abre navegador nenhum.

`npm run test:e2e` roda o Playwright, que faz o build, sobe o site e clica nele
de verdade: lacra um arquivo e abre de volta conferindo byte por byte, recusa
senha errada, esconde e tira segredo da foto, e confere o menu no celular. Da
primeira vez precisa de `npx playwright install chromium`.

Teste de tela que passa tanto com o código certo quanto com o errado não serve
de nada. Antes de dar um por pronto, quebra a correção de propósito e confere
que ele acusa.

## O que a CI cobra

`npm run lint`, `npx tsc --noEmit`, o mesmo para o `tsconfig.e2e.json`,
`npm test`, `npm run build` e `npm run test:e2e`. Se qualquer um falhar, o PR
não entra. Os testes de tela rodam num job separado porque baixam um navegador
inteiro e demoram bem mais.

## Antes de dizer que terminou

- Testado no celular, sem rolagem lateral
- Textos atualizados em português **e** em inglês, os dois dicionários têm o
  mesmo formato e o TypeScript acusa se faltar chave
- Se mudou a quantidade de alguma coisa (cifras, livros, telas), conferir se
  algum texto cita esse número e continua verdadeiro. Isso já quebrou duas
  vezes: lint e teste não pegam texto desatualizado

## Decisões que não se mexe sem pensar muito

**O formato do arquivo tem um byte de versão.** Mudar iteração, algoritmo ou
tamanho de bloco sem subir a versão transforma em lixo todo `.cgph` que já
saiu do site. O leitor precisa continuar abrindo a versão antiga.

**Nada de servidor.** Não existe endpoint de upload e não deve existir. O
`connect-src 'self'` no `vercel.json` faz o próprio navegador impedir envio
de dados para fora. Se um dia entrar analytics, o texto da política de
cookies precisa mudar junto, porque hoje ele afirma que não existe nenhum.

**Cifra clássica é brinquedo e o site diz isso.** Toda cifra clássica aparece
com o aviso de que não protege nada. Não remova esse aviso.
