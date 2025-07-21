Here’s a step-by-step, atomic breakdown for recreating the UI in Nuxt using shadcn-vue, based on your plan and the standalone React component. This will guide the agent to incrementally scaffold the CircularIQ platform UI:

---

## 1. Project Setup

- Install Nuxt 4, Tailwind CSS v4, and shadcn-vue.
- Configure Tailwind and shadcn-vue according to the CircularIQ design system.

---

## 2. Layout & Branding

- Create a global layout (`/layouts/default.vue`) with:
  - Header using logo.png and "CircularIQ" branding.
  - Sidebar or tab navigation (shadcn-vue Tabs).
  - Main content area.

---

## 3. Pages Scaffold

For each tab in the React component, create a Nuxt page:

- `/pages/dashboard.vue`
- `/pages/products.vue`
- `/pages/reports.vue`
- `/pages/compliance.vue`
- `/pages/recommendations.vue`
- `/pages/upload.vue`
- `/pages/notifications.vue`
- `/pages/billing.vue` (Admin only)
- `/pages/team.vue` (Admin only)
- `/pages/settings.vue`

---

## 4. Component Extraction

Break down the React component into reusable Nuxt components under `/components/ui/`:

- `Header.vue` (logo, title, user actions)
- `Tabs.vue` (navigation)
- `KpiCard.vue` (metrics)
- `CompanySelector.vue`
- `ProductTable.vue`
- `ReportTable.vue`
- `ComplianceCard.vue`
- `RecommendationCard.vue`
- `UploadForm.vue`
- `NotificationPanel.vue`
- `BillingOverview.vue`
- `TeamList.vue`
- `SettingsForm.vue`
- `Dialog.vue` (shadcn-vue)
- `Badge.vue` (status, difficulty, role, billing status)

---

## 5. Composables

Move helper functions to Nuxt composables:

- `/composables/useBadgeColor.ts` (status, difficulty, role, billing status)
- `/composables/useCompanies.ts`
- `/composables/useProducts.ts`
- `/composables/useFootprintReports.ts`
- `/composables/useComplianceScores.ts`
- `/composables/useRecommendations.ts`
- `/composables/useBillingPlans.ts`
- `/composables/useTeam.ts`
- `/composables/useNotifications.ts`
- `/composables/useUploads.ts`

---

## 6. Data Source Support

- Implement a toggle or composable to switch between mock data (from React) and Supabase data.
- Use mock data for initial development, then connect composables to Supabase for production.

---

## 7. Atomic Migration Steps

**Step 1:**  
- Scaffold `/layouts/default.vue` with header and tab navigation.

**Step 2:**  
- Create `/pages/dashboard.vue` and add KPI cards, company selector, and charts using shadcn-vue components.

**Step 3:**  
- Create `/pages/products.vue` and add product table, dialogs for add/edit, and product catalog features.

**Step 4:**  
- Create `/pages/reports.vue` and add report table, summary cards, and export button.

**Step 5:**  
- Create `/pages/compliance.vue` and add compliance dashboard, cards, and flagged issues.

**Step 6:**  
- Create `/pages/recommendations.vue` and add AI-powered recommendations, cards, and details.

**Step 7:**  
- Create `/pages/upload.vue` and add upload form, file dropzone, and status.

**Step 8:**  
- Create `/pages/notifications.vue` and add notification panel, alerts, and preferences.

**Step 9:**  
- Create `/pages/billing.vue` and `/pages/team.vue` (Admin only), add billing overview, plan selection, team management.

**Step 10:**  
- Create `/pages/settings.vue` and add account, company, and notification settings.

---

## 8. UI Logic & Interactivity

- Use shadcn-vue for Tabs, Dialogs, Select, Table, Badge, Button, Card, etc.
- Port all badge/status/difficulty color logic to the `Badge.vue` component and `useBadgeColor.ts` composable.
- Ensure all user actions (add/edit/delete) use dialogs and forms from shadcn-vue.

---

## 9. Branding & Theming

- Update all branding to "CircularIQ".
- Use logo.png for the logo.
- Apply Tailwind v4 and CircularIQ color tokens.

---

## 10. Final Integration

- Connect all composables to Supabase for live data.
- Ensure authentication and access control via Supabase Auth.
- Test each page and component for modularity and reusability.

---

**Summary:**  
- Scaffold layout and pages incrementally.
- Extract and modularize components.
- Use shadcn-vue for UI.
- Port logic and helper functions to composables.
- Support both mock and Supabase data.
- Keep commits atomic and document each step.