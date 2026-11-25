# PROJECT CONTEXT — CENVIC

Last updated: 2026-11-24 IST

## Application Purpose

KSF & Associates envisions a Government-focused Public Engagement SaaS platform designed to enable
public agencies and affiliated organizations to efficiently collect, manage, and analyze community
input through compliant, accessible, and easy-to-deploy digital campaigns.

The platform is built around a campaign-based engagement model: Business Clients create and launch
campaigns (video feedback, surveys, event registrations / RSVP) that third-party end users respond to
via a campaign QR code, optionally receiving a reward for their submission. Business Clients can then
view, manage, download and export the submitted reviews/testimonials (e.g. to share as social proof).

## Confirmed Information

| Item                    | Detail                                                                                                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project                 | Cenvic                                                                                                                                                                                                |
| Project type            | New automation project (no existing automation codebase)                                                                                                                                              |
| Technology              | Playwright + TypeScript (strict), Node.js                                                                                                                                                             |
| Architecture            | Page Object Model                                                                                                                                                                                     |
| IDE                     | Visual Studio Code                                                                                                                                                                                    |
| Environments configured | dev, demo                                                                                                                                                                                             |
| Production              | Not configured; user will guide when required                                                                                                                                                         |
| Browsers                | Chromium (default), Firefox, WebKit (selected with `BROWSER`)                                                                                                                                         |
| Time zone               | IST (Asia/Kolkata)                                                                                                                                                                                    |
| Git / CI/CD             | Out of scope                                                                                                                                                                                          |
| Governance              | `AI_RULEBOOK.md` (master prompt + project decisions)                                                                                                                                                  |
| API documentation (dev) | Swagger UI `https://cenvicapidev.alliancetek.net/swagger/index.html`; JSON `https://cenvicapidev.alliancetek.net/swagger/v1/swagger.json` (saved as `SWAGGER_URL` / `SWAGGER_JSON_URL` in `.env.dev`) |
| Authentication method   | Plain form-based login (no SSO/MFA)                                                                                                                                                                   |
| User roles              | Only `user` (Business Client) credentials automated today; an `admin` role manages submitted reviews across campaigns but has no confirmed automation credentials yet                                 |

## Missing Information (to be provided by the user)

- Application modules and user journeys (to be provided incrementally alongside DOM/outer HTML recordings).
- Application URL for demo (dev confirmed in `.env.dev`; not yet added to this document per user decision).
- Full role/permission matrix for `admin` and any other roles beyond `user`.
- Existing documentation (FRD, DFD, RTM, API specifications, workflows).
- API and database testing scope.
- Test data requirements.

## Assumptions

- None recorded.
