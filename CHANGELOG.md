# CHANGELOG

All notable changes to this project are recorded here. Dates are in IST.

CI verification: login smoke and full suite all-pass PR check.

## [1.23.17] - 2026-11-25

### Added

- `CreateCampaign.spec.ts`: TC-CAMPAIGNS-097 (Online Event shows the meeting link), 098 (required star in the Form Preview) and 099 (preview title shows the Event Name). Online event and preview locators in `CreateCampaignPage.ts`.

### Changed

- Registry module "Create Campaign" split into "Create Campaign - Common", "Create Campaign - Video Review", "Create Campaign - Survey" and "Create Campaign - RSVP".
- `test-cases.html` regenerated (486 cases).

## [1.23.16] - 2026-11-25

### Added

- `CreateCampaign.spec.ts`: TC-CAMPAIGNS-095 (First Name and Last Name cannot be turned off) and TC-CAMPAIGNS-096 (City and Zip Code locked as required by Address). RSVP field toggle (`#vis-rsvp-N`) and Required (`#req-rsvp-N`) locators in `CreateCampaignPage.ts`.

### Changed

- TC-CAMPAIGNS-053 reactivated and scripted: RSVP fields can be turned off and on (user's screenshots and codegen). TC-CAMPAIGNS-052 now uses the Phone Number Required checkbox.
- `test-cases.html` regenerated (483 cases).

## [1.23.15] - 2026-11-25

### Added

- `CreateCampaign.spec.ts`: TC-CAMPAIGNS-086 to 094 (login redirect and return URL, 100-character boundary, HTML/script in the name, keyboard-only use, mobile viewport, questions kept on Previous, Created and Expiration Date columns).
- `CampaignLifecycle.spec.ts`: TC-CAMPAIGN-DETAIL-047 (expiration date shown in Settings and the list, format from the user's screenshot) and TC-CAMPAIGN-DETAIL-059 (HTML/script in a saved name).
- `CampaignsPage.ts`: list date format helper and Created/Expiration Date cells. `CampaignDetailPage.ts`: expiration date typing. `CreateCampaignPage.ts`: expiration date and timezone picking.

### Changed

- `test-cases.html` regenerated (481 cases); `PENDING_TASKS.md` PT-035 Completed.

## [1.23.14] - 2026-11-25

### Added

- `CreateCampaignPage.ts`: steps 2 to 6 (Campaign Details, Instructions, Survey Builder, RSVP Form, QR & Link, Launch, Confirm Publish) from the user's codegen recordings and screenshots, plus wizard helpers.
- `CreateCampaign.spec.ts`: TC-CAMPAIGNS-038 to 046, 048 to 050, 052, 054, 056 to 060 and new TC-CAMPAIGNS-071 to 085 (field validation, question types and options, reward fields, publish dialog, publish end to end).
- `tests/campaigns/CampaignLifecycle.spec.ts`: TC-CAMPAIGN-DETAIL-045, 046, 048 to 056, new 057 and 058 (Resume dialog), and TC-CAMPAIGNS-061 to 070 (Draft Edit, full lifecycle per type). Each test creates its own `auto` campaign and deletes it afterwards.
- `CampaignDetailPage.ts`: Save Changes, Resume control and dialog, edit, pause, resume and delete helpers. `CampaignsPage.ts`: row by name, Draft Edit button and open by name.

### Changed

- TC-CAMPAIGNS-053 set to Deprecated (RSVP form fields are fixed). TC-CAMPAIGNS-052 and 056 reworded to the confirmed behaviour. TC-CAMPAIGN-DETAIL-047 stays Planned (list date format not confirmed).
- `test-cases.html` regenerated (471 cases); `PENDING_TASKS.md` PT-034 and PT-035 updated.

## [1.23.13] - 2026-11-25

### Added

- `pages/campaigns/CreateCampaignPage.ts`, `tests/campaigns/CreateCampaign.spec.ts`, `test-data/campaigns/create-campaign-test-data.json`: rebuilt from the recorded DOM (step 1 and the wizard frame only). Scripted: TC-CAMPAIGNS-036, 037, 047, 051 and 055.
- `tests/campaigns/CampaignDetail.spec.ts`: TC-CAMPAIGN-DETAIL-032 to 038 (Settings fields become editable after Edit, nothing is saved) and TC-CAMPAIGN-DETAIL-039 to 044 (Delete and Pause confirmation dialogs open, Cancel and close keep the campaign). Dialog locators in `CampaignDetailPage.ts`; dialog texts in `campaign-detail-test-data.json`.
- `documentation/Test-Cases/test-cases.json`: 22 Planned cases for edit, save, delete, pause and propagation (TC-CAMPAIGN-DETAIL-045 to 056, TC-CAMPAIGNS-061 to 070).
- `PENDING_TASKS.md`: PT-034 (Create Campaign steps 2 to 6 DOM) and PT-035 (edit, delete, pause and draft-edit confirmations).

### Changed

- TC-CAMPAIGNS-038 to 046, 048 to 050, 052 to 054 and 056 to 060 reworded with the real step names (Select Type, Campaign Details, Instructions, type-specific step, QR & Link, Launch) and set to Planned (PT-034).

### Fixed

- The earlier Create Campaign page object, spec and test data used guessed locators, messages and step names (Builder, Settings, Tagline, Review). They were removed and replaced.
- TC-VIDEO-UPLOAD-001 to 019 were deleted by mistake; restored and set to Inactive (hidden for now, set Active to show them again).
- Removed the stray `tests/campaigns/CampaignDetail-Edit-Delete.spec.planning.ts` file.
- `test-cases.html` regenerated (454 cases).

## [1.23.12] - 2026-11-24

### Added

- `tests/dashboard/Logout.spec.ts`: TC-LOGOUT-014 (stored session data cleared after logout). Storage keys added to `dashboard-test-data.json`.
- `tests/forgot-password/ForgotPassword.spec.ts`: TC-RESET-PASSWORD-020 (code with spaces or other case rejected) and TC-RESET-PASSWORD-024 (same password accepted).

### Changed

- TC-LOGIN-023 kept as is (Planned).
- `test-cases.html` regenerated (394 cases); `PENDING_TASKS.md` PT-023 and PT-029 updated.

## [1.23.11] - 2026-11-25

### Added

- `tests/login/Login.spec.ts`: TC-LOGIN-025 (standard-format emails with special characters pass the format check).
- `tests/signup/Signup.spec.ts`: TC-SIGNUP-027, 035, 036, 037 (over-limit validation messages) and TC-SIGNUP-038 (email longer than 50 characters).
- `tests/profile/Profile.spec.ts`: TC-PROFILE-026, 027, 029, 032.
- `tests/forgot-password/ForgotPassword.spec.ts`: TC-RESET-PASSWORD-012, 015 to 019 (password rule indicators red or green) and 025. Page object `expectPasswordRuleMet` and `expectPasswordRuleStates`.
- Test data: signup limits and messages, profile limits and messages, login special-character emails, reset password rule samples.

### Changed

- TC-LOGIN-031 and TC-SIGNUP-026 set to Deprecated (no longer required).
- TC-PROFILE-026 reworded to the 150-character name limit.
- `test-cases.html` regenerated (394 cases).
- `PENDING_TASKS.md`: PT-023 and PT-025 notes updated.

## [1.23.10] - 2026-11-25

### Added

- `tests/login/Login.spec.ts`: TC-LOGIN-024 (email is case-insensitive at login).
- `tests/forgot-password/ForgotPassword.spec.ts`: TC-FORGOT-PASSWORD-016 (fifth code request in a day is blocked; uses the no-campaign user). Test data `limits.dailyCodeRequests`.
- `.env.dev`: `SWAGGER_URL` and `SWAGGER_JSON_URL` (empty keys added to `.env.example` and `.env.demo`).
- `documentation/Test-Cases/test-cases.json`: 34 Manual cases for Add New Client (TC-ADD-CLIENT-001 to 034) and 19 Manual cases for Video Upload (TC-VIDEO-UPLOAD-001 to 019).

### Changed

- TC-FORGOT-PASSWORD-016 and TC-LOGIN-024 set to Automated.
- TC-LOGIN-023 reworded from 255 to 150 characters (email limit confirmed by the user, matches Swagger); stays Planned.
- `test-cases.html` regenerated (393 cases).
- `PENDING_TASKS.md`: PT-024, PT-025, PT-027 and PT-031 notes updated.
- `README.md` and `PROJECT_CONTEXT.md`: Swagger URL mentioned.

## [1.23.9] - 2026-11-25

### Added

- `tests/login/Login.spec.ts`: TC-LOGIN-028 (account is not locked after 6 failed attempts; lockout is not implemented).
- `tests/forgot-password/ForgotPassword.spec.ts`: TC-FORGOT-PASSWORD-017 (a logged-in user cannot open Forgot Password in a new tab).
- `tests/signup/Signup.spec.ts`: TC-SIGNUP-023/024 (special characters accepted in company name and name), TC-SIGNUP-032/033/034 (company name 250, address 500, name 150 characters accepted).
- `tests/profile/Profile.spec.ts`: TC-PROFILE-022 (photo larger than 5 MB rejected), TC-PROFILE-035 (valid photo uploads).
- Test data: `fieldLimits` and `specialCharacters` (signup), `lockout` (login), `photoFiles.oversized` (profile).
- `documentation/Test-Cases/test-cases.json`: new cases TC-SIGNUP-032 to 034 (Automated), TC-SIGNUP-035 to 037 (Planned) and TC-LOGOUT-015 (Manual, 240-minute session expiry).

### Changed

- Reworded TC-LOGIN-028, TC-FORGOT-PASSWORD-016/017, TC-SIGNUP-023/024/027, TC-PROFILE-022. TC-SIGNUP-023/024 changed from Negative to Positive. TC-FORGOT-PASSWORD-016 and TC-SIGNUP-027 stay Planned.
- `test-cases.html` regenerated (340 cases).
- `PENDING_TASKS.md`: PT-012, PT-013, PT-014, PT-024, PT-025, PT-026 and PT-031 notes updated.
- `README.md`: no-campaign user environment variables mentioned.

## [1.23.8] - 2026-11-25

### Added

- `tests/login/Login.spec.ts`: TC-LOGIN-035 (email input attributes) and TC-LOGIN-036 (branding panel heading, logo icon, feature highlights).
- `tests/home/Home.spec.ts`: TC-HOME-031 (footer About Us), TC-HOME-032 (footer Privacy), TC-HOME-033 (Skip to main content), TC-HOME-034 (mobile hamburger menu).
- `tests/dashboard/Dashboard.spec.ts`: TC-DASHBOARD-039 (View All opens Campaigns), TC-DASHBOARD-040 (Skip to main content), TC-DASHBOARD-041 (mobile hamburger menu).
- `tests/profile/Profile.spec.ts`: TC-PROFILE-037 (Skip to main content).
- `pages/home/HomePage.ts`, `pages/dashboard/DashboardPage.ts`, `pages/profile/ProfilePage.ts`: `skipToContentLink` (and `navbarToggler` on Home and Dashboard); `pages/login/LoginPage.ts`: branding locators.
- `test-data/home/home-test-data.json`: `aboutUs`, `privacyPolicy` routes; `test-data/login/login-test-data.json`: `emailInput`.

### Changed

- `documentation/Test-Cases/test-cases.json`: 10 new Automated cases; `test-cases.html` regenerated (333 cases).
- `PENDING_TASKS.md`: PT-024, PT-025 and PT-027 notes updated.

## [1.23.7] - 2026-11-25

### Changed

- `tests/dashboard/Dashboard.spec.ts` (TC-DASHBOARD-002 to 005, 018): campaign names, statuses and stat counts are dynamic, so the tests no longer compare against fixed values. Stat cards must show a whole number; TC-DASHBOARD-018 checks the first recent campaign card has a name and two tags (type, status).
- `pages/dashboard/DashboardPage.ts`: added `expectStatCardIsCount()` and `getRecentCampaignCards()`; removed `getCampaignCard()`.
- `test-data/dashboard/dashboard-test-data.json`: removed the static `stats` and `recentCampaigns`.
- `documentation/Test-Cases/test-cases.json`: TC-DASHBOARD-002 to 005 expected results no longer quote fixed counts.
- `PENDING_TASKS.md`: PT-025 notes that chart hover-tooltip cases are skipped by the user's decision — APR-040.

## [1.23.6] - 2026-11-25

### Added

- `tests/dashboard/Dashboard.spec.ts` (TC-DASHBOARD-033): logs in as the no-campaign account and checks the "No recent campaigns found." empty state, Active Campaigns = 0 and no error alert. Skips with a reason until `NO_CAMPAIGN_USER_USERNAME` / `NO_CAMPAIGN_USER_PASSWORD` are set.
- `pages/dashboard/DashboardPage.ts`: `noRecentCampaignsMessage` locator; `test-data/dashboard/dashboard-test-data.json`: `emptyState.recentCampaigns`.
- `.env.dev`, `.env.example`, `.env.demo`: empty `NO_CAMPAIGN_USER_*` placeholders.

### Changed

- `documentation/Test-Cases/test-cases.json`: TC-DASHBOARD-033 moved to Automated.
- `PENDING_TASKS.md`: PT-025 updated — APR-039.

## [1.23.5] - 2026-11-25

### Added

- `tests/dashboard/Dashboard.spec.ts` (TC-DASHBOARD-035) and `DashboardPage.getReviewsChartValues()`: the Yearly Reviews Over Time points (read from the SVG polyline and y-axis ticks) must add up to the Reviews Collected stat. The QR Code Scans chart is not compared: its bars are rounded percentages of the axis maximum and the QR Scans stat is an all-time total.

### Changed

- `pages/dashboard/DashboardPage.ts`: chart subtext locators now match "review submissions" / "scan activity" for any period (the text is "Weekly/Yearly ...", not "Daily ..."), fixing stale locators used by TC-DASHBOARD-006 and 011.
- `dom/dashboard/dashboard-recorded-flow.txt`: documented the real chart DOM from `dashboard-charts-weekly-dom-20261124-135519.html` (that capture is Yearly for Reviews, Weekly for QR despite its name).
- `documentation/Test-Cases/test-cases.json`: TC-DASHBOARD-035 moved to Automated.
- `PENDING_TASKS.md`: PT-025 updated; TC-DASHBOARD-033 (empty-state DOM) is the only Dashboard case still blocked, plus hover-tooltip capture — APR-038.

## [1.23.4] - 2026-11-25

### Changed

- `dom/dashboard/dashboard-recorded-flow.txt`: added the data-rich stage recording (treated as dev) — stat card CSS classes, Reviews Over Time period behavior, Draft status, Recent Campaigns card structure — and listed what is still missing for TC-DASHBOARD-033/035 (chart container HTML, QR Code Scans chart interaction, tooltips, empty-state DOM). Credentials from the recording were not stored.
- `PENDING_TASKS.md`: PT-025 updated with the remaining Dashboard DOM needs — APR-037.

## [1.23.3] - 2026-11-25

### Added

- Scripted 16 confirmed Planned cases: TC-LOGIN-022, TC-HOME-022/025, TC-DASHBOARD-034, TC-PROFILE-021/023, TC-CHANGE-PASSWORD-016/017/019/021/022/023/025 and TC-SIGNUP-022/025/029.
- `tests/profile/ChangePassword.spec.ts`: `attemptPasswordChange` and `restorePassword` helpers; every password-changing test restores the shared account password. TC-CHANGE-PASSWORD-019/025 and TC-SIGNUP-022 assert a consistent outcome (accepted or rejected with feedback) because the exact policy is not defined.
- `fixtures/dashboard.fixture.ts`: `campaignsPage` fixture (used by TC-DASHBOARD-034).
- Test data: password special-character/space/leading-space values and `photoFiles` (profile), `emailWithTag` and `invalidEmailFormats` (signup).

### Changed

- `tests/profile/ChangePassword.spec.ts` (TC-CHANGE-PASSWORD-012/013): now restore the original password at the end so later tests and runs are not affected.
- `documentation/Test-Cases/test-cases.json`: the 16 cases above moved from Planned to Automated.
- `PENDING_TASKS.md`: PT-024/PT-025 updated. TC-DASHBOARD-033/035 stay Planned (no empty-campaign account, chart DOM not captured) — APR-036.

## [1.23.2] - 2026-11-24

### Added

- `tests/dashboard/Logout.spec.ts`: TC-LOGOUT-012 (a logged-in user opening `/login` sees the Login page open normally, no auto-redirect) and TC-LOGOUT-013 (a logged-in user opening `/get-started` sees the Request Access page open normally), per the user's confirmed behavior.

### Changed

- `documentation/Test-Cases/test-cases.json` (TC-LOGOUT-012, TC-LOGOUT-013): expected results reworded to the confirmed behavior and `automationStatus` moved to Automated.
- `test-data/dashboard/dashboard-test-data.json`: added `routes.login` and `routes.getStarted`.
- `PENDING_TASKS.md`: PT-009 marked Completed (Dashboard DOM was already recorded in `dom/dashboard/dashboard-dom.html`). PT-029 updated — redirect behavior, cross-tab logout and Back-button behavior confirmed and scripted; only the exact storage key names for TC-LOGOUT-014 remain open — APR-035.

## [1.23.1] - 2026-11-24

### Fixed

- `PENDING_TASKS.md` (PT-017): corrected the Remember Me finding — the user confirmed Remember Me does persist after a full browser restart, reversing the 2026-11-24 finding that said it did not.

### Added

- `tests/login/Login.spec.ts` (TC-LOGIN-030): Remember Me persistence after closing and reopening the browser, using a new browser context with the saved storage state to simulate the restart.

### Changed

- `documentation/Test-Cases/test-cases.json` (TC-LOGIN-030): `automationStatus` moved from Planned to Automated (expected result was already correct). TC-LOGIN-032 confirmed as-written (mobile viewport, matches the user's "same as web" answer, already Automated). TC-LOGIN-031 (ARIA/screen reader) remains open — still needs its own confirmation, separate from TC-LOGIN-032.
- `PENDING_TASKS.md`: PT-025 updated to reflect TC-LOGIN-030/032 resolution and that TC-LOGIN-031 is still open — APR-034.

## [1.23.0] - 2026-11-25

### Added

- `tests/login/Login.spec.ts`: TC-LOGIN-033 (script/XSS input rejected on the login fields) and TC-LOGIN-034 (double-clicking Login sends only one request), reusing the dialog-listener and request-counting patterns already established for Forgot Password.
- `tests/signup/Signup.spec.ts`: TC-SIGNUP-028 (double-click protection, now scripted and Automated), TC-SIGNUP-030 (SQL injection in the Message field is safely rejected) and TC-SIGNUP-031 (script injection is not executed).
- `tests/profile/Profile.spec.ts`: TC-PROFILE-036 (script injection in the First Name field is not executed); the field is reverted back to the original name at the end of the test.
- `tests/profile/ChangePassword.spec.ts`: TC-CHANGE-PASSWORD-026/027/028 (new password missing an uppercase letter / number / special character is rejected), TC-CHANGE-PASSWORD-029 (Enter key submits the form), TC-CHANGE-PASSWORD-030 (double-click sends only one update request) and TC-CHANGE-PASSWORD-031 (old password rejected after a successful change); the mutating cases (030, 031) restore the original password at the end of the test.
- `test-data/login/login-test-data.json`, `test-data/signup/signup-test-data.json`, `test-data/profile/profile-test-data.json`: added `scriptInjection`/`sqlInjection` payload fields and missing-rule password samples, reusing the exact payload strings already used by Forgot Password for consistency.

### Changed

- `documentation/Test-Cases/test-cases.json` (TC-LOGIN-022): expected result reworded to state the email is automatically trimmed, per the user's confirmation.
- `documentation/Test-Cases/test-cases.json`: removed TC-LOGIN-026 (special-character password login is already covered by the general valid-login case), TC-HOME-030 (load-time threshold not applicable) and TC-DASHBOARD-032 (campaign cards are informational only, no navigation occurs).
- `PENDING_TASKS.md`: PT-024 updated with the 11 newly scripted cases; PT-025 updated to record which cases are confirmed/removed and which remain open (including two flagged conflicts on TC-LOGIN-030 and TC-LOGIN-031); PT-028 marked Completed — APR-033.

## [1.22.0] - 2026-11-24

### Changed

- Merged the stray `dom/forgot/` folder (created by a module-name mismatch when recording) into `dom/forgot-password/`, renaming the two captures to the standard `forgot-password-dom-*.html` convention and fixing their header comments. These captures show the Forgot Password page's default state and the post-send success toast; the Reset Password invalid-password error state is still not captured — documented in `forgot-password-recorded-flow.txt` and PT-021/PT-026.
- `documentation/Test-Cases/test-cases.json` (TC-FORGOT-PASSWORD-017): reverted to "kept in the pending task" — the user's later answer supersedes the earlier "page opens normally" confirmation.
- `PENDING_TASKS.md`: PT-019 updated — user confirmed Signup/Request Access does not grant direct login; an admin flow provisions accounts and details will follow later, so the static `.env.dev` reset user remains necessary for now. PT-021 moved to In Progress (Forgot Password DOM evidence now covers two states). PT-022/PT-026 updated to resolve the TC-017 conflict and record that TC-016 needs dev team confirmation — APR-032.

## [1.21.0] - 2026-11-24

### Fixed

- `tests/forgot-password/ForgotPassword.spec.ts`, `documentation/Test-Cases/test-cases.json` (TC-FORGOT-PASSWORD-008): corrected the expected result from an inline "valid email" message to the real confirmed behavior, a "User not found" toast; removed the now-unused `expectValidEmailMessage()` helper from `pages/forgot-password/ForgotPasswordPage.ts`.

### Changed

- `documentation/Test-Cases/test-cases.json` (TC-FORGOT-PASSWORD-017): expected result confirmed as "page opens normally" for a logged-in user. PT-023 (Reset Password expected results) marked Completed — user confirmed the existing wording is correct. PT-019/PT-020 updated to flag that the Signup/Request Access form has no password field, so it's unclear whether it can produce a usable login account for Forgot Password testing. PT-026 updated to flag a DOM-capture and a TC-017 answer conflicting with PT-022 — APR-031.

## [1.20.0] - 2026-11-24

### Changed

- `dom/login/request-access-recorded-flow.txt`: added the confirmed page URL (`/get-started`), the full Industry dropdown option list, the final success message wording, and confirmation that the "Failed to fetch" toast was caused by a team deployment, not app behavior. PT-010 marked Completed — APR-030.

## [1.19.0] - 2026-11-24

### Added

- `dom/login/request-access-recorded-flow.txt`: Playwright codegen flow for the Request Access page (fields, consent checkboxes, Submit, a "Failed to fetch" error toast and a "Thank you!" success state) — PT-010.

### Changed

- `dom/login/login-recorded-flow.txt`: "Request Access." navigation entry now points at the new recorded-flow file instead of "(page not recorded)" — APR-029.

## [1.18.0] - 2026-11-24

### Changed

- `PENDING_TASKS.md`: PT-011 and PT-017 marked Completed (Login state DOMs already documented; Remember Me persistence behavior confirmed). PT-010 kept Pending with the discrepancy noted (destination page DOM still not actually recorded). PT-012/PT-013 kept Pending — user to confirm with their team. PT-015 scope expanded to all modules and moved to In Progress. PT-016 partially confirmed (case-insensitive email accepted) and moved to In Progress — APR-028.

## [1.17.0] - 2026-11-24

### Changed

- `PENDING_TASKS.md`: PT-006 marked Completed — user confirmed no FRD/DFD/RTM/API documents exist; this framework generates its own documentation from the automation scripts instead. PT-031 updated to reflect that API spec details will be provided later — APR-027.

## [1.16.0] - 2026-11-24

### Changed

- `PROJECT_CONTEXT.md`: added confirmed application purpose, authentication method (plain form login) and current role scope (PT-005); moved modules/user journeys and full role/permission matrix to "Missing Information" pending incremental DOM-based delivery — APR-026.

## [1.15.0] - 2026-11-24

### Added

- `fixtures/auth.fixture.ts`: worker-scoped authentication fixture (PT-001) that logs in once per worker via the UI and reuses the captured `storageState` for every test's page, instead of repeating the UI login per test.

### Changed

- `fixtures/campaigns.fixture.ts`, `tests/campaigns/Campaigns.spec.ts` and `tests/campaigns/CampaignDetail.spec.ts` now extend `auth.fixture.ts` and no longer call `loginPage.login()` in `beforeEach` — APR-025.

## [1.14.0] - 2026-11-23

### Changed

- `documentation/Test-Cases/test-cases.json`: `module` field for the 14 `TC-LOGOUT-*` test cases changed from `"Dashboard"` to `"Dashboard / Logout"`, mirroring the existing `Profile` / `Profile / Change Password` two-tier naming convention. `documentation/Test-Cases/test-cases.html` regenerated (315 total test cases, unchanged count) — APR-024.
- `AI_RULEBOOK.md` Section 31 documents the `Parent / Sub-feature` module naming convention for sub-features with their own test case ID prefix and automation script — APR-024.

## [1.13.0] - 2026-11-23

### Added

- `pages/campaigns/CampaignDetailPage.ts`: Page Object covering the header (name, status/type tags, created date, Edit/Delete, Back to Campaign), all 5 tabs (Overview stat cards, Response, QR Codes downloads, SMS Reminders sub-grid, Settings form/Brand Color/Pause Campaign) — APR-023.
- `dom/campaigns/campaign-detail-recorded-flow.txt`: locator reference derived from the raw Campaign Detail DOM capture — APR-023.
- `test-data/campaigns/campaign-detail-test-data.json` and the `campaignDetailPage` fixture in `fixtures/campaigns.fixture.ts` — APR-023.
- `tests/campaigns/Campaigns.spec.ts` (35 cases, TC-CAMPAIGNS-001 to 035) and `tests/campaigns/CampaignDetail.spec.ts` (31 cases, TC-CAMPAIGN-DETAIL-001 to 031) — APR-023.
- 66 new entries in `documentation/Test-Cases/test-cases.json`; `documentation/Test-Cases/test-cases.html` regenerated (315 total test cases) — APR-023.
- PT-033 to confirm the Campaign Detail route, Edit/Settings-Save behavior, Delete/Pause behavior, non-RSVP Response tab wording and row-by-name grid scoping — APR-023.

## [1.12.0] - 2026-11-23

### Added

- `dom/campaigns/campaigns-recorded-flow.txt`: cleaned locator reference derived from the user's recorded Campaigns list codegen flow — APR-022.
- `pages/campaigns/CampaignsPage.ts`: Page Object covering search, sortable/filterable grid columns, row actions (view, more actions, PDF/QR downloads) and pagination — APR-022.
- `test-data/campaigns/campaigns-test-data.json` and `fixtures/campaigns.fixture.ts` — APR-022.
- PT-032 to record the Campaign Detail DOM and confirm row scoping — APR-022.

## [1.11.0] - 2026-11-23

### Added

- `documentation/DFD/UI-Based/ui-based-dfd.json` and `ui-based-dfd.html`: Level 0, Level 1 and Level 2 DFDs for Home, Login, Signup, Forgot Password and Reset Password — APR-021.
- `documentation/DFD/Complete-System/complete-system-dfd.json` and `complete-system-dfd.html`: the same levels with S3 storage, Email service, logical data stores and Cenvic Team (derived items dashed) — APR-021.
- `utils/generate-dfd-html.mts` and the `dfd:html` script, which generate self-contained inline SVG HTML with legend, flow tables and evidence marking — APR-021.
- PT-031 to provide API and database documentation for the deferred API-Based and Database-Level DFDs — APR-021.

### Changed

- README documents the DFDs — APR-021.

## [1.10.0] - 2026-11-23

### Added

- `documentation/RTM/rtm-requirements.json`: 31 feature-level requirements mapped to the 144 test cases of Login, Home, Signup, Forgot Password and Reset Password. Requirement IDs are blank — APR-020.
- `utils/generate-rtm-html.mts` and the `rtm:html` script, which generate `documentation/RTM/rtm.html` with coverage, execution status, gaps, search and filters — APR-020.
- PT-030 to assign requirement IDs and extend the RTM — APR-020.

### Changed

- README documents the RTM — APR-020.

## [1.9.0] - 2026-11-23

### Added

- Session Management cases TC-LOGOUT-008 to 011 (Back after logout, reload, new tab, logout in another tab) scripted in `tests/dashboard/Logout.spec.ts`, and TC-LOGOUT-012 to 014 as Planned — APR-019.
- PT-027 to PT-029 for uncovered DOM elements, gaps against Forgot / Reset Password, and Session Management behavior — APR-019.

### Changed

- The 25 Change Password cases are labelled Profile / Change Password — APR-019.
- TC-PROFILE-012 now verifies that the Company Name field is read-only (it is editable only on the Request Access page); `fillCompanyName` removed from `pages/profile/ProfilePage.ts` — APR-019.
- PT-024 and PT-025 updated for the removed and added Planned cases — APR-019.

### Removed

- TC-DASHBOARD-027 to 031, duplicates of TC-LOGOUT-003 to 007 — APR-019.
- TC-PROFILE-024 and 025 (company name length and special characters), not applicable because the field is read-only — APR-019.

## [1.8.0] - 2026-11-23

### Added

- 41 previously Planned test cases scripted across Login (027, 029, 032), Home (021, 023, 024, 029), Dashboard (027 to 031, 036 to 038), Profile (028, 030, 031, 033, 034), Change Password (018, 020, 024), Forgot Password (008 to 015, 018 to 020) and Reset Password (013, 014, 021, 022, 023, 026, 027) — APR-018.
- 6 test cases from the captured Forgot / Reset Password DOM: TC-FORGOT-PASSWORD-021 and TC-RESET-PASSWORD-028 to 032 (placeholders, Back to Login on the Reset step, Confirm Password toggle, countdown durations, Enter key submit) — APR-018.
- `utils/layout.ts` with `MOBILE_VIEWPORT` and `expectNoHorizontalOverflow` for the responsive cases — APR-018.
- PT-025 and PT-026 for the cases that cannot be scripted yet — APR-018.

### Changed

- PT-024 set to In Progress; 54 cases remain Planned. The Change Password cases point to `tests/profile/ChangePassword.spec.ts`; the wording of TC-FORGOT-PASSWORD-009 and 015 matches the script — APR-018.
- `tests/forgot-password/ForgotPassword.spec.ts` runs its tests sequentially because they share the reset user's codes and password — APR-018.

## [1.7.0] - 2026-11-23

### Added

- Forgot Password and Reset Password module: `dom/forgot-password/forgot-password-recorded-flow.txt`, `pages/forgot-password/ForgotPasswordPage.ts`, `fixtures/forgot-password.fixture.ts`, `test-data/forgot-password/forgot-password-test-data.json` and `tests/forgot-password/ForgotPassword.spec.ts` (TC-FORGOT-PASSWORD-001 to 007, TC-RESET-PASSWORD-001 to 011) — APR-017.
- 47 test cases (TC-FORGOT-PASSWORD-001 to 020, TC-RESET-PASSWORD-001 to 027) in `test-cases.json`; 29 are Planned and tracked by PT-022 and PT-023; `test-cases.html` regenerated — APR-017.
- `utils/yopmail.ts` reads the verification code from the YOPmail inbox; reset user keys (`RESET_USER_*`, `YOPMAIL_URL`) added to the env files; `hasRoleCredentials` added to `config/roles/roles.ts` — APR-017.
- PT-019 to PT-024 for the reset user setup, YOPmail verification, DOM snapshot, unconfirmed behaviors and planned scripts — APR-017.

### Changed

- `utils/execution-history-reporter.ts` now matches hyphenated module IDs such as TC-CHANGE-PASSWORD-001 and TC-FORGOT-PASSWORD-001 — APR-017.
- `package.json` `testcases:html` runs `utils/generate-test-case-html.mts` again; the duplicate `utils/generate-test-case-html.js` and the DEBUG lines were removed (Node 26 runs `.mts` natively) — APR-017.

### Removed

- Temporary gap analysis files `GAP_ANALYSIS_20261123.md` and `COMPREHENSIVE_GAP_ANALYSIS_20261123.md` and the `scripts/` folder, at the user's request — APR-017.

## [1.6.0] - 2026-11-23

### Added

- Comprehensive test case gap analysis across all 6 modules (Login, Home, Dashboard, Logout, Profile+ChangePassword, Signup): 5 modules fully covered, 1 gap identified; the temporary analysis file was removed in 1.7.0 — APR-016.
- TC-SIGNUP-021: "To verify email duplicate detection (same email cannot be used twice)" for Signup Flow 11; added to `test-cases.json` and `Signup.spec.ts`; uses `invalidData.duplicateEmail` test data; tagged @High @Negative @Validation @Data — APR-016.
- Test case HTML generation was moved to a CommonJS `.js` copy in this release; reverted in 1.7.0.

### Changed

- `test-cases.json` now contains 130 test cases (1 new Signup test); `test-cases.html` regenerated with updated count — APR-016.

## [1.5.4] - 2026-11-20

### Added

- `AI-Conversation-History/2026/11/session-002.md` recording the 2026-11-19 initial setup session (APR-001 to APR-005); `conversation-index.md` and `AI-Conversation-History/README.md` updated — APR-015.

## [1.5.3] - 2026-11-20

### Changed

- ESLint `playwright/expect-expect` rule in `eslint.config.mjs` now recognizes page object methods named `expect*` as assertions, scoped to `tests/**/*.ts`; convention documented in `AI_RULEBOOK.md` Section 19 — APR-014.

## [1.5.2] - 2026-11-20

### Fixed

- TC-LOGIN-013 expected message corrected to "Please enter a valid email address" in `login-test-data.json` and `login-recorded-flow.txt`.

### Added

- TC-LOGIN-021 for the email-without-domain-extension toast ("Please enter valid email address.") in `test-cases.json` and `Login.spec.ts`; `test-cases.html` regenerated — APR-013.

## [1.5.1] - 2026-11-20

### Added

- `utils/execution-history-reporter.ts` custom Playwright reporter: updates `executionStatus`, `failureReason`, `skipReason` and `executionHistory` in `test-cases.json` after each run and regenerates `test-cases.html`; registered in `playwright.config.ts`.
- Colored Execution Status tags in `test-cases.html` (green Passed, red Failed, yellow Skipped, grey Not Run) — APR-012.

## [1.5.0] - 2026-11-20

### Added

- Login automation: `LoginPage`, `HomePage`, `login.fixture.ts`, `Login.spec.ts` (TC-LOGIN-001 to TC-LOGIN-020) and `login-test-data.json`; test cases marked Automated and `test-cases.html` regenerated — APR-011.

## [1.4.0] - 2026-11-20

### Added

- 20 Login test cases (TC-LOGIN-001 to TC-LOGIN-020) in `test-cases.json`; `test-cases.html` regenerated; pending tasks PT-013 to PT-017 for unconfirmed scenarios — APR-010.

## [1.3.2] - 2026-11-20

### Changed

- Exact wrong-password message "Incorrect password, please try again" recorded in `dom/login/login-recorded-flow.txt`; pending tasks PT-009 to PT-012 added — APR-009.

## [1.3.1] - 2026-11-20

### Changed

- `dom/login/login-recorded-flow.txt` updated with the valid email and incorrect password flow and toast — APR-008.

## [1.3.0] - 2026-11-20

### Added

- Login module DOM: `dom/login/login-dom.html` (unauthenticated snapshot) and `dom/login/login-recorded-flow.txt` (recorded flow, locators and messages; credentials excluded) — APR-007.

## [1.2.0] - 2026-11-20

### Changed

- Default environment is `dev` (`TEST_ENV`) and default browser is `chromium` (`BROWSER`) — APR-006.

## [1.1.1] - 2026-11-19

### Added

- `.vscode/extensions.json` recommending Playwright Test, ESLint, Prettier and DotENV — APR-005.

### Changed

- Pending tasks PT-001 to PT-008 recorded; README setup step lists `LOGIN_PATH` and `API_BASE_URL` — APR-003.

## [1.1.0] - 2026-11-19

### Added

- Dev environment values: `BASE_URL`, `LOGIN_PATH`, `API_BASE_URL` and account credentials (`USER_` prefix until the role is confirmed) — APR-002.
- `LOGIN_PATH` and `API_BASE_URL` loading and validation in the environment loader; keys added to `.env.example` and `.env.demo`.

## [1.0.0] - 2026-11-19

### Added

- Initial Playwright + TypeScript framework structure (POM) — APR-001.
- Governance files: `AI_RULEBOOK.md`, `PROJECT_CONTEXT.md`, `README.md`, `PENDING_TASKS.md`, `APPROVAL_HISTORY.md`, `CHANGELOG.md`.
- Environment configuration for dev and demo with validation (no default environment).
- Browser projects for Chromium, Firefox and WebKit.
- Role credential reader, IST timestamp utility, `auto` test data utility and base fixture.
- Timestamped HTML reporting (`AUTO-REPORT-YYYYMMDD-HHMMSS`, IST).
- Test case JSON source with status definitions and generated HTML view.
- ESLint and Prettier configuration.
