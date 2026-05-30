# About Page Redesign — Design Spec

## Goal

Redesign the PT (`/sobre/`) and EN (`/en/about/`) about pages with a lateral hero layout, real company logos, experience timeline, and condensed bio — inspired by yudiganeko.com while maintaining the site's Apple design system.

## Pages Affected

- `src/pages/sobre/index.astro` (PT)
- `src/pages/en/about/index.astro` (EN)

## Design System Constraints

Follow the existing Apple design system (DESIGN.md / CLAUDE.md):
- Font: `system-ui, -apple-system, BlinkMacSystemFont`
- Action color: `#0066cc` (`apple-blue`)
- Cards: `rounded-apple-lg` (18px), border `border-apple-hairline`
- No box shadows on UI chrome
- Dark mode: all elements must have dark variants

---

## Layout Structure

Single-column, `max-w-2xl mx-auto`, `flex flex-col gap-12` — same container as current.

### Section 1 — Hero (lateral)

Two-column flex row (`flex items-center gap-6`):

**Left:** Avatar image `w-20 h-20 rounded-full object-cover` (existing `/avatar.jpg`)

**Right:**
- `h1`: "Vinicius Tirabassi" — `text-apple-display font-semibold`
- Subtitle `p`: "Engineering Manager · XP Inc. · São Paulo" — `text-[17px] text-apple-ink-48`
- CTA buttons row (`flex gap-3 flex-wrap mt-4`):
  - GitHub: `bg-apple-blue text-white rounded-full px-[22px] py-[11px]`
  - LinkedIn: `border border-apple-blue text-apple-blue rounded-full px-[22px] py-[11px]`
  - Medium: `border border-apple-hairline text-apple-ink-48 rounded-full px-[22px] py-[11px]`

On mobile (`flex-col items-center text-center`): avatar on top, text below, buttons centered.

### Section 2 — Bio

Single `<p>` tag, `text-apple-body text-apple-ink dark:text-[#f5f5f7]`.

**PT text:**
> "Lidero squads de engenharia em plataformas de missão crítica na XP Inc. — Core Bancário e Core Investimentos, responsáveis pelos fluxos de cash-in e cash-out de toda a operação. Comecei como engenheiro fundador da Conta Digital PJ e hoje gerencio 12 engenheiros distribuídos em 2 squads, em ambiente 24/7 com tolerância zero a falhas."

**EN text:**
> "I lead engineering squads on mission-critical platforms at XP Inc. — Core Banking and Core Investments, responsible for cash-in and cash-out flows across the entire operation. I started as a founding engineer of the Business Digital Account and now manage 12 engineers across 2 squads, in a 24/7 environment with zero tolerance for failure."

### Section 3 — Trajetória / Experience (Timeline)

Section label: `text-apple-caption font-semibold uppercase tracking-wide text-apple-ink-48` ("Trajetória" / "Experience")

List of 4 items (`flex flex-col gap-5`). Each item: `flex items-center gap-4`

**Logo column:** `w-9 h-9 rounded-lg object-contain border border-apple-hairline dark:border-[#3a3a3c] shrink-0`

**Text column:**
- Role + Company: `text-[15px] font-semibold text-apple-ink dark:text-[#f5f5f7]`
- Period: `text-apple-caption text-apple-ink-48 dark:text-[#6e6e73]`

**Items (PT / EN labels same):**

| Logo file | Role (PT) | Role (EN) | Period |
|---|---|---|---|
| `/logos/xp.png` | Software Engineering Manager · XP Inc. | Software Engineering Manager · XP Inc. | out. 2024 – presente / Oct 2024 – present |
| `/logos/xp.png` | Senior Software Engineer · XP Inc. | Senior Software Engineer · XP Inc. | abr. 2023 – out. 2024 / Apr 2023 – Oct 2024 |
| `/logos/itau.png` | Software Engineer · Itaú Unibanco | Software Engineer · Itaú Unibanco | ago. 2019 – jul. 2021 / Aug 2019 – Jul 2021 |
| `/logos/fiap.png` | Tutor de Ensino Superior · FIAP | Higher Education Tutor · FIAP | fev. 2023 – presente / Feb 2023 – present |

**Logo assets:** Copy from image cache to `public/logos/`:
```bash
cp /Users/vinicius/.claude/image-cache/a4f7ff50-667c-4c96-8f46-7c0586ec2334/2.png public/logos/xp.png
cp /Users/vinicius/.claude/image-cache/a4f7ff50-667c-4c96-8f46-7c0586ec2334/3.png public/logos/itau.png
cp /Users/vinicius/.claude/image-cache/a4f7ff50-667c-4c96-8f46-7c0586ec2334/4.png public/logos/fiap.png
```

Logo display note: XP and FIAP have dark backgrounds — render as-is with border. Itaú has white background — same border treatment. All `object-contain`.

### Section 4 — O que move meu trabalho / What drives my work

Section label: same style as Section 3.

`ul flex flex-col gap-3`, each `li flex gap-3`:
- Arrow: `text-apple-blue dark:text-apple-blue-dark mt-[2px]` → character
- Text: `text-apple-body text-apple-ink dark:text-[#f5f5f7]`

**PT bullets (unchanged from current):**
1. Engenharia como meio, negócio como fim — todo investimento técnico precisa se traduzir em valor para o cliente e a operação
2. Liderança baseada em confiança, autonomia e contexto — não em controle
3. Cultura de feedback, alta performance e desenvolvimento de pessoas
4. Decisões arquiteturais conectadas à estratégia — escalabilidade, observabilidade, custo, time-to-market

**EN bullets (unchanged from current):**
1. Engineering as a means, business as the end — every technical investment must translate into value for the customer and the operation
2. Leadership based on trust, autonomy, and context — not control
3. Feedback culture, high performance, and people development
4. Architectural decisions connected to strategy — scalability, observability, cost, time-to-market

### Section 5 — Formação / Education

Section label: same style.

`ul flex flex-col gap-3`, each item `flex gap-3 items-start`:
- Dot: `w-2 h-2 rounded-full bg-apple-blue mt-[6px] shrink-0`
- Text block:
  - Institution + degree: `text-[15px] font-semibold text-apple-ink dark:text-[#f5f5f7]`
  - Period: `text-apple-caption text-apple-ink-48 dark:text-[#6e6e73]`

**Items:**

| PT | EN | Period |
|---|---|---|
| MBA em Gestão de Projetos · USP/Esalq | MBA in Project Management · USP/Esalq | 2023 – 2024 |
| Engenharia da Computação · FIAP | Computer Engineering · FIAP | 2015 – 2019 |

---

## Removed Sections

- Stack pills section (`.NET`, `Azure`, etc.) — removed entirely
- Footer teaching note (`border-t` paragraph) — content absorbed into timeline (FIAP Tutor entry)

---

## File Changes

| File | Action |
|---|---|
| `src/pages/sobre/index.astro` | Full rewrite |
| `src/pages/en/about/index.astro` | Full rewrite |
| `public/logos/xp.png` | Copy from image cache |
| `public/logos/itau.png` | Copy from image cache |
| `public/logos/fiap.png` | Copy from image cache |

No new components. No new i18n keys needed (all text is inline). No tests required (pure HTML/Astro static page).

## Validation

Run `npm run build` — must pass with 0 errors. Visually check PT and EN routes in dev server (`npm run dev`), verify dark mode, verify mobile layout (< 640px).
