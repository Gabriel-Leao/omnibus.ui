# Omnibus UI

Aplicação web de e-commerce de quadrinhos (HQs), construída com Angular e TypeScript. É o frontend
do ecossistema Omnibus, consumindo a API REST desenvolvida em [`omnibus.api`](#projeto-relacionado).

---

## Status atual

O projeto tem uma base de autenticação completa (login, registro, ativação de conta por OTP,
recuperação de senha) e um design system próprio com identidade visual retrô de quadrinho, ambos
integrados à API real. Internacionalização (pt-BR e en-GB) foi adicionada recentemente.

Ainda não implementado: catálogo de produtos, carrinho e pedidos. A página `/home` existe como
placeholder para esse território.

## Stack

| Categoria           | Tecnologia                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Framework           | Angular 21 (standalone, zoneless — sem `zone.js`)                                            |
| Renderização        | SSR via `@angular/ssr` + Express (`src/server.ts`); todas as rotas em `RenderMode.Prerender` |
| Linguagem           | TypeScript 5.9 (`strict`)                                                                    |
| Estilização         | Tailwind CSS 4 (`@tailwindcss/postcss`)                                                      |
| Reatividade         | Angular Signals para estado local/UI; RxJS para HTTP e composição assíncrona                 |
| Roteamento          | Angular Router, lazy-loaded por página (`loadComponent`)                                     |
| Internacionalização | Serviço próprio baseado em signals (`core/i18n`) — pt-BR e en-GB                             |
| Testes unitários    | Vitest, via `@angular/build:unit-test`                                                       |
| Testes E2E          | Planejados; Playwright ainda não está no repositório                                         |
| Deploy              | Vercel                                                                                       |

## Arquitetura

O código é organizado por feature, não por tipo técnico:

```text
src/app/
├── core/        # infraestrutura transversal: auth, http, i18n, theme, otp
├── shared/      # componentes de UI e utilitários sem dependência de feature
├── features/    # áreas funcionais: auth, home, errors
├── layout/      # casca da aplicação (header, app-shell)
├── app.ts
├── app.config.ts
└── app.routes.ts
```

Regras de dependência: `core` e `shared` não conhecem `features`; uma feature pode depender de
`core` e `shared`, nunca o inverso. Signals cobrem estado local, estado derivado e valores de UI;
RxJS cobre HTTP, eventos assíncronos e composição de streams — cada abstração é usada onde é
naturalmente adequada, sem sobreposição.

O frontend não é fonte de verdade para autorização: qualquer controle de acesso na interface
(esconder elementos, proteger rotas) existe para UX. A autoridade final permanece na API.

## Autenticação

`AuthApiService` (`core/auth/auth-api.service.ts`) cobre login, registro, ativação de conta por
OTP (com reenvio), e o fluxo completo de recuperação de senha (solicitar código, verificar código,
confirmar nova senha). A sessão é mantida em `AuthSessionService`; `PasswordResetSessionService`
guarda o token de curta duração emitido entre a verificação do código e a confirmação da nova
senha. `passwordResetGuard` impede acesso direto à tela de nova senha sem esse token.

Cada página valida seus próprios campos em `shared/utils/validators.ts` através de um `computed`
(`formValid`); o botão de envio fica desabilitado enquanto o formulário não estiver válido, então
não existe caminho para submeter um formulário com dado inválido — os campos usam as mesmas
restrições que a API já aplica (ver os comentários em `validators.ts`, que apontam para os DTOs
correspondentes em `omnibus.api`).

O campo de data de nascimento não usa `<input type="date">` nativo: o placeholder desse controle
("dd/mm/yyyy", segmentos em branco, ...) é renderizado pelo próprio navegador seguindo a
localidade do sistema operacional/navegador, não o idioma escolhido no app — não há como fazê-lo
dizer "aaaa" quando o app está em português. Em vez disso, é um campo de texto com máscara
(`shared/utils/date-mask.ts`): `formatDateInput` insere as barras enquanto o usuário digita e
`parseDateInputToIso` converte o valor digitado para `yyyy-MM-dd` (o formato que a API espera para
`LocalDate`), validando que é uma data de calendário real. A ordem dos campos (dia/mês/ano ou
mês/dia/ano) e o placeholder acompanham o idioma ativo.

## Internacionalização

O app suporta três idiomas: português (Brasil), inglês (EUA) e espanhol — en-US é a variante única
de inglês (a mais falada globalmente; o app não distingue variantes regionais de inglês). Na
primeira visita, o idioma é detectado a partir da preferência do navegador (`navigator.languages`
— a lista completa de idiomas preferidos, alguns navegadores permitem configurar mais de um, em
ordem de prioridade): a lista é percorrida em ordem até achar a primeira entrada reconhecida —
português (`pt`, `pt-BR`, `pt-PT`, ...) vira pt-BR; espanhol (`es`, `es-ES`, `es-MX`, ...) vira es;
qualquer variante de inglês vira en-US. Um idioma preferido antes desses mas sem dicionário no app
(alemão, por exemplo) é apenas pulado, não conta como voto para inglês. Sem nada reconhecível em
nenhuma posição da lista, o padrão é en-US. A implementação é
um serviço de signals (`I18nService`, em `core/i18n/`) — não uma biblioteca externa nem o
mecanismo de i18n nativo do Angular — pelo mesmo motivo que `ThemeService` também não usa nada
externo: é estado de UI local, síncrono, e a alternância de idioma no seletor deve refletir na tela
imediatamente, sem rebuild.

- `core/i18n/translations/translations.ts` define a interface `Translations`, que todo dicionário
  precisa implementar por completo — uma string faltando em um idioma é erro de compilação, não um
  buraco silencioso na tela.
- `pt-br.ts`, `en-us.ts` e `es.ts` implementam essa interface. Textos parametrizados (um dígito,
  uma contagem regressiva, um número de reenvios restantes) são funções, não strings com
  placeholder, para manter a interpolação com tipagem.
- O idioma escolhido no seletor persiste em `localStorage` (sobrepondo a detecção do navegador
  nas próximas visitas) e é refletido em `<html lang>`.
- O componente `shared/ui/language-switcher` (botão de globo no cabeçalho) alterna entre os três
  idiomas.

Erros vindos da API também passam por essa camada. `GlobalExceptionHandler`, em `omnibus.api`,
sempre retorna uma mensagem de erro no corpo da resposta, mas essa mensagem é uma string fixa
definida no backend — sem noção de idioma. `core/i18n/api-error-translations.ts` mapeia o conjunto
de mensagens que o backend efetivamente produz (catalogadas a partir do próprio código-fonte de
`omnibus.api`) para o idioma corrente; uma mensagem do backend que não está nesse mapa nunca é
exibida sem tradução — o app usa o texto de erro genérico da página em vez disso. Isso também evita
vazar informação interna ao usuário (como o identificador de um registro em uma mensagem de erro
que não deveria alcançá-lo).

Um erro de formulário (de validação ou vindo da API) nunca é guardado como a string já resolvida —
isso a congelaria no idioma ativo no momento em que o erro apareceu, ficando desatualizada se o
usuário trocar de idioma pelo seletor enquanto o erro ainda está na tela. Em vez disso,
`core/i18n/error-resolver.ts` define `ErrorResolver`, uma função de `Translations` para `string`;
cada página guarda essa função (por exemplo, `(t) => t.auth.login.fallbackError`) e deriva o texto
exibido com um `computed` que a invoca contra `i18n.dict()` — a mesma troca de idioma que já
atualiza o resto da página também retraduz o erro.

## Configuração de ambiente

Valores por ambiente usam o mecanismo nativo do Angular (`fileReplacements`), não variáveis lidas
em runtime: `environment.ts` é a configuração padrão (usada no build de produção,
`https://api.omnibus.com`); `environment.development.ts` substitui essa configuração quando o build
roda com `--configuration development` (`npm run dev` / `npm run watch`, apontando para
`http://localhost:8080`). Qualquer valor em `environments/` é público — vai para o bundle enviado
ao navegador.

## Como rodar

Pré-requisitos: Node.js compatível com Angular 21 e npm.

```bash
npm install

npm run dev              # ambiente de desenvolvimento (ng serve)
npm run build            # build de produção
npm run watch            # build em modo watch (desenvolvimento)
npm run serve:ssr:omnibus.ui   # roda o servidor Node com o build de SSR já gerado
```

Não existe script `start` — o comando de desenvolvimento é `npm run dev`.

## Testes

```bash
npm test
```

Executado com Vitest através do builder unificado de testes do Angular CLI. Cobertura atual:
suíte base do componente raiz, gerada pelo scaffold do Angular CLI. Testes end-to-end com
Playwright estão planejados, mas ainda não implementados.

## Qualidade de código

- **TypeScript** em modo `strict`, com `noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
  `noImplicitReturns` e `noFallthroughCasesInSwitch` habilitados; o compilador Angular roda com
  `strictInjectionParameters`, `strictInputAccessModifiers` e `strictTemplates`.
- **ESLint** (flat config): `typescript-eslint` e `angular-eslint` (incluindo regras de
  acessibilidade de template), `eslint-plugin-simple-import-sort`, `no-duplicate-imports`,
  `@typescript-eslint/consistent-type-imports`.
- **Prettier**, integrado ao ESLint: `printWidth: 100`, `singleQuote: true`, `trailingComma: "all"`.

```bash
npm run lint
npm run format
npm run format:check
```

## Integração contínua

Não há workflow de CI configurado neste repositório no momento. `npm run lint`, `npm run
format:check`, `npm test` e `npm run build` cobrem as verificações que um pipeline rodaria; até
haver automação, é responsabilidade de quem abre o PR rodá-los localmente.

## Deploy

Hospedado na Vercel. O `apiUrl` consumido pelo app vem de `src/environments/environment.ts`
(substituído por `environment.development.ts` apenas em builds com `--configuration
development`) — é um valor fixo no código-fonte, não uma variável de ambiente lida em tempo de
deploy; apontar para uma API diferente em produção exige alterar e commitar esse arquivo.

Como todas as rotas estão em `RenderMode.Prerender`, o build gera HTML estático por rota; o
servidor Express (`server.ts`) existe para SSR sob demanda mas não é necessário nesse modelo de
hospedagem. `vercel.json` define o fallback para `index.csr.html` em qualquer caminho sem
correspondência entre os arquivos pré-renderizados, o que inclui a página 404 temática do app.

## Roadmap

- [x] Bootstrap (Angular CLI, standalone, zoneless, SSR)
- [x] Design system próprio (`shared/ui`) com identidade visual retrô de quadrinho
- [x] Autenticação completa (login, registro, ativação por OTP, recuperação de senha)
- [x] Internacionalização (pt-BR, en-GB) e tradução de mensagens de erro da API
- [ ] Catálogo de produtos
- [ ] Carrinho e pedidos
- [ ] Testes end-to-end (Playwright)
- [ ] Pipeline de CI

## Projeto relacionado

```text
Omnibus
├── omnibus.api   Java / Spring Boot — backend REST
└── omnibus.ui    Angular / TypeScript — este repositório
```

[`omnibus.api`](https://github.com/Gabriel-Leao/omnibus.api) é o backend REST do Omnibus,
desenvolvido em Java/Spring Boot com arquitetura hexagonal (Ports & Adapters), responsável pelas
regras de negócio, persistência, autenticação e autorização. Este repositório consome essa API e
não deve ser tratado como fonte de verdade para regras de negócio ou autorização.

## Licença

MIT — ver [`LICENSE`](./LICENSE).
