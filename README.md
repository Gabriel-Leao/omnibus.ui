# Omnibus UI

A web e-commerce application for comic books, built with Angular and TypeScript. It's the frontend
of the Omnibus ecosystem, consuming the REST API developed in
[`omnibus.api`](#related-project).

---

## Current status

The project has a complete authentication foundation (login, registration, OTP account
activation, password recovery) and its own design system with a retro comic-book visual identity,
both integrated with the real API. Internationalisation (pt-BR, en-US and es) was added recently.

Not yet implemented: product catalogue, cart and orders. The `/home` page exists as a placeholder
for that territory.

## Stack

| Category             | Technology                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------- |
| Framework            | Angular 21 (standalone, zoneless — no `zone.js`)                                            |
| Rendering            | SSR via `@angular/ssr` + Express (`src/server.ts`); every route uses `RenderMode.Prerender` |
| Language             | TypeScript 5.9 (`strict`)                                                                   |
| Styling              | Tailwind CSS 4 (`@tailwindcss/postcss`)                                                     |
| Reactivity           | Angular Signals for local/UI state; RxJS for HTTP and async composition                     |
| Routing              | Angular Router, lazy-loaded per page (`loadComponent`)                                      |
| Internationalisation | Own signal-based service (`core/i18n`) — pt-BR, en-US and es                                |
| Unit testing         | Vitest, via `@angular/build:unit-test`                                                      |
| E2E testing          | Planned; Playwright isn't in the repository yet                                             |
| Deployment           | Vercel                                                                                      |

## Architecture

The code is organised by feature, not by technical type:

```text
src/app/
├── core/        # cross-cutting infrastructure: auth, http, i18n, theme, otp
├── shared/      # UI components and utilities with no feature dependency
├── features/    # functional areas: auth, home, errors
├── layout/      # application shell (header, app-shell)
├── app.ts
├── app.config.ts
└── app.routes.ts
```

Dependency rules: `core` and `shared` know nothing about `features`; a feature can depend on
`core` and `shared`, never the other way round. Signals cover local state, derived state and UI
values; RxJS covers HTTP, async events and stream composition — each abstraction is used where it
naturally fits, with no overlap.

The frontend is not the source of truth for authorisation: any access control in the interface
(hiding elements, guarding routes) exists for UX. Final authority stays with the API.

## Authentication

`AuthApiService` (`core/auth/auth-api.service.ts`) covers login, registration, OTP account
activation (with resend), and the complete password recovery flow (request code, verify code,
confirm new password). The session is kept in `AuthSessionService`; `PasswordResetSessionService`
holds the short-lived token issued between code verification and confirming the new password.
`passwordResetGuard` blocks direct access to the new-password screen without that token.

Each page validates its own fields in `shared/utils/validators.ts` through a `computed`
(`formValid`); the submit button stays disabled while the form isn't valid, so there's no path to
submitting a form with invalid data — the fields use the same constraints the API already enforces
(see the comments in `validators.ts`, which point to the corresponding DTOs in `omnibus.api`).

The date-of-birth field doesn't use a native `<input type="date">`: that control's placeholder
("dd/mm/yyyy", blank segments, ...) is rendered by the browser itself following the operating
system/browser locale, not the language chosen in the app — there's no way to make it say "aaaa"
when the app is in Portuguese. Instead, it's a masked text field (`shared/utils/date-mask.ts`):
`formatDateInput` inserts the slashes as the user types, and `parseDateInputToIso` converts the
typed value into `yyyy-MM-dd` (the format the API expects for `LocalDate`), validating that it's a
real calendar date. The field order (day/month/year or month/day/year) and the placeholder follow
the active language.

## Internationalisation

The app supports three languages: Portuguese (Brazil), English (US) and Spanish — en-US is the
app's only English variant (the most widely spoken globally; the app doesn't distinguish regional
English variants). On the first visit, the language is detected from the browser's preference
(`navigator.languages` — the full list of preferred languages; some browsers let you configure
more than one, in priority order): the list is scanned in order until the first recognised entry
is found — Portuguese (`pt`, `pt-BR`, `pt-PT`, ...) becomes pt-BR; Spanish (`es`, `es-ES`,
`es-MX`, ...) becomes es; any English variant becomes en-US. A preferred language ahead of these
but with no dictionary in the app (German, say) is simply skipped, not counted as a vote for
English. With nothing recognisable anywhere in the list, the default is en-US. The implementation
is a signal-based service (`I18nService`, in `core/i18n/`) — not an external library, nor
Angular's native i18n mechanism — for the same reason `ThemeService` also avoids anything
external: it's local, synchronous UI state, and switching languages in the selector must reflect
on screen immediately, with no rebuild.

- `core/i18n/translations/translations.ts` defines the `Translations` interface, which every
  dictionary must implement in full — a missing string in one language is a compile error, not a
  silent gap on screen.
- `pt-br.ts`, `en-us.ts` and `es.ts` implement that interface. Parameterised copy (a digit, a
  countdown, a number of resends left) are functions, not strings with a placeholder, to keep
  interpolation type-safe.
