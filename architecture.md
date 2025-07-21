# CircularIQ Platform Architecture and Product Plan

## 📓 Executive Summary

CircularIQ is a modular, AI-augmented sustainability intelligence platform designed to help African businesses — particularly SMEs — measure their plastic usage, comply with environmental regulations (such as Kenya’s EMCA and EPR laws), and adopt circular economy strategies. This document is the source-of-truth for agents and developers to autonomously scaffold, build, and iterate on the CircularIQ platform using Nuxt 4, Node.js, Supabase, and TailwindCSS v4.

Refer to [TailwindCSS v4 release notes](https://tailwindcss.com/blog/tailwindcss-v4) for up-to-date utility usage.

---

## ⚙️ AI Agent Development Mode (Overview)

To enable seamless integration and productivity with AI-based development agents:

* The platform uses **file-based routing** for all pages listed in the sitemap.
* Typed API services and Supabase-native schemas are required for backend and data layers.
* UI is componentized with TailwindCSS v4 utility classes and custom tokens via `@theme`.
* Architecture favors modularization and predictable project structure.
* Page layout images and design references are stored in `app/docs/ui/` (PNG for quick reference, PDF for detailed layout).
* UI prompt files for AI agents are stored in `/docs/ui-prompts/`.

> 🧠 Agents must prioritize maintainability, reusability, and step-by-step scaffolding, starting with onboarding, CSV upload parsing, and dashboards.

---

## 📊 Vision & Strategic Pillars

* **Empower African enterprises** to achieve environmental transparency and compliance.
* **Automate** the collection, tracking, and reporting of packaging and waste data.
* **Embed circular principles** into business processes for long-term resilience.
* **Bridge policy and technology** through localized, regulation-aware tooling.

---

## 🚀 Technology Stack Overview

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Frontend     | Nuxt 4, Composition API, Tailwind CSS v4, Pinia |
| Backend      | Node.js with Express.js                         |
| Database     | Supabase (PostgreSQL, Storage, Auth)            |
| File Uploads | Supabase Storage                                |
| Auth         | Supabase Auth (email magic link)                |
| Analytics    | Supabase Realtime, ApexCharts.js                |
| AI Features  | OpenAI API via backend integration              |
| Exports      | PDFKit, CSVKit (Node modules)                   |

---

## 🌈 Tailwind v4 Color Theme

Define the CircularIQ brand theme in `assets/css/main.css`:

```css
@import 'tailwindcss';

@theme {
  colors: {
    primary: #28A745;
    accent: #98FF98;
    forest: #14532D;
    background: #EFFBF0;
    surface: #F4F4F4;
    muted: #6B7280;
    success: #34D399;
    warning: #FBBF24;
    danger: #EF4444;
    info: #3B82F6;
  }
}
```

Use `bg-primary`, `text-accent`, etc. via native utility classes.

---

## 🗄️ Supabase Data Model Integration

The following tables are set up in Supabase and should be mapped directly to frontend modules, API endpoints, and business logic. Use Supabase's `supabase-js` client for all data operations.

| Table                | Usage/Module Mapping                                      |
|----------------------|----------------------------------------------------------|
| users                | Auth, profile, role assignment                           |
| companies            | Company onboarding, sector, region, compliance status    |
| user_companies       | Multi-tenant role support, company-user mapping          |
| products             | SKU management, material, recyclability, reuse           |
| uploads              | CSV/manual uploads, parse status, error summary          |
| footprint_reports    | Plastic mass, CO₂, monthly aggregation                   |
| compliance_scores    | Regulation matching, scoring, flagged issues             |
| recommendations      | AI-generated actions, cost, difficulty, confidence       |
| activity_logs        | Audit trail, user actions, meta                          |
| billing_plans        | Plan selection, limits, pricing                          |
| partners             | Directory, region/type, contact info                     |
| notifications        | Alerts, deadlines, compliance, read status               |

---

## 📑 Modular Architecture & Scaffolding Instructions

Each module should be scaffolded as a folder with:

* A page (`.vue`) for the route, matching the sitemap.
* Reusable UI components (cards, tables, forms) in `/components/ui/`.
* Composables for logic in `/composables/` (e.g., `useCompanies`, `useProducts`, `useUploads`) to encapsulate Supabase queries and mutations.
* Supabase calls via `supabase-js` in composables only.
* Reference corresponding layout images in `app/docs/ui/` for visual fidelity.
* Use `/docs/ui-prompts/` for AI prompt engineering and UI copy.

### Module Breakdown

#### 1. Onboarding
* Route: `/onboarding`
* Form: Name, Sector, RegNo, Country, Contact
* Choose regulation: EMCA/NEMA vs EU SUP
* Upload template (CSV/manual)
* Tables: `companies`, `user_companies`, `billing_plans`
* Reference: `app/docs/ui/onboarding.png`

#### 2. Data Upload & Validation
* Route: `/data`
* Table for SKU data (inline edit)
* CSV upload dropzone
* Realtime validation logic (warnings, errors)
* Tables: `uploads`, `products`
* Reference: `app/docs/ui/data-collection.png`

#### 3. Plastic Footprint Calculator
* Route: `/reports`
* Total plastic mass, recyclable %, CO₂ conversion
* Monthly aggregation per company
* Tables: `footprint_reports`, `products`
* Reference: `app/docs/ui/reports.png`

#### 4. Compliance Engine
* Route: `/compliance`
* Match SKUs to regulations
* Score: `(recyclability_pct * 0.4) + (recycled_pct * 0.3) + (reuse_pct * 0.2) + (regulatory * 0.1)`
* Flagged SKUs, recommendation badge
* Tables: `compliance_scores`, `products`, `recommendations`
* Reference: `app/docs/ui/compliance.png`

#### 5. Dashboards & Export
* Route: `/dashboard`
* KPI cards, ApexCharts, trend filters
* Export as PDF/CSV
* Tables: `companies`, `footprint_reports`, `compliance_scores`
* Reference: `app/docs/ui/dashboard-home.png`

#### 6. AI Recommendations (Phase 2)
* Smart action generator using OpenAI
* Input: product profile, compliance flags
* Output: budget, ROI, action difficulty
* Table: `recommendations`
* Reference: `/docs/ui-prompts/ai-recommendation.txt`

#### 7. Partner Directory
* Route: `/partners`
* Filterable list by region/type
* Contact CTA (email/WhatsApp)
* Table: `partners`
* Reference: `app/docs/ui/partners.png`

#### 8. Multi-tenant Role Support
* Routes: `/team`, `/settings`
* Roles: Admin, Analyst, Viewer
* Invite by email, role selector
* Tables: `user_companies`, `users`
* Reference: `app/docs/ui/team-management.png`, `app/docs/ui/account-security.png`

#### 9. Notifications & Activity Logs
* Route: `/dashboard/settings/notifications`
* Alerts, reminders, compliance, read/unread
* Table: `notifications`
* Reference: `app/docs/ui/notification-settings.png`
* Activity logs for audit: `activity_logs`

#### 10. Billing & Plans
* Route: `/dashboard/settings/billing`
* Plan selection, limits, pricing
* Table: `billing_plans`

---

## 🔧 Backend Services (Node.js)

**API Routes:**

* `POST /api/calculate-footprint`
* `GET /api/compliance-check/:companyId`
* `POST /api/generate-recommendation`
* `GET /api/reports/pdf`

**Background Jobs:**

* `validate-upload.ts`
* `recalculate-compliance.ts`
* `notify-deadlines.ts`

**Agent Helpers:**

* `utils/parseCSV.js`
* `utils/scoreCompliance.js`
* `utils/pdfGen.js`

---

## 👥 User Roles

| Role    | Permissions                                  |
| ------- | -------------------------------------------- |
| Admin   | Full access incl. billing, settings, invites |
| Analyst | Uploads, calculations, editing, export       |
| Viewer  | View dashboards, reports only                |

Roles are managed via `user_companies` and `users` tables.

---

## 📂 Sitemap

| Page       | Route                                       | UI Reference                        |
| ---------- | ------------------------------------------- | ----------------------------------- |
| Home       | `/`                                         | `app/docs/ui/home.png`              |
| Features   | `/features`                                 | `app/docs/ui/features.png`          |
| Pricing    | `/pricing`                                  | `app/docs/ui/pricing.png`           |
| Signup     | `/signup`                                   | `app/docs/ui/signup.png`            |
| About      | `/about`                                    | `app/docs/ui/about.png`             |
| Contact    | `/contact`                                  | `app/docs/ui/contact.png`           |
| Login      | `/login`                                    | `app/docs/ui/login.png`             |
| Resources  | `/resources`                                |                                     |
| Blog       | `/blog`                                     |                                     |
| Onboarding | `/onboarding`                               | `app/docs/ui/onboarding.png`        |
| Dashboard  | `/dashboard`                                | `app/docs/ui/dashboard-home.png`    |
| Data       | `/dashboard/data-collection`                | `app/docs/ui/data-collection.png`   |
| Reports    | `/dashboard/reports`                        | `app/docs/ui/reports.png`           |
| Compliance | `/dashboard/compliance`                     | `app/docs/ui/compliance.png`        |
| Settings   | `/dashboard/settings`                       | `app/docs/ui/profile-settings.png`  |
| Team       | `/dashboard/settings/team-management`       | `app/docs/ui/team-management.png`   |
| Account    | `/dashboard/settings/account`               | `app/docs/ui/account-security.png`  |
| Company    | `/dashboard/settings/company`               | `app/docs/ui/company-info.png`      |
| Notifications | `/dashboard/settings/notifications`      | `app/docs/ui/notification-settings.png` |
| Billing    | `/dashboard/settings/billing`               |                                     |
| Partners   | `/partners`                                 | `app/docs/ui/partners.png`          |

---

## 💻 AI Development Guidelines

1. Use file-based routing for all pages in the sitemap.
2. Generate `.vue` files in `/pages/` for each route.
3. Create composables (e.g., `useCompanies`, `useProducts`, `useUploads`) in `/composables/` for each table.
4. Build UI components in `/components/ui/` (Card, Button, Badge, Table, Form).
5. Use Tailwind classes with `@theme` tokens (`bg-primary`, etc.).
6. Call Supabase client from composables only (for separation of concerns).
7. Render data in tables using reactive state (`ref([])` + `watchEffect`).
8. For OpenAI, define API route `/api/recommendations` and feed JSON payload.
9. Use `/docs/ui-prompts/*.txt` for Stitch prompts and UI copy, and `app/docs/ui/*.png`/`*.pdf` for design references.
10. Scaffold modules to match table structure and relationships.
11. Enforce access control via Supabase Auth and RLS.
12. Keep UI in sync with schema: update forms/tables as schema evolves.
13. Document composables and API endpoints for each table.
14. Use incremental commits: `feat: add products composable`, `feat: dashboard charts`.
15. Always cross-reference UI assets for layout and visual consistency.

---

## 📈 Revenue Model (Y1 Projection)

| Plan       | Clients                          | MRR (KES) | Growth Rate |
| ---------- | -------------------------------- | --------- | ----------- |
| Starter    | 10                               | 3,500     | 15%         |
| Pro        | 5                                | 15,000    | 20%         |
| Enterprise | 2                                | 60,000    | 25%         |
| Onboarding | 30,000 avg per client (one-time) |           |             |

→ **Projected Revenue:** KES 12M–15M

---

## ✅ Summary

CircularIQ is built to empower sustainable innovation in Africa. With clear architecture, typed schema, and UI specifications, an AI agent or developer can efficiently scaffold and extend the entire stack with minimal human intervention.

> This doc is the source-of-truth for autonomous platform development across frontend, backend, and data layers. Always reference UI assets and prompts for each module, and follow modular, maintainable, and incremental