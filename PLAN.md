# خطة التنفيذ — منصة الخط الزمني التفاعلي للحملة (HRDF Campaign Roadmap Portal)

> **Implementation Plan v3 — Detailed Build Specification**
> Interactive client-facing roadmap portal between the agency (**Seet Marketing Solutions**) and the client (**صندوق تنمية الموارد البشرية — هدف**).
> Agency = `admin` role. HRDF = `client` role.
> This document is the single source of truth for the AI/developer that builds the app. Everything needed to build without further questions is here.

---

## 0. Decisions Locked (from client)

| Topic | Decision |
|---|---|
| Status updates | **Manual** — admin flips a deliverable's status by hand. No auto-compute from dates. |
| **Email notifications** | **❌ Removed.** No emails are sent. (No Resend, no recipient list.) |
| Mobile | **Mobile-first**, fully responsive and touch-optimized. |
| Language | **Arabic only.** Full RTL. No i18n/English toggle. |
| Roles | Two roles: **admin** (Seet) and **client** (HRDF). |
| Login | **Standard email + password.** No public sign-up, no invite/magic links. Admin creates each account with a password. |
| Hosting | **Netlify** (auto-generates a `*.netlify.app` domain on project creation; custom domain optional). Deploy via **GitHub → Netlify** auto-build. |
| Drive links | Admin pastes normal Google Drive links, set to **public ("anyone with the link can view")**. |
| Brand colors | **Sampled from the HRDF logo** (blue-dominant). Design must look strongly on-brand. |
| Milestone structure | The **3 items = the 3 workstreams** from the official timeline PDF (see §6.5). Each item holds its own deliverables. |
| Deliverables | **8 total.** "إطلاق الحملة الإعلانية" is **excluded** (per client). |
| Header "next" card | Shows the **next upcoming key date** (deliverable due / approval gate), since milestones run in parallel. |

---

## ⚙️ SETUP REQUIREMENTS — What I Need From You / What to Connect

> **Read this first.** I (the builder) write **100% of the code, database schema, and styling**. What I *can't* do is create accounts under your name/billing or invent secrets I don't have. With email removed, the setup is now very light — essentially just **Supabase + GitHub + Netlify**, all free.
>
> Nothing here blocks me from starting — I scaffold against local placeholders and you plug real values in before launch. But to **go live**, the ✅ items below must be filled.

### A. Accounts / services to connect

