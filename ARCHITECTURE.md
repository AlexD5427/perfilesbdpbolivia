# Architecture

The app uses Next.js App Router with server-rendered public pages and small client components only for forms, filtering and preferences. Domain data is isolated in `src/lib`; presentation components do not own provider credentials or operational persistence.

Next evolution: introduce `src/core/domain`, `src/core/repositories`, `src/infrastructure/providers/{mock,supabase,apps-script,hybrid}`, `src/features/{jobs,auth,candidate-profile,cv,applications,assessments,notifications}` and validated DTO mappers. Public DTOs must discard internal workflow fields by construction.

Candidate-to-employee data must remain separated. Future HR administration belongs in a separate application boundary, not in public routes.
