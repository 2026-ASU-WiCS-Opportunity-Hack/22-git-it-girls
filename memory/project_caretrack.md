---
name: CareTrack Project State
description: OHack hackathon nonprofit case management app — current build status and architecture decisions
type: project
---

CareTrack is a Next.js 16 app for nonprofit client/case management. Built for OHack hackathon by team Git It Girls.

**Why:** Nonprofits (NMTSA, Chandler CARE Center, ICM Food Bank, Will2Walk, etc.) all need the same thing: register clients, log services, report outcomes. Enterprise tools cost $50-150/user/month. This targets under $30/month.

**Stack:** Next.js 16.2.1, Supabase (auth + DB), shadcn/ui, Tailwind, Anthropic SDK (AI features coming)

**Key Next.js 16 breaking changes to remember:**
- `middleware.ts` → deprecated, use `proxy.ts` (but can't have both — currently using middleware.ts with deprecation warning)
- `params` in dynamic routes is now a Promise: `const { id } = await params`
- `searchParams` in pages is also a Promise: `const { q } = await searchParams`
- Cache revalidation: use `revalidatePath` from `next/cache` after mutations

**Architecture:**
- Server Components for all data reads (direct Supabase calls)
- Server Actions (`app/actions/`) for mutations with `'use server'` directive
- Client Components only for interactive forms (`useActionState` for pending/error state)
- Route groups: `(auth)` for login, `(dashboard)` for all protected pages
- Dashboard is at `/dashboard` (not `/`) to avoid route conflict with root `app/page.tsx`

**What's built (Phases 1–3):**
- Auth: Google SSO + email/password + magic link ✓
- DB schema: profiles, clients, service_entries, appointments, follow_ups, audit_log + pgvector ✓
- Seed data: 12 clients (food bank, therapy, housing, youth, animal rescue) + 35 service entries ✓
- Dashboard home with stat cards ✓
- Client list with search (URL searchParams) + Export CSV + Import CSV buttons ✓
- Client registration form ✓
- Client profile view (demographics + service history timeline) ✓
- Client edit page ✓
- Service log form ✓
- Services list ✓
- Reports dashboard at /reports: services by type (bar), monthly trend (line), language distribution (bar) ✓
- CSV export API at GET /api/clients/export ✓
- CSV import page at /clients/import (papaparse preview + bulk insert) ✓
- Configurable Fields admin UI at /admin/fields (add/delete field_definitions) ✓
- Migration 002_field_definitions.sql: field_definitions table (label, field_key, field_type, is_required, sort_order) ✓
- ClientForm renders custom fields dynamically; createClientAction + updateClientAction persist them to custom_fields JSONB ✓

**Phase 4 AI (built):**
- Photo-to-Intake: POST /api/ai/photo-intake (Claude Vision) + PhotoIntakeWidget on /clients/new → extracts fields → pre-fills via searchParams ✓
- AI Client Summary: generateClientSummaryAction server action + AiSummaryWidget button on client profile ✓
- AI-Powered Search: AiSearchBar component with AI toggle button on /clients; aiSearchClientsAction uses claude-haiku to parse NL query → structured Supabase filters (name, service_type, language) ✓
- Multilingual UI EN/ES: translations.ts static dict, I18nProvider context (cookie-persisted), LanguageSwitcher in sidebar, Sidebar nav labels translated ✓

**Still to build:**
- Phase 5: Mobile responsiveness, Vercel deploy

**AI setup:** ANTHROPIC_API_KEY must be set in .env.local for all AI features to work. All AI features show a graceful error if key is missing.

**How to apply:** Reference when continuing work on this project. Always await params/searchParams. Always check node_modules/next/dist/docs/ before writing Next.js-specific code.
