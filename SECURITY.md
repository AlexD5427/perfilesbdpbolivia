# Security

Headers include CSP baseline, frame ancestry protection, object restrictions, referrer policy and permissions policy. No privileged token, camera, microphone, geolocation, browser fingerprinting, screen capture or covert monitoring is implemented.

Before production: move all sensitive writes behind a BFF, add server-side authorization, rate limiting, idempotency keys, email verification, file validation plus malware scanning, signed object-storage URLs, redacted audit logs, and production HSTS. Review CSP with the deployed asset strategy.
