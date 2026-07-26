# Data providers

The MVP uses fictional local data only. Planned provider modes are `mock`, `supabase`, `apps-script` and `hybrid`. Public reads must be schema-validated and normalized. Hybrid reads should deduplicate on stable external references, use deterministic source priority, tolerate one provider failing, and never expose provider errors.

Candidate registration, applications and assessment answers must never write directly to Sheets from the browser. Supabase is the future operational authority; Apps Script is transitional publishing/import/reporting only.
