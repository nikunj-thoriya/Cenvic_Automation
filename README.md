# Cenvic — Playwright Automation Framework

Playwright + TypeScript automation framework using the Page Object Model.

> All AI agents must read `AI_RULEBOOK.md`, `PROJECT_CONTEXT.md`, `PENDING_TASKS.md` and `APPROVAL_HISTORY.md` before starting any work.

## Prerequisites

- Node.js (v26 verified on this machine)
- Visual Studio Code
- Recommended extensions: Playwright Test for VS Code, ESLint, Prettier, DotENV (VS Code prompts to install them via `.vscode/extensions.json`)

In PowerShell, `npm.ps1` is blocked by the execution policy. Use `npm.cmd` and `npx.cmd`.

## Setup

```powershell
npm.cmd install
npx.cmd playwright install
```

Fill in `BASE_URL`, `LOGIN_PATH`, `API_BASE_URL` and the role credentials in `.env.dev` / `.env.demo` (see `.env.example`).

The API documentation (Swagger) links are stored as `SWAGGER_URL` and `SWAGGER_JSON_URL` in `.env.dev` for reference when writing and reviewing cases; the framework does not read them.

Forgot / Reset Password tests that change a password need a dedicated reset user: set `RESET_USER_USERNAME` (a registered user with a YOPmail address), `RESET_USER_PASSWORD`, `RESET_USER_NEW_PASSWORD` and `YOPMAIL_URL`. The verification code is read from the YOPmail inbox, and those tests are skipped while the values are empty.

The no-campaign user tests use `NO_CAMPAIGN_USER_USERNAME` and `NO_CAMPAIGN_USER_PASSWORD` (already saved in the dev environment file).

## Folder Structure

| Folder                     | Purpose                                                                       |
| -------------------------- | ----------------------------------------------------------------------------- |
| `pages/`                   | Page classes, locators and reusable page methods (module-wise)                |
| `tests/`                   | Test specifications (module-wise)                                             |
| `fixtures/`                | Reusable Playwright fixtures                                                  |
| `utils/`                   | Shared utilities (IST timestamps, `auto` test data, test case HTML generator) |
| `config/environments/`     | Environment loading and validation                                            |
| `config/browsers/`         | Browser projects                                                              |
| `config/roles/`            | Role credential handling                                                      |
| `test-data/`               | Test data, separate from scripts                                              |
| `dom/`                     | Module-wise DOM snapshots                                                     |
| `documentation/`           | DFD, FRD, RTM, workflow diagrams and test cases                               |
| `reports/`                 | Timestamped HTML reports (`AUTO-REPORT-YYYYMMDD-HHMMSS`, IST)                 |
| `test-results/`            | Screenshots, videos and traces per run                                        |
| `AI-Conversation-History/` | Saved conversations (only when requested)                                     |
| `backups/`                 | Backups before significant approved changes                                   |

## Running Tests

Test execution requires the `RUN TEST CASE` authorization (see `AI_RULEBOOK.md`, D7). Default environment is `dev` and default browser is `chromium`.

```powershell
npx.cmd playwright test
$env:TEST_ENV = "demo"
$env:BROWSER = "firefox"
npx.cmd playwright test --grep "@Functional"
npx.cmd playwright test --grep "(?=.*@Functional)(?=.*@High)"
```

`BROWSER` selects the single project to run; `--project` only works for the browser set in `BROWSER`.

Each run creates a new report in `reports/AUTO-REPORT-YYYYMMDD-HHMMSS/`. Previous reports are never overwritten.

## Test Case Documentation

- Source of truth: `documentation/Test-Cases/test-cases.json`
- Generated view: `documentation/Test-Cases/test-cases.html`

```powershell
npm.cmd run testcases:html
```

## Requirement Traceability Matrix

- Source of truth: `documentation/RTM/rtm-requirements.json` (requirement to test case mapping), joined with `test-cases.json`
- Generated view: `documentation/RTM/rtm.html`
- Scope: Login, Home, Signup, Forgot Password and Reset Password. Requirement IDs are blank until assigned.
- Regenerate after any test case or mapping change.

```powershell
npm.cmd run rtm:html
```

## Data Flow Diagrams

- Source of truth: `documentation/DFD/<Type>/<type>-dfd.json`; the HTML is generated and must not be edited by hand
- Available types: `UI-Based` and `Complete-System` (Level 0, Level 1 and Level 2 per module). API-Based and Database-Level are not created yet (PT-031).
- Scope: Login, Home, Signup, Forgot Password and Reset Password
- Solid shapes are confirmed by recordings, DOM, config and test cases; dashed shapes are derived and must be confirmed
- Regenerate after any flow, page or scope change.

```powershell
npm.cmd run dfd:html
```

## Code Quality

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
```
