# مشروع سكوت (Scott Story)

An Arabic-first Expo reading app with illustrated chapters, bookmarks, reading themes, and locally saved progress.

## Run & Operate

- Install dependencies with `pnpm install --frozen-lockfile`.
- Use Replit's Run button or start the managed workflow `artifacts/scott-story: expo` to open the app preview. The workflow supplies the Expo domain configuration and `PORT` (23215); do not start Expo outside the managed workflow.
- `artifacts/api-server: API Server` — optional Express API workflow (port 8080); `GET /api/healthz` returns `{"status":"ok"}`.
- The canvas preview workflow is not required to run the reader.
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- The current reader and API health endpoint require no additional secrets or database. Reader preferences and progress use AsyncStorage on the device/browser.
- `DATABASE_URL` is needed only if database-backed features are added using the existing DB package; the current API does not import that package.

## Stack

- pnpm workspaces, Node.js, TypeScript
- Mobile: Expo SDK 57, React Native, Expo Router
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/scott-story/` — Expo app, routes, bundled story content, and illustrations.
- `artifacts/api-server/` — Express API with health endpoint.
- `lib/` — shared API contracts, generated clients, and unused database package.
- `artifacts/mockup-sandbox/` — optional design previews.

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

Read chapters in Arabic, adjust font size and reading theme, bookmark chapters, and resume locally saved progress.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Keep the `proxy-addr` override: the imported lockfile's older version was blocked by the package security registry.
- Initial Expo preview loading can take longer while Metro compiles the bundle and Arabic fonts load.
- React Native's optional desktop DevTools reports missing Linux GUI libraries in this container. This does not prevent Metro or the app preview from running.
- Browser preview and type checks were verified during import setup; physical-device behavior has not been verified.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
