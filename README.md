# 📚 Omnibus UI

Aplicação web de e-commerce de quadrinhos (HQs), construída com Angular e TypeScript. É o frontend
do ecossistema Omnibus, consumindo a API REST desenvolvida em [`omnibus.api`](#-projeto-relacionado).

---

## 🚧 Status atual do projeto

O projeto está em estágio inicial de fundação. O que existe hoje é a base gerada pelo Angular CLI
(standalone, com SSR habilitado) mais a configuração de ferramentas de qualidade de código
(TypeScript strict, ESLint, Prettier, Tailwind CSS e o runner de testes unitários).

Ainda não há:

- estrutura de diretórios por feature (`core/`, `shared/`, `features/`);
- rotas definidas (`app.routes.ts` está vazio);
- integração HTTP com a API;
- autenticação;
- qualquer funcionalidade de catálogo, carrinho, pedidos ou wishlist.

O componente raiz (`App`) ainda contém o conteúdo padrão gerado pelo scaffold, sem lógica de
negócio.

---

## 🚀 Stack Tecnológica

| Categoria            | Tecnologia                                                                         |
| -------------------- | ---------------------------------------------------------------------------------- |
| Framework            | Angular 21 (standalone, zoneless — sem `zone.js` instalado)                        |
| Renderização         | SSR via `@angular/ssr` + Express (servidor em `src/server.ts`)                     |
| Linguagem            | TypeScript 5.9 (modo `strict`)                                                     |
| Estilização          | Tailwind CSS 4 (via `@tailwindcss/postcss`)                                        |
| Reatividade          | Angular Signals (no componente raiz) + RxJS (dependência instalada, ainda sem uso) |
| Roteamento           | Angular Router (`provideRouter`, sem rotas definidas)                              |
| Qualidade de código  | ESLint (flat config) + `angular-eslint` + Prettier                                 |
| Ordenação de imports | `eslint-plugin-simple-import-sort`                                                 |
| Testes unitários     | Vitest, via builder unificado do Angular CLI (`@angular/build:unit-test`)          |
| CI                   | GitHub Actions (`.github/workflows/ci.yml`, portão de qualidade)                   |
| Deploy               | Vercel (integração nativa com o GitHub)                                            |
| Package manager      | npm                                                                                |

Tecnologia mencionada na proposta original do projeto mas **ainda não presente** no repositório:
Playwright (testes E2E) — descrito como planejado na seção correspondente.

---

## 🏛️ Arquitetura

### O que já está implementado

O projeto foi criado com `ng new` habilitando SSR (Server-Side Rendering). Isso já traz, prontos:

- **Standalone Components**: não há `NgModule` na base do projeto; o bootstrap é feito diretamente
  com `bootstrapApplication`.
- **Zoneless por padrão**: `zone.js` não está entre as dependências instaladas (aparece apenas como
  peer dependency opcional do Angular), e não há `polyfills` configurado em `angular.json`. A
  detecção de mudanças, portanto, segue o modelo zoneless padrão do Angular 21.
- **SSR configurado**: existe `main.server.ts`, `app.config.server.ts`, `app.routes.server.ts` (com
  a rota coringa `**` em modo `Prerender`) e um servidor Express em `server.ts`, responsável por
  servir os arquivos estáticos e delegar a renderização ao `AngularNodeAppEngine`.
- **Hidratação no cliente**: `app.config.ts` habilita `provideClientHydration(withEventReplay())`.
- **Alias de caminho**: `tsconfig.json` define `@/*` apontando para `./src/*`, ainda sem uso no
  código.

### O que é direção arquitetural planejada

O restante da estrutura descrita abaixo (organização por feature, `core`, `shared`) representa a
direção pretendida para o projeto, não o estado atual do código. Hoje existe apenas o componente
raiz `App`, sem nenhuma dessas camadas.

A intenção é organizar o código principalmente por domínio/feature, evitando diretórios globais
(`components/`, `services/`, `models/`) com todos os arquivos da aplicação misturados. Os princípios
que devem guiar essa organização, quando implementada, são:

- `core` concentra infraestrutura transversal da aplicação (autenticação, sessão, guards,
  interceptors, configuração) e não deve depender de nenhuma feature específica.
- `shared` contém elementos reutilizáveis sem relação com uma feature específica (componentes
  visuais, directives, pipes).
- `features` representa as áreas funcionais do produto (auth, catálogo, carrinho, pedidos,
  wishlist). Uma feature pode depender de `core` e `shared`, mas o inverso não deve ocorrer, e uma
  feature não deve depender diretamente de outra sem justificativa arquitetural explícita.

Sobre a combinação Signals/RxJS, o plano é usar Signals para estado local, estado derivado e valores
de UI, e RxJS para HTTP, eventos assíncronos e composição de streams — sem tratá-los como
tecnologias concorrentes.

---

## 📁 Estrutura do projeto

Estrutura real atual:

```text
src/
├── app/
│   ├── app.config.ts           # Providers da aplicação (router, hidratação, error listeners)
│   ├── app.config.server.ts    # Configuração de providers específica do SSR
│   ├── app.routes.ts           # Rotas da aplicação (vazio no momento)
│   ├── app.routes.server.ts    # Estratégia de renderização por rota no servidor
│   ├── app.ts                  # Componente raiz
│   ├── app.html                # Template do componente raiz
│   └── app.spec.ts             # Teste unitário base do componente raiz
├── index.html
├── main.ts                     # Bootstrap client-side
├── main.server.ts              # Bootstrap server-side
├── server.ts                   # Servidor Express para SSR
└── styles.css                  # Estilos globais (import do Tailwind)
```

Estrutura conceitual pretendida (ainda não implementada), para referência da direção arquitetural:

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── guards/
│   │   └── http/
│   │       └── interceptors/
│   ├── shared/
│   │   ├── ui/
│   │   ├── directives/
│   │   └── pipes/
│   ├── features/
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── wishlist/
│   ├── app.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
└── styles.css
```

Não existe, no momento, diretório `environments/` no projeto.

---

## 🧱 Princípios arquiteturais

- **Feature primeiro, tipo depois**: a organização pretendida agrupa arquivos por domínio funcional,
  não por tipo técnico.
- **`shared` e `core` não conhecem features**: a direção de dependência pretendida é
  `feature → core` e `feature → shared`, nunca o inverso.
- **Signals para estado síncrono, RxJS para fluxos assíncronos**: cada abstração é usada onde é
  naturalmente adequada, sem sobreposição de responsabilidade.
- **O frontend não é fonte de verdade para autorização**: qualquer controle de acesso feito na
  interface (esconder elementos, proteger rotas) existe para UX; a autoridade final permanece na
  API.

Esses princípios ainda não têm código correspondente no repositório além do que já foi descrito nas
seções de arquitetura acima; estão documentados aqui como guia para as próximas implementações.

---

## 🎨 UI e Design System

Tailwind CSS 4 está configurado e funcional: o plugin `@tailwindcss/postcss` está registrado em
`.postcssrc.json` e o arquivo `src/styles.css` importa o Tailwind diretamente (`@import
'tailwindcss'`), sem arquivo de configuração adicional — comportamento padrão do Tailwind v4.

Não existe, no momento, nenhum componente de UI reutilizável (`shared/ui`) nem um design system
formalizado. Elementos como botão, input, modal, badge, tabela ou paginação ainda não foram
extraídos; a intenção é abstrair esses padrões em `shared/ui` apenas quando surgir reutilização real
entre features, evitando abstrações prematuras.

---

## 🔐 Autenticação

A API (`omnibus.api`) implementa autenticação baseada em JWT, incluindo ativação de conta e
recuperação de senha por OTP. Isso é uma característica do backend — o frontend ainda não integra
nenhum fluxo de autenticação.

Funcionalidades planejadas para o frontend, todas ainda **não implementadas**:

- login e registro de customer;
- ativação de conta por OTP e reenvio de código;
- recuperação e alteração de senha;
- verificação de OTP;
- manutenção de sessão autenticada;
- proteção de rotas via guards;
- tratamento padronizado de respostas `401` e `403`.

Quando implementadas, essas medidas terão caráter de UX (esconder/mostrar elementos, redirecionar
usuário não autenticado) — a autorização definitiva continua sendo responsabilidade da API.

---

## 🔌 Integração com a API

O `AuthApiService` (`core/auth/auth-api.service.ts`) concentra a comunicação com `omnibus.api`,
cobrindo `/auth/login`, `/auth/register`, `/auth/activate`, `/auth/resend-activation`,
`/password-reset`, `/password-reset/verify` e `/password-reset/confirm`. Um interceptor
(`errorLoggingInterceptor`) loga no console o status e o corpo de erro retornado pela API em toda
requisição que falhar.

A URL base da API é centralizada em `environments/environment.ts` — o serviço importa `environment`
diretamente, sem camada de indireção.

---

## ⚙️ Configuração de Ambiente

O projeto usa o mecanismo nativo do Angular para valores por ambiente: **file replacements**, não
variáveis de ambiente lidas em runtime nem scripts de geração. `environment.ts` é a configuração
padrão (usada quando nenhuma configuration é especificada); `environment.development.ts` é trocado
no lugar dele quando o build roda com a configuration `development` — troca declarada em
`fileReplacements`, dentro de `angular.json`:

```json
"development": {
  "fileReplacements": [
    { "replace": "src/environments/environment.ts", "with": "src/environments/environment.development.ts" }
  ]
}
```

`npm run dev` e `npm run watch` já usam a configuration `development` (`http://localhost:8080`);
`npm run build` usa a configuration padrão, `production` (`environment.ts`, hoje com
`https://api.omnibus.com`).

Para adicionar um novo ambiente (ex.: staging), o caminho é: criar
`src/environments/environment.staging.ts` com os valores daquele ambiente, registrar um bloco
`staging` com seu próprio `fileReplacements` em `angular.json`, e buildar com
`ng build --configuration staging`. Trocar de ambiente significa trocar qual arquivo entra no
build — o valor fica versionado no repositório, não vem de fora em tempo de execução.

Qualquer valor colocado em `environments/` deve ser tratado como público: esses arquivos são
compilados para o bundle enviado ao navegador. Nenhum segredo real deve ser colocado aqui.

---

## ▶️ Como Rodar o Projeto

Pré-requisitos: Node.js compatível com Angular 21 e npm.

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento (ng serve)
npm run dev

# build de produção
npm run build

# build em modo watch (desenvolvimento)
npm run watch

# rodar o servidor Node com o build de SSR já gerado
npm run serve:ssr:omnibus.ui
```

Não existe script `start` no `package.json` — o comando de desenvolvimento é `npm run dev`.

---

## 🧪 Testes

Testes unitários são executados com **Vitest**, através do builder unificado de testes do Angular
CLI (`@angular/build:unit-test`, configurado em `angular.json`):

```bash
npm test
```

Existe uma suíte de teste base (`app.spec.ts`), gerada pelo scaffold do Angular CLI, cobrindo a
criação e renderização do componente raiz.

Testes end-to-end com Playwright estão previstos, mas **não implementados**: não há dependência do
Playwright instalada nem configuração correspondente no repositório.

---

## 🧹 Qualidade de Código

A separação de responsabilidades entre as ferramentas é explícita:

- **TypeScript** cuida da segurança estática. O `tsconfig.json` habilita `strict`,
  `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`,
  `noFallthroughCasesInSwitch`, `isolatedModules` e `importHelpers`, com `target: ES2022` e
  `module: preserve`. O compilador Angular, por sua vez, habilita `strictInjectionParameters`,
  `strictInputAccessModifiers` e `strictTemplates`.
- **ESLint** cuida de possíveis bugs, convenções e regras específicas de Angular e TypeScript. A
  configuração usa Flat Config (`eslint.config.js`) e inclui:
  - `typescript-eslint` (regras recomendadas) e `angular-eslint` (regras de template e
    acessibilidade, via `templateRecommended` e `templateAccessibility`);
  - `eslint-plugin-simple-import-sort`, com grupos de import definidos (`@angular`, `rxjs`, pacotes
    externos, alias `@/`, imports relativos) e ordenação de exports;
  - `no-duplicate-imports` e `@typescript-eslint/consistent-type-imports` (forçando
    `import type`);
  - `@typescript-eslint/no-unused-vars` (aviso, ignorando identificadores prefixados com `_`) e
    `@typescript-eslint/no-explicit-any` (aviso);
  - `@angular-eslint/prefer-inject` e `@angular-eslint/no-empty-lifecycle-method`;
  - convenções de seletor: diretivas em `camelCase` com prefixo `app`, componentes em
    `kebab-case` com prefixo `app`.
- **Prettier** cuida exclusivamente de formatação, integrado ao ESLint via
  `eslint-plugin-prettier/recommended`. Configuração: `printWidth: 100`, `singleQuote: true`,
  `semi: true`, `trailingComma: "all"`, com parser `angular` para arquivos `.html`.

Comandos disponíveis:

```bash
npm run lint            # ESLint (ng lint)
npm run format           # Prettier --write
npm run format:check    # Prettier --check
```

---

## 🔄 Integração Contínua

`.github/workflows/ci.yml` roda em pull requests e pushes para `main`: `npm run lint`,
`npm run format:check`, `npm test -- --watch=false` e `npm run build`, nessa ordem — qualquer
falha interrompe o workflow. Esse workflow é só um portão de qualidade; **ele não publica nada**.

---

## ☁️ Deploy

O deploy é feito pela própria Vercel, através da integração nativa dela com o GitHub — sem
GitHub Actions envolvido nessa parte. Configuração (feita uma vez, pelo painel da Vercel):

1. Em [vercel.com](https://vercel.com), importe o repositório do GitHub.
2. Em **Project Settings → Build & Development Settings**, sobrescreva o Build Command para:
   ```
   echo "export const environment = { production: true, apiUrl: '$OMNIBUS_API_URL' };" > src/environments/environment.ts && npm run build
   ```
   Confira também o Output Directory — o esperado é `dist/omnibus.ui/browser`.
3. Em **Project Settings → Environment Variables**, adicione `OMNIBUS_API_URL` com a URL real da
   API (pode ter um valor para Production e outro para Preview, se quiser que PRs apontem para um
   ambiente de staging).

A partir daí, todo push em `main` publica em produção e todo Pull Request ganha uma URL de preview
automática — sem token nem secret do GitHub, e sem a URL real da API aparecer em nenhum momento no
repositório: ela mora só na Vercel.

Como a aplicação é inteiramente pré-renderizada (`RenderMode.Prerender` em todas as rotas), o
resultado do build já é HTML estático por rota; não é necessário rodar o servidor Express
(`server.ts`) em produção para essa hospedagem. `vercel.json`, na raiz do projeto, configura o
fallback para `index.csr.html` em qualquer caminho que não corresponda a um arquivo pré-renderizado
— é o que permite a página 404 temática aparecer para rotas inexistentes, em vez do 404 genérico do
host (arquivos estáticos existentes, como `/login`, continuam servidos diretamente; a Vercel só cai
no rewrite quando nada bate).

---

## 🗺️ Roadmap

- [x] Bootstrap do projeto com Angular CLI (standalone, zoneless, SSR)
- [x] TypeScript em modo strict
- [x] Tailwind CSS configurado
- [x] ESLint (flat config) com regras de Angular, TypeScript e ordenação de imports
- [x] Prettier integrado ao ESLint
- [x] Runner de testes unitários (Vitest) configurado
- [ ] Estrutura de diretórios por feature (`core`, `shared`, `features`)
- [ ] Definição de rotas da aplicação
- [x] Camada de comunicação HTTP com a API (`provideHttpClient`, interceptors)
- [x] Configuração de ambientes (`environments/`, via `fileReplacements` nativo do Angular)
- [ ] Autenticação (login, registro, ativação por OTP, recuperação de senha)
- [ ] Catálogo de produtos
- [ ] Carrinho
- [ ] Pedidos
- [ ] Wishlist
- [ ] Componentes de UI reutilizáveis / design system (`shared/ui`)
- [ ] Testes end-to-end com Playwright
- [x] Pipeline de CI (GitHub Actions — lint, testes, formatação e build)
- [x] Deploy (Vercel, integração nativa com o GitHub)

---

## 🔗 Projeto relacionado

```text
Omnibus
│
├── omnibus.api
│   └── Java / Spring Boot
│       Backend REST
│
└── omnibus.ui
    └── Angular / TypeScript
        Aplicação Web
```

O [`omnibus.api`](https://github.com/Gabriel-Leao/omnibus.api) é o backend REST do Omnibus,
desenvolvido em Java/Spring Boot com arquitetura hexagonal (Ports & Adapters), responsável pelas
regras de negócio, persistência, autenticação e autorização. Este repositório (`omnibus.ui`)
consome essa API e não deve ser tratado como fonte de verdade para regras de negócio ou autorização.

---

## 📄 Licença

Licença ainda não definida para este repositório.
