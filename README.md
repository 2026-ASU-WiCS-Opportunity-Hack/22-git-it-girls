# 2026_spring_wics_asu Hackathon Project

## Quick Links
- [Hackathon Details](https://www.ohack.dev/hack/2026_spring_wics_asu)
- [DevPost Submission](https://wics-ohack-sp26-hackathon.devpost.com/)
- [Team Slack Channel](https://opportunity-hack.slack.com/app_redirect?channel=team-22-git-it-girls)

## Team "Git It Girls"
- Ananya Arora
- Manya Mehta
- Anushka Tiwari

## Project Overview
**CareTrack** is a lightweight, open-source client and case management platform built for nonprofits. It replaces spreadsheets and paper forms with a structured web app that handles client registration, service/visit logging, scheduling, and reporting — deployable for under $30/month.

Built for the [OHack 2026 Spring WiCS Hackathon](https://www.ohack.dev/hack/2026_spring_wics_asu), serving nonprofits like NMTSA, Chandler CARE Center, ICM Food & Clothing Bank, and more.

**Key features:**
- Client registration with configurable demographic fields
- Service & visit logging with chronological history
- Role-based access (Admin vs Staff)
- AI-powered photo-to-intake (snap a paper form → auto-fill client record)
- Semantic search across case notes using natural language
- CSV import/export for migrating from spreadsheets
- Reporting dashboard with charts

## Tech Stack
- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js API routes
- Database: Supabase (PostgreSQL) with RLS
- APIs: Anthropic Claude API
<!-- Add/modify as needed -->


## Getting Started
clone this repo
```bash
npm install
```

Copy the environment variables template:
```bash
cp .env.example .env.local
```

Fill in `.env.local` with your keys:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_key
```

Run the database schema and  data in your Supabase SQL editor:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/seed.sql`

Run locally:
```bash
npm run dev
```


## Checklist for the final submission
### 0/Judging Criteria
- [ ] Review the [judging criteria](https://www.ohack.dev/about/judges#judging-criteria) to understand how your project will be evaluated

### 1/DevPost
- [ ] Submit a [DevPost project to this DevPost page for our hackathon](https://wics-ohack-sp26-hackathon.devpost.com/) - see our [YouTube Walkthrough](https://youtu.be/rsAAd7LXMDE) or a more general one from DevPost [here](https://www.youtube.com/watch?v=vCa7QFFthfU)
- [ ] Your DevPost final submission demo video should be 4 minutes or less
- [ ] Link your team to your DevPost project on ohack.dev in [your team dashboard](https://www.ohack.dev/hack/2026_spring_wics_asu/manageteam)
- [ ] Link your GitHub repo to your DevPost project on the DevPost submission form under "Try it out" links

### 2/GitHub
- [ ] Add everyone on your team to your GitHub repo [YouTube Walkthrough](https://youtu.be/kHs0jOewVKI)
- [ ] Make sure your repo is public
- [ ] Make sure your repo has a MIT License
- [ ] Make sure your repo has a detailed README.md (see below for details)


# What should your final README look like?
Your readme should be a one-stop-shop for the judges to understand your project. It should include:
- Team name
- Team members
- Slack channel
- Problem statement
- Tech stack
- Link to your working project on the web so judges can try it out
- Link to your DevPost project
- Link to your final demo video
- Instructions on how to run your project
- Any other relevant links (e.g. Figma, GitHub repos for any open source libraries you used, etc.)


You'll use this repo as your resume in the future, so make it shine! 🌟

# Examples
Examples of stellar readmes:
- ✨ [2019 Team 3](https://github.com/2019-Arizona-Opportunity-Hack/Team-3)
- ✨ [2019 Team 6](https://github.com/2019-Arizona-Opportunity-Hack/Team-6)
- ✨ [2020 Team 2](https://github.com/2020-opportunity-hack/Team-02)
- ✨ [2020 Team 4](https://github.com/2020-opportunity-hack/Team-04)
- ✨ [2020 Team 8](https://github.com/2020-opportunity-hack/Team-08)
- ✨ [2020 Team 12](https://github.com/2020-opportunity-hack/Team-12)

Examples of winning DevPost submissions:
- [1st place 2024](https://devpost.com/software/nature-s-edge-wildlife-and-reptile-rescue)
- [2nd place 2024](https://devpost.com/software/team13-kidcoda-steam)
- [1st place 2023](https://devpost.com/software/preservation-partners-search-engine)
- [1st place 2019](https://devpost.com/software/zuri-s-dashboard)
- [1st place 2018](https://devpost.com/software/matthews-crossing-data-manager-oj4ica)
