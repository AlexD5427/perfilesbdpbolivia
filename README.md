# BDP Candidate Portal

Spanish-first public candidate portal MVP for Banco de Desarrollo Productivo BDP S.A.M.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The MVP is provider-free and uses fictional data in `src/lib/jobs.ts`. Default locale is `es-BO`; the user-facing timezone is `America/La_Paz`.

## Current scope

- Public landing page and job directory.
- Dynamic, provider-shaped job pages.
- Mock registration, login, password recovery, candidate profile, CV, applications and notifications.
- Spanish accessibility, privacy and help surfaces.
- Light/dark theme and large-text preference.
- Security headers and no public ranking, fit score, hiring probability, internal stage or reviewer data.

## Architecture notes

`src/lib/jobs.ts` is the mock repository seam today. Replace it with repository contracts and server-only provider adapters for Supabase, Google Apps Script, Hybrid, Archive API and object storage. Never call those services from presentation components. Sensitive writes require a secure backend-for-frontend.

## Verification

Run `npm run typecheck`, `npm run lint` and `npm run build`. The GitHub-connected environment should run these checks after dependency installation. Legal copy and authentication are intentionally mock-only until bank-approved backend contracts are available.