| # | Service | What it does | Cost | Who does it | What to hand me |
|---|---------|--------------|------|-------------|-----------------|
| 1 | **Supabase** | Database + login (auth) + security rules | **$0** | You create the project (it's your data) **or** invite me | Project URL, `anon` key, `service_role` key — *or* invite `ahmorsy07@gmail.com` to the project |
| 2 | **GitHub** | Stores the code; Netlify auto-deploys from it | **$0** | You (you said it's already connected) | A repo (private is fine) — add me as collaborator, **or** connect the GitHub MCP so I can push directly *(it's not connected yet — see note below)* |
| 3 | **Netlify** | Hosts the live site, auto-builds on each GitHub push | **$0** | You link the GitHub repo → Netlify | Nothing extra; it auto-creates the `*.netlify.app` URL. Custom domain optional. |

> 📌 **GitHub MCP isn't connected in this session.** When we reach the "push the code" step, either (a) connect the GitHub MCP, (b) I use the `gh` CLI if it's installed/authed on your machine, or (c) you create the repo and add me. Any of the three works.

> 📌 **Netlify + Next.js:** Netlify runs Next.js natively via its official Next runtime adapter (`@netlify/plugin-nextjs`) — server rendering, middleware (auth gate), and server actions all work. I'll add the config so the GitHub→Netlify build is one-click.

### B. Content & brand assets to give me

- [ ] **HRDF logo file** — official SVG (preferred) or high-res PNG. I'll **sample the exact blue hex from it** and build the palette around it.
- [ ] **Seet Marketing Solutions logo** *(optional)* — for a small "by Seet" footer credit.
- [ ] **Brand font** *(optional)* — from the HRDF brand guide v3.0. If not provided, I default to **IBM Plex Sans Arabic** and you approve.
- [ ] **Confirm the deliverables** — I have **8** (per your list from the timeline PDF). See the ⚠️ launch question in §6.5.

### C. People & access (the login accounts to create)

Standard email + password, created by admin. Per-person accounts (not one shared login) so the audit trail is accurate.

- [ ] **Admin users — Seet team:** name + email + a starting password for each. *(You said you'll send the admin emails.)*
- [ ] **Client users — HRDF team:** name + email + a starting password for each.

```
ADMINS (Seet):
  - <name> | <email> | <temp password>

CLIENTS (HRDF):
  - <name> | <email> | <temp password>
```

### D. The single bundle to send me when ready

```
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
# (or: "invited ahmorsy07@gmail.com to the project")

# Hosting
GitHub repo URL (or "make one for me" / "I'll connect the MCP"):
Custom domain (or "just use the netlify.app one"):

# People
Admin users (name, email, temp password):
Client users (name, email, temp password):

# Brand
HRDF logo file: (attach)
Seet logo file: (attach, optional)
Brand font: (or "use IBM Plex Sans Arabic")

# Confirm
Include "إطلاق الحملة الإعلانية" as a 9th deliverable? yes / no
```

### E. Prerequisites for running locally (FYI — only if *you* run it)

- **Node.js 18+** and **npm** — not required if I build + deploy for you.
- Everything else is cloud. **Total monthly cost: $0** (Supabase free + GitHub free + Netlify free). Only optional cost is a custom domain.

---

## 1. Executive Summary

A single-page (plus a login page) Arabic RTL web portal that visualizes the HRDF creative campaign as a live, interactive timeline. HRDF logs in to watch progress; Seet logs in to update it (flip statuses, attach public Google Drive links). No emails — the client just sees the latest state on refresh.

**Three sections on the main page:**
1. **Header** — project title, client name + HRDF logo, and four live summary cards.
2. **Timeline (Gantt)** — horizontally scrollable month-by-month timeline (يونيو → ديسمبر 2026) with deliverable bars in **3 milestone lanes** and client-approval diamond markers.
3. **Milestones & Deliverables** — the **3 milestone cards**; each expands to its deliverables with status dots and (when set) clickable Drive links.

---

## 2. Goals & Non-Goals

### Goals
- A premium, strongly on-brand (HRDF blue) Arabic RTL experience.
- Dead-simple for the client: log in, read, scroll, click a link.
- Admin can update status + links in seconds; client sees it on refresh.
- Secure: only authenticated users see data; only admins can edit.
- Fast and comfortable on a phone.

### Non-Goals (v1)
- ❌ No email/notifications of any kind.
- No public sign-up. No password-reset/invite flow in v1 (admin sets passwords).
- No multi-project (one campaign). No in-app file storage (Drive links only).
- No English. No comments/approvals-in-app. No realtime sockets (refresh is fine).

---

## 3. Personas & Roles

| Persona | Role | Can see | Can do |
|---|---|---|---|
| HRDF stakeholder | `client` | Header, timeline, all milestones & deliverables, statuses, Drive links | Read-only. Click links. |
| Seet PM | `admin` | Everything + inline edit controls | Flip status, add/edit/remove Drive links |

Role lives on the user profile. UI shows edit affordances only when `role === 'admin'`; the **database enforces the same via RLS** (never trust the client).

---

## 4. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router) + TypeScript** | SSR auth-gating, server actions for edits, clean Netlify deploy. |
| Styling | **Tailwind CSS** | Fast, consistent, easy RTL via logical properties. |
| UI primitives | **shadcn/ui** (Radix) | Accessible accordion/dialog/select, easy to theme to HRDF blue. |
| DB + Auth | **Supabase** (Postgres + Auth + RLS) | One service for data, email/password login, and authorization. |
| Date math | **date-fns** | Lightweight; powers the Gantt offsets + countdown. |
| Icons | **lucide-react** | Clean, matches shadcn. |
| Font | **IBM Plex Sans Arabic** via `next/font` | Clean Arabic; swap to brand font if provided. |
| Hosting | **Netlify** (+ `@netlify/plugin-nextjs`) | Auto-deploy from GitHub; native Next.js support. |
| Testing | **Vitest** (date logic) + **Playwright** (login + admin flow) | Cover the risky math and the critical path. |

> ✅ **Removed vs. v2:** Resend, React Email, `notification_recipients`, all email env vars and server-action email triggers — email is out of scope.

---

## 5. System Architecture

```
                ┌─────────────────────────────────────────┐
   Browser ───► │              Netlify (Next.js)           │
   (RTL, AR)    │  ── Middleware (auth gate)               │
                │  ── /login   (public)                    │
                │  ── /        (client + admin view, SSR)  │
                │  ── Server Actions (admin mutations)     │
                └───────────────────┬──────────────────────┘
                                    │
                          ┌─────────▼─────────┐
                          │     Supabase       │
                          │  Postgres + Auth   │
                          │      + RLS         │
                          └────────────────────┘
```

- **Client read:** Browser → middleware checks Supabase session → SSR fetches data under the user's session (RLS-scoped) → render → client scrolls/expands.
- **Admin write:** Admin edits → **Server Action** (re-checks admin) → Postgres update (RLS allows) → `revalidatePath('/')` → client sees it on next load/refresh.

---

## 6. Data Model

### 6.1 Entities
- **profiles** — one per auth user; `role` + display name.
- **milestones** — the **3 items** (Creative / Influencers / Paid).
- **deliverables** — the work items; each belongs to one milestone; holds status + Drive link.
- **approval_gates** — the "اعتماد الصندوق" diamonds on the timeline.
- **activity_log** *(optional)* — audit trail for a "آخر تحديث" label.

### 6.2 Enums
```sql
create type deliverable_status as enum (
  'not_started',       -- لم تبدأ
  'in_progress',       -- قيد التنفيذ
  'awaiting_approval', -- بانتظار اعتماد الصندوق
  'done'               -- مكتملة / معتمدة
);
create type user_role as enum ('admin', 'client');
```

### 6.3 Tables (DDL)
```sql
-- profiles (1:1 with auth.users)
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       user_role not null default 'client',
  created_at timestamptz not null default now()
);

-- milestones (the 3 items; also the 3 Gantt lanes)
create table public.milestones (
  id          uuid primary key default gen_random_uuid(),
  order_index int  not null,            -- 1,2,3 display order
  title_ar    text not null,
  subtitle_ar text,
  color       text not null             -- lane / accent color
);

-- deliverables
create table public.deliverables (
  id           uuid primary key default gen_random_uuid(),
  milestone_id uuid not null references public.milestones(id) on delete restrict,
  order_index  int  not null,
  title_ar     text not null,
  start_date   date not null,
  end_date     date not null,
  status       deliverable_status not null default 'not_started',
  drive_url    text,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references public.profiles(id),
  constraint valid_dates check (end_date >= start_date),
  constraint valid_drive_url check (drive_url is null or drive_url ~* '^https?://')
);

-- approval gates (timeline diamonds)
create table public.approval_gates (
  id           uuid primary key default gen_random_uuid(),
  label_ar     text not null default 'اعتماد الصندوق',
  gate_date    date not null,
  milestone_id uuid references public.milestones(id) on delete set null
);

-- activity log (optional)
create table public.activity_log (
  id             bigint generated always as identity primary key,
  deliverable_id uuid references public.deliverables(id) on delete cascade,
  actor_id       uuid references public.profiles(id),
  action         text not null,        -- 'status_change' | 'link_set'
  old_value      text,
  new_value      text,
  created_at     timestamptz not null default now()
);
```

### 6.4 Row Level Security
```sql
alter table public.profiles       enable row level security;
alter table public.milestones     enable row level security;
alter table public.deliverables   enable row level security;
alter table public.approval_gates enable row level security;
alter table public.activity_log   enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- READ: any authenticated user
create policy "read_milestones"   on public.milestones     for select to authenticated using (true);
create policy "read_deliverables" on public.deliverables   for select to authenticated using (true);
create policy "read_gates"        on public.approval_gates for select to authenticated using (true);
create policy "read_own_profile"  on public.profiles       for select to authenticated using (id = auth.uid() or public.is_admin());

-- WRITE: admins only (deliverables)
create policy "admin_update_deliverables" on public.deliverables
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
```

### 6.5 Seed Data — the REAL campaign (from the official timeline PDF)

> **Source of truth:** `تايم لاين هدف.pdf` (Seet's official HRDF timeline). The 3 items = the 3 milestones below.

```sql
-- ── milestones (3 items) ───────────────────────────────────
insert into public.milestones (order_index, title_ar, subtitle_ar, color) values
  (1, 'الإنتاج الإبداعي لمواد الحملة', 'الهوية والمحتوى الإبداعي للحملة',       '#2C5A9E'), -- HRDF blue
  (2, 'المؤثرون',                       'اختيار المؤثرين والنشر والتقارير',       '#6D5BD0'), -- purple
  (3, 'الترويج عبر الحملات الممولة',     'خطة الترويج والتقرير الختامي للحملة',    '#4FA45C'); -- green

-- ── milestone 1: الإنتاج الإبداعي لمواد الحملة (3) ──────────
insert into public.deliverables (milestone_id, order_index, title_ar, start_date, end_date, status) values
  ((select id from milestones where order_index=1), 1, 'ملف التوجهات الإبداعية',       '2026-06-01','2026-06-23','not_started'),
  ((select id from milestones where order_index=1), 2, 'إنتاج الفيديو الرئيسي للحملة',  '2026-07-01','2026-07-30','not_started'),
  ((select id from milestones where order_index=1), 3, 'إنتاج المواد الداعمة للحملة',   '2026-07-01','2026-07-30','not_started');

-- ── milestone 2: المؤثرون (3) ──────────────────────────────
insert into public.deliverables (milestone_id, order_index, title_ar, start_date, end_date, status) values
  ((select id from milestones where order_index=2), 1, 'ملف قائمة المؤثرين المقترحين',         '2026-06-01','2026-06-23','not_started'),
  ((select id from milestones where order_index=2), 2, 'الملف المعتمد للأسماء ومواعيد النشر',  '2026-07-01','2026-07-30','not_started'),
  ((select id from milestones where order_index=2), 3, 'التقرير النهائي لأداء إعلانات المؤثرين','2026-12-21','2026-12-31','not_started');

-- ── milestone 3: الترويج عبر الحملات الممولة (2) ───────────
insert into public.deliverables (milestone_id, order_index, title_ar, start_date, end_date, status) values
  ((select id from milestones where order_index=3), 1, 'ملف خطة الترويج وآلية الاعتمادات', '2026-08-02','2026-08-13','not_started'),
  ((select id from milestones where order_index=3), 2, 'التقرير النهائي للحملة',            '2026-12-21','2026-12-31','not_started');
  -- ⚠️ OPTIONAL 9th (in the CSV, not in your list). Uncomment to include:
  -- ((select id from milestones where order_index=3), 3, 'إطلاق الحملة الإعلانية', '2026-10-01','2026-12-31','not_started');

-- ── approval gates (timeline diamonds) ─────────────────────
insert into public.approval_gates (gate_date) values
  ('2026-06-30'), ('2026-08-06'), ('2026-08-20');
```

> ✅ **Launch deliverable — confirmed excluded.** The roadmap CSV had a 9th item — "إطلاق الحملة الإعلانية" (1 Oct – 31 Dec) — but the client confirmed to leave it out. **8 deliverables total.** (The commented line above can be re-enabled later if that ever changes.)

**Derived milestone spans** (min start → max end of each milestone's deliverables, used for the Gantt lane and the card date label):
- الإنتاج الإبداعي: **1 يونيو → 30 يوليو**
- المؤثرون: **1 يونيو → 31 ديسمبر**
- الترويج الممول: **2 أغسطس → 31 ديسمبر**

---

## 7. Authentication & Authorization

- **Supabase Auth, email + password.** No public sign-up, no magic links, no invites.
- **Admin provisions accounts** (Supabase dashboard or a seed script): create the user, set the password, set `profiles.role`.
- A DB trigger creates a `profiles` row on user creation (default role `client`; admins flipped to `admin` manually).
```sql
create function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), 'client');
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();
```
- **`middleware.ts`** gates every route except `/login`. Unauthed → `/login`; authed hitting `/login` → `/`.
- **Admin server actions** re-check `is_admin()` server-side regardless of UI state.

### Login page (`/login`)
- HRDF logo, project title, email + password, "تسجيل الدخول" button.
- Arabic errors ("البريد الإلكتروني أو كلمة المرور غير صحيحة").
- RTL, centered card on HRDF-blue background.

---

## 8. Page & Component Specification

### 8.1 Routes
```
/login   public login
/        main portal (auth required) — all 3 sections; admin edit controls render inline when role=admin
```

### 8.2 Component tree
```
<RootLayout dir="rtl" lang="ar" font=ArabicFont>
  <Page "/">
    <ProjectHeader>                ← Section 1
      <ClientLogo /> <TitleBlock />
      <SummaryCards> Card×4 </SummaryCards>
      <EditModeToggle? />          ← admin only
    </ProjectHeader>

    <Timeline>                     ← Section 2 (horizontal scroll, LTR time axis)
      <MonthAxis يونيو..ديسمبر />
      <TodayMarker />
      <MilestoneLane ×3>           ← the 3 items as lanes
        <DeliverableBar ×n />      ← positioned by date
      </MilestoneLane>
      <ApprovalGateDiamond ×3 />
      <Legend />
    </Timeline>

    <Milestones>                   ← Section 3 (3 cards / accordion on mobile)
      <MilestoneCard ×3>
        <Header rollupDot title dates />
        <DeliverableRow ×n>
          <StatusDot/> <Title/> <DateRange/>
          <DriveLinkButton? />     ← shown when drive_url set
          <AdminControls?>         ← admin only
            <StatusSelect/> <DriveLinkInput/>
          </AdminControls>
        </DeliverableRow>
      </MilestoneCard>
    </Milestones>
  </Page>
</RootLayout>
```

### 8.3 Section 1 — Header
- HRDF logo top-right (RTL), tag "خطة التنفيذ — 2026".
- Title: `الخط الزمني لتنفيذ الحملة الإبداعية لتدشين منصة الإرشاد المهني`
- Client: `صندوق تنمية الموارد البشرية - هدف`
- **4 cards** (4-up desktop / 2×2 mobile):
  1. **تاريخ البدء** → `١ يونيو ٢٠٢٦`
  2. **تاريخ الانتهاء** → `٣١ ديسمبر ٢٠٢٦`
  3. **الأيام المتبقية** → live (`٣١ ديسمبر − اليوم`)
  4. **القادم** → the **next upcoming key date** — whichever deliverable due-date or approval gate is soonest from today (e.g. `اعتماد الصندوق — ٣٠ يونيو`). ✅ confirmed.
- **Note:** the 3 milestones run in parallel (not sequential phases), so card #4 deliberately shows the next key date rather than a single "current milestone."

### 8.4 Section 2 — Timeline / Gantt
- Horizontally scrollable; momentum/touch scroll.
- **Time axis is LTR** (يونيو far-left → ديسمبر far-right) — matches the PDF and roadmap tool. Implement the track as an LTR island inside the RTL page; Arabic labels inside bars stay readable.
- 7 month columns sized by real day counts.
- **3 lanes** = the 3 milestones (color-coded). Each deliverable = a rounded bar spanning start→end, labeled (truncate + tooltip).
- **Today marker** vertical line + "اليوم" pill.
- **3 approval diamonds** at 30 Jun / 6 Aug / 20 Aug, labeled "اعتماد الصندوق".
- Bar reflects status (fill/opacity + ✅ when done).
- **Legend (دليل الرموز):** today line, approval, done.
- **Mobile:** sticky lane-label column + a month-tab strip (يونيو…ديسمبر) that scroll-jumps to a month; "اسحب يميناً/يساراً" hint; 44px touch targets.

### 8.5 Section 3 — Milestones & Deliverables
- **3 cards** in order: الإنتاج الإبداعي → المؤثرون → الترويج الممول. Desktop = 3 cards; mobile = accordion (one open at a time).
- **Card header:** index badge (١/٢/٣), title, derived date range, roll-up status dot.
- **Deliverable row:** status dot + Arabic label, title, date range, **Drive button ("عرض الملف ↗")** when `drive_url` set (opens new tab, `rel="noopener noreferrer"`).
- **Admin controls** (role=admin): status `<Select>` (4 statuses) + Drive URL `<Input>` + حفظ (validates `https://`). Optimistic UI + toast; writes `activity_log`.

### 8.6 Admin edit mode
- Header toggle "وضع التعديل" shows/hides inline controls (lets admin preview the client view). Server still guards every write.

---

## 9. Core Logic & Algorithms

```ts
const PROJECT_START = new Date('2026-06-01');
const PROJECT_END   = new Date('2026-12-31');
const TOTAL_DAYS    = differenceInCalendarDays(PROJECT_END, PROJECT_START) + 1; // 214

// days remaining
const daysLeft = Math.max(0, differenceInCalendarDays(PROJECT_END, today) + 1);

// Gantt positioning (LTR time axis)
const leftPct  = (differenceInCalendarDays(bar.start, PROJECT_START) / TOTAL_DAYS) * 100;
const widthPct = ((differenceInCalendarDays(bar.end, bar.start) + 1) / TOTAL_DAYS) * 100;
const todayPct = (differenceInCalendarDays(today, PROJECT_START) / TOTAL_DAYS) * 100;

// next key date (card #4)
const next = [...deliverables.map(d=>({d:d.end_date,label:d.title_ar})),
              ...gates.map(g=>({d:g.gate_date,label:g.label_ar}))]
             .filter(x => x.d >= today).sort((a,b)=>a.d-b.d)[0];

// milestone roll-up status
function rollup(ds){ if(ds.every(d=>d.status==='done'))return 'done';
  if(ds.some(d=>d.status!=='not_started'))return 'in_progress'; return 'not_started'; }
```
- Track min-width ~`1100px` so months stay legible; container scrolls.

---

## 10. Design System (HRDF brand — blue-dominant)

> **Colors are sampled from the HRDF logo.** Final hexes get locked once you send the logo file; the values below are my read of the logo blue + brand-guide accents. Design should read **clearly HRDF**: blue + white dominant, accents used sparingly.

```
--hrdf-blue:       #2C5A9E   /* PRIMARY — sampled from the logo background */
--hrdf-blue-deep:  #1C3D6E   /* headers, depth, nav band */
--hrdf-blue-soft:  #EAF1FA   /* tinted backgrounds, hovers */
--white:           #FFFFFF
--ink:             #1A2A40   /* body text */
--muted:           #6B7A90
--bg:              #F4F6FA
/* functional accents (brand guide), used only for lanes/status */
--accent-purple:   #6D5BD0   /* المؤثرون lane */
--accent-green:    #4FA45C   /* الترويج الممول lane + 'done' */
--accent-orange:   #E08A2C   /* 'awaiting approval' */
```
- **Status colors:** not_started `#94A3B8` "لم تبدأ" · in_progress `#2C5A9E` "قيد التنفيذ" · awaiting_approval `#E08A2C` "بانتظار اعتماد الصندوق" · done `#4FA45C` "مكتملة".
- **Type:** IBM Plex Sans Arabic. Title 28–32 / values 24 / body 14–16 / labels 12–13 (tighter on mobile).
- **Layout:** 8px grid, `rounded-2xl` cards, soft shadows, full-bleed blue header band, ~1200px max width.

---

## 11. RTL & Arabic
- `<html lang="ar" dir="rtl">`; use Tailwind logical utilities (`ps/pe/ms/me/start/end`).
- **Exception:** the Gantt time-track is an LTR island (`dir="ltr"`) so time flows June→December; Arabic labels inside re-enable RTL.
- Numbers: Arabic-Indic digits via a single `formatNum()` helper (`Intl.NumberFormat('ar-SA')`) to match the mockups; easy to switch to Latin.
- Dates: `Intl.DateTimeFormat('ar', {day:'numeric',month:'long',year:'numeric'})` → `١ يونيو ٢٠٢٦`. **Gregorian** month names (يونيو/يوليو), not Hijri.

## 12. Mobile / Responsive
- Mobile-first Tailwind. Header cards 2×2 on phone, 4-up ≥md.
- Timeline: horizontal scroll + sticky lane labels + month-tab jump; "اسحب للاطلاع" hint.
- Milestones: accordion on phone, 3 cards on desktop.
- Test at 375px (iPhone SE) and a large Android.

## 13. Accessibility
- Semantic landmarks, correct heading order, Radix keyboard/ARIA for accordion/select.
- Status never color-only — always paired with an Arabic label.
- WCAG AA contrast on HRDF blue; focus-visible rings; honor `prefers-reduced-motion`.

---

## 14. Folder Structure
```
hrdf/
├─ app/
│  ├─ layout.tsx              # <html dir=rtl lang=ar>, font, providers
│  ├─ globals.css             # tailwind + brand tokens
│  ├─ login/page.tsx
│  └─ page.tsx                # main portal (server component)
├─ components/
│  ├─ header/   ProjectHeader.tsx, SummaryCards.tsx, EditModeToggle.tsx
│  ├─ timeline/ Timeline.tsx, DeliverableBar.tsx, MonthAxis.tsx, TodayMarker.tsx, ApprovalGate.tsx, Legend.tsx
│  ├─ milestones/ MilestoneCard.tsx, DeliverableRow.tsx, StatusDot.tsx
│  ├─ admin/    StatusSelect.tsx, DriveLinkInput.tsx
│  └─ ui/       (shadcn)
├─ lib/
│  ├─ supabase/ server.ts, client.ts, middleware.ts
│  ├─ date.ts   # constants + Gantt math + formatters
│  └─ status.ts # labels/colors, roll-up
├─ actions/
│  ├─ updateDeliverableStatus.ts
│  └─ setDeliverableDriveUrl.ts
├─ middleware.ts
├─ supabase/    schema.sql (§6), seed.sql (§6.5)
├─ netlify.toml # @netlify/plugin-nextjs
├─ .env.local
└─ PLAN.md
```

## 15. Server Actions
```ts
// admin only; re-check is_admin(), validate (zod), revalidatePath('/')
updateDeliverableStatus(id: string, status: DeliverableStatus): Promise<{ok:boolean; error?:string}>
setDeliverableDriveUrl(id: string, url: string | null): Promise<{ok:boolean; error?:string}>
//   validate https:// (optionally restrict to drive.google.com/docs.google.com) → update → write activity_log
```
Reads happen in `page.tsx` (server component) via the Supabase server client (RLS-scoped).

## 16. Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # server only (seed/admin scripts)
NEXT_PUBLIC_APP_URL=           # the netlify.app (or custom) URL
```

## 17. Security
- RLS on every table; service-role key never reaches the client.
- Admin enforced in **both** RLS and server actions.
- Drive URL validated (`https://`, optionally Google hosts only); links rendered with `rel="noopener noreferrer"`.
- No secrets in client components; same-origin server actions + Supabase cookie auth.

## 18. Testing
- **Vitest:** `date.ts` (TOTAL_DAYS, daysLeft at boundaries, Gantt offset/width %, next-key-date); `status.ts` (roll-up); URL validation.
- **Component:** SummaryCards Arabic numerals/dates; DeliverableRow hides admin controls for client; DriveButton only when URL set.
- **Playwright:** client login (no edit controls); admin login → flip status → assert UI; unauthorized `/` → redirect `/login`.
- **Manual:** RTL visual pass + 375px mobile pass.

## 19. Deployment (Netlify)
1. Create Supabase project → run `schema.sql` then `seed.sql`.
2. Create auth users (Seet admins + HRDF clients) with passwords; set admin roles in `profiles`.
3. Push repo to **GitHub** → in **Netlify**, "Add new site → import from GitHub" → it auto-detects Next.js (`@netlify/plugin-nextjs`).
4. Set env vars in Netlify; deploy. Netlify gives a `*.netlify.app` URL automatically.
5. Add that URL to Supabase Auth "allowed redirect URLs".
6. Smoke test: login both roles, edit a deliverable, confirm the client view updates.

---

## 20. Build Plan (phased checklist)

**Phase 0 — Scaffold**
- [ ] Next.js 14 + TS + Tailwind + shadcn; `dir=rtl`, Arabic font; brand tokens (from logo).
- [ ] `netlify.toml` + Next plugin.

**Phase 1 — Data & Auth**
- [ ] Supabase project; `schema.sql` + RLS + `seed.sql`.
- [ ] Supabase clients + `middleware.ts` route guard.
- [ ] `/login` + sign-in; seed admin + client users.

**Phase 2 — Read-only portal (client view)**
- [ ] Section 1 header + 4 cards (live countdown + next key date).
- [ ] Section 3 milestone cards + deliverable rows + status dots + Drive buttons.
- [ ] Section 2 Gantt: month axis, 3 lanes, bars, today marker, 3 approval diamonds, legend.
- [ ] Mobile passes (accordion, horizontal scroll, month tabs).

**Phase 3 — Admin editing**
- [ ] Edit-mode toggle; status `<Select>`; Drive URL input + validation.
- [ ] Server actions (guarded) + optimistic UI + toasts + activity_log.

**Phase 4 — Polish & ship**
- [ ] A11y + RTL QA; Vitest/Playwright; GitHub → Netlify deploy; smoke test; hand over creds.

---

## 21. Open Items (confirm when convenient — none block the build)
1. **Exact brand blue + font** — finalized once you send the logo file (placeholders in §10).
2. **Digits** — Arabic-Indic (`٢٠٤`) assumed; switchable.
3. **Drive-link restriction** — any `https` link, or lock to Google Drive hosts only? (Default: any https, validated.)
4. **People lists + passwords** — Seet admins (you'll send emails) + HRDF clients.

> **Decided:** launch deliverable **excluded** (8 total) · header card #4 = **next upcoming key date**.

## 22. Future Enhancements (post-v1)
- Password-reset / self-service profile.
- In-app approval button so HRDF can record the اعتماد.
- "آخر تحديث" activity feed from `activity_log`.
- Export current roadmap to PDF.
- Supabase Realtime (client view updates without refresh).
- Multi-project support (schema already isolates cleanly).