- The language chosen in the selector persists in `localStorage` (overriding browser detection on
  subsequent visits) and is reflected in `<html lang>`.
- The `shared/ui/language-switcher` component (globe button in the header) switches between the
  three languages.

Errors coming from the API also go through this layer. `GlobalExceptionHandler`, in
`omnibus.api`, always returns an error message in the response body, but that message is a fixed
string defined on the backend — with no notion of language. `core/i18n/api-error-translations.ts`
maps the set of messages the backend actually produces (catalogued from `omnibus.api`'s own
source code) to the current language; a backend message that isn't in that map is never shown
untranslated — the app uses the page's generic error text instead. This also avoids leaking
internal information to the user (such as a record's identifier in an error message that
shouldn't reach them).

A form error (whether a validation error or one coming from the API) is never stored as the
already-resolved string — that would freeze it in whatever language was active when the error
appeared, leaving it stale if the user switches languages via the selector while the error is
still on screen. Instead, `core/i18n/error-resolver.ts` defines `ErrorResolver`, a function from
`Translations` to `string`; each page stores that function (for example,
`(t) => t.auth.login.fallbackError`) and derives the displayed text with a `computed` that
invokes it against `i18n.dict()` — the same language switch that already updates the rest of the
page also re-translates the error.

## Environment configuration

Per-environment values use Angular's native mechanism (`fileReplacements`), not variables read at
runtime: `environment.ts` is the default configuration (used in the production build,
`https://api.omnibus.com`); `environment.development.ts` replaces that configuration when the
build runs with `--configuration development` (`npm run dev` / `npm run watch`, pointing at
`http://localhost:8080`). Any value under `environments/` is public — it ships in the bundle sent
to the browser.

## Running the project

Prerequisites: a Node.js version compatible with Angular 21, and npm.

```bash
npm install

npm run dev              # development environment (ng serve)
npm run build            # production build
npm run watch            # watch-mode build (development)
npm run serve:ssr:omnibus.ui   # runs the Node server against the already-built SSR output
```

There's no `start` script — the development command is `npm run dev`.

## Testing

```bash
npm test
```

Run with Vitest through the Angular CLI's unified test builder. Current coverage: the base
root-component suite generated by the Angular CLI scaffold. End-to-end tests with Playwright are
planned, but not yet implemented.

## Code quality

- **TypeScript** in `strict` mode, with `noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
  `noImplicitReturns` and `noFallthroughCasesInSwitch` enabled; the Angular compiler runs with
  `strictInjectionParameters`, `strictInputAccessModifiers` and `strictTemplates`.
- **ESLint** (flat config): `typescript-eslint` and `angular-eslint` (including template
  accessibility rules), `eslint-plugin-simple-import-sort`, `no-duplicate-imports`,
  `@typescript-eslint/consistent-type-imports`.
- **Prettier**, integrated with ESLint: `printWidth: 100`, `singleQuote: true`,
  `trailingComma: "all"`.

```bash
npm run lint
npm run format
npm run format:check
```

## Continuous integration

There's no CI workflow configured in this repository at the moment. `npm run lint`, `npm run
format:check`, `npm test` and `npm run build` cover the checks a pipeline would run; until
there's automation, it's the responsibility of whoever opens the PR to run them locally.

## Deployment

Hosted on Vercel. The `apiUrl` the app consumes comes from `src/environments/environment.ts`
(replaced by `environment.development.ts` only in builds with `--configuration development`) —
it's a fixed value in the source code, not an environment variable read at deploy time; pointing
at a different API in production requires changing and committing that file.

Since every route uses `RenderMode.Prerender`, the build generates static HTML per route; the
Express server (`server.ts`) exists for on-demand SSR but isn't required under this hosting
model. `vercel.json` sets the fallback to `index.csr.html` for any path with no match among the
pre-rendered files, which includes the app's themed 404 page.

## Roadmap

- [x] Bootstrap (Angular CLI, standalone, zoneless, SSR)
- [x] Own design system (`shared/ui`) with a retro comic-book visual identity
- [x] Complete authentication (login, registration, OTP activation, password recovery)
- [x] Internationalisation (pt-BR, en-US, es) and translation of API error messages
- [ ] Product catalogue
- [ ] Cart and orders
- [ ] End-to-end tests (Playwright)
- [ ] CI pipeline

## Related project

```text
Omnibus
├── omnibus.api   Java / Spring Boot — REST backend
└── omnibus.ui    Angular / TypeScript — this repository
```

[`omnibus.api`](https://github.com/Gabriel-Leao/omnibus.api) is Omnibus's REST backend, built in
Java/Spring Boot with Hexagonal Architecture (Ports & Adapters), responsible for business rules,
persistence, authentication and authorisation. This repository consumes that API and should not
be treated as the source of truth for business rules or authorisation.

## Licence

MIT — see [`LICENSE`](./LICENSE).
