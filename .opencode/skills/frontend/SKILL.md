---
name: frontend
description: Frontend conventions, patterns, and architecture for Nadine Courses bilingual course-selling platform
---

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS v4 (CSS-based config, `@theme` in `src/index.css`)
- React Router v6 (SPA, no SSR)
- React Query (TanStack Query) for server state
- React Hook Form + Zod v4 for form validation
- Supabase (Postgres + Edge Functions + Auth)
- i18n: custom context-based (NOT i18next), `src/i18n/`

## Project Structure
```
src/
  components/    → Reusable UI components (Navbar, Footer, CourseCard, ConfirmModal)
  hooks/         → Custom hooks (useGeo, useCourses, useExchangeRates, useSiteContent, useAuth)
  i18n/          → Language context + translations (Arabic/English)
  lib/           → Utilities (supabase client, functions API, pricing, geo, currencyMap)
  pages/         → Route pages (Home, CourseDetails, CheckoutSuccess, CheckoutFailed)
  pages/admin/   → Admin pages (Dashboard, Orders, Courses, Content, Login)
```

## Design System
- **Colors**: Olive green palette (`olive-50` to `olive-900`), paper bg `#FBF8EF`, sticky-note yellow `#F5E960`
- **Fonts**: Plus Jakarta Sans (headings), Inter (body), Caveat (handwritten notes)
- **Components**:
  - `btn-primary`: Solid olive-800, rounded-xl, layered shadow, active:scale-[0.97]
  - `card` / `card-elevated`: White bg, rounded-2xl/3xl, layered shadow
  - `input-field`: Rounded-xl, border, focus ring, transition
  - `sticky-note`: Handwritten style with rotation variants
  - Glass: `backdrop-blur(20px) saturate(180%)` for navbar
- **RTL/LTR**: Toggle via `document.documentElement.dir` in LangProvider

## i18n System
- `useLang()` → returns `{ lang, setLang, t }` where `t(key)` looks up from `src/i18n/translations.ts`
- `useSC()` → dynamic content from `site_content` DB table. `tr(section, field)` for translated text, `arr(section)` for arrays, `get(section)` for full object
- Customer-facing content is in the database, admin labels are in translations.ts
- Language persists via cookies, auto-detects browser language

## Data Fetching
- React Query for all server state
- `useCourses()` → active courses only
- `useAllCourses()` → all courses (admin)
- `useCourseBySlug(slug)` → single course
- `useSiteContent()` → all `site_content` rows
- `useExchangeRates()` → live USD rates from `open.er-api.com`, cached 1hr in localStorage
- `useFAQ()` → FAQ items from site_content
- Admin functions: `fetchAdminOrders`, `adminUpdateOrder`, `fetchAdminStats`, `createCourse`, `updateCourse`, `deleteCourse`

## Pricing
- `getDisplayPrice(course, countryCode, rates)` → `{ amount, currency, isEgypt }`
- `formatPrice(amount, currency)` → localized string via `Intl.NumberFormat`
- Egypt: shows EGP from `egypt_price`
- International: converts `international_price_usd` using live exchange rates
- Payment: always EGP through Paymob (fixed 50 EGP/$1 conversion on backend)

## Forms
- React Hook Form + Zod v4 for validation
- Validation messages are descriptive (e.g., "Name must be at least 2 characters")
- Phone: accepts international format (`+20 100 000 0000`, `+1 555 123 4567`)

## Admin Panel
- Auth-gated via `AdminLayout` component (Supabase Auth)
- Login: email/password only
- Dashboard: stats cards + Vercel Analytics link
- Orders: table (desktop) + cards (mobile), archive/restore/permanent-delete with ConfirmModal
- Courses: CRUD with inline editing, create form expands inline
- Content: section-by-section editor for all `site_content` entries

## Modals
- Use `<ConfirmModal>` component (NOT browser `confirm()`)
- Props: `open`, `onClose`, `onConfirm`, `title`, `message`, `variant` (danger/warning/info), `loading`
- Has backdrop blur, keyboard Escape support, responsive

## Code Conventions
- Path aliases: `@/` maps to `src/`
- Named exports for components, default exports for pages
- Lazy loading for all page components via `React.lazy()`
- No comments in code unless asked
- Use `type` not `interface` for new type definitions (except existing patterns)
- Lucide React for icons (no other icon libraries)
- CSS classes follow Tailwind utility pattern, custom classes defined in `src/index.css`
