# Testing

Run after installing dependencies:

```bash
npm run typecheck
npm run lint
npm run build
```

Before production, add Vitest and Testing Library unit/component coverage for public DTO filtering, provider mappers, hybrid deduplication, telemetry redaction, accessibility preferences and assessment serialization. Add Playwright smoke coverage for browsing jobs, registration, profile/CV editing, application submission, assessments, keyboard navigation, theme and reduced motion. Do not claim those checks pass until executed in CI.
