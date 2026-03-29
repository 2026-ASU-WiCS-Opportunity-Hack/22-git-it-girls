# CareTrack — Nonprofit Client & Case Management

> Built by **Team "Git It Girls"** for the [OHack 2026 Spring WiCS Hackathon](https://www.ohack.dev/hack/2026_spring_wics_asu)

## Quick Links
- [Hackathon Details](https://www.ohack.dev/hack/2026_spring_wics_asu)
- [DevPost Submission](https://wics-ohack-sp26-hackathon.devpost.com/)
- [Team Slack Channel](https://opportunity-hack.slack.com/app_redirect?channel=team-22-git-it-girls)
- [Demo Video](#) *(add link)*
- [Live App](#) *(add link)*

---

## Team

| Name | GitHub |
|------|--------|
| Ananya Arora | — |
| Manya Mehta | — |
| Anushka Tiwari | — |

---

## Problem Statement

Nonprofits like NMTSA, Chandler CARE Center, and ICM Food & Clothing Bank manage hundreds of client interactions every week — but most still rely on spreadsheets, paper intake forms, and disconnected tools. This creates data gaps, makes reporting painful, and limits staff's ability to deliver consistent care.

**CareTrack** replaces that friction with a structured, affordable web platform that any nonprofit can deploy for under $30/month.

---

## What It Does

CareTrack is a lightweight, open-source client and case management platform built specifically for nonprofits. It centralizes everything — client records, service logs, appointments, and outcomes — in one place.

### Key Features

| Feature | Description |
|---------|-------------|
| **Client Management** | Register clients with configurable demographic fields tailored to each org |
| **Service Logging** | Log visits, service types, notes, and follow-up actions with a full chronological history |
| **Scheduling** | Create and track appointments; update statuses (scheduled, completed, cancelled) |
| **Role-Based Access** | Admin and Staff roles with row-level security enforced at the database layer |
| **AI Photo-to-Intake** | Snap a photo of a paper intake form — Claude automatically fills the client record |
| **AI Semantic Search** | Query clients in plain English ("find clients needing housing support") |
| **AI Case Summaries** | One-click AI-generated summaries of a client's service history |
| **Reporting Dashboard** | Charts for service distribution, monthly trends, and language demographics |
| **CSV Import/Export** | Migrate data in from spreadsheets; export any time |
| **Audit Log** | Every action is logged for compliance and transparency |

---

## Tech Stack

**Frontend**
- [Next.js](https://nextjs.org/) (App Router) + React 19
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Radix UI](https://www.radix-ui.com/) (accessible component primitives)
- [Recharts](https://recharts.org/) (data visualization)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (forms & validation)

**Backend**
- Next.js Server Actions & API Routes
- [Supabase](https://supabase.com/) (PostgreSQL + Row-Level Security + Auth)

**AI**
- [Anthropic Claude API](https://www.anthropic.com/) — photo OCR intake, case summaries, semantic search

**Other**
- [PapaParse](https://www.papaparse.com/) (CSV parsing)
- TypeScript throughout

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com/) project
- An [Anthropic API key](https://console.anthropic.com/) (for AI features)

### 1. Clone & install

```bash
git clone https://github.com/2026-ASU-WiCS-Opportunity-Hack/22-git-it-girls.git
cd 22-git-it-girls
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Set up the database

In your Supabase project's SQL editor, run the migration files in order:

1. `supabase/migrations/001_initial_schema.sql` — core tables
2. `supabase/migrations/002_field_definitions.sql` — custom field support

Optionally seed demo data:

```
supabase/seed.sql
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
├── (auth)/login/           # Authentication
├── (dashboard)/
│   ├── admin/              # User management, custom fields, audit log
│   ├── clients/            # Client list, profiles, new/edit
│   ├── schedule/           # Appointments
│   ├── services/           # Service logging
│   └── reports/            # Analytics dashboard
├── actions/                # Server actions (clients, services, AI, admin...)
└── api/                    # REST endpoints (OAuth callback, photo intake, CSV export)
components/
├── clients/                # ClientForm, AiSearchBar, PhotoIntakeWidget, etc.
├── schedule/               # Appointment status and forms
├── reports/                # Chart components
└── ui/                     # Shared Radix-based primitives
supabase/
├── migrations/             # SQL schema migrations
└── seed.sql                # Demo data
```

---

## Deployment

CareTrack is designed to deploy on [Vercel](https://vercel.com/) with zero config — just connect your repo and add the environment variables. Estimated running cost is under **$30/month** (Supabase free tier + Claude API pay-as-you-go).

---

## License

[MIT](LICENSE)
