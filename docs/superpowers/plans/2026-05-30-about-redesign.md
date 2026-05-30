# About Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the PT and EN about pages with a lateral hero layout, real company logos, experience timeline, and condensed bio.

**Architecture:** Two static Astro pages (`sobre/index.astro` and `en/about/index.astro`) fully rewritten. Logo images copied to `public/logos/`. No new components, no new i18n keys — all text inline. Follows the Apple design system defined in CLAUDE.md and DESIGN.md.

**Tech Stack:** Astro 5, Tailwind CSS, system-ui font, `apple-blue` / `apple-ink` / `apple-hairline` design tokens.

---

### Task 1: Copy company logo assets

**Files:**
- Create: `public/logos/xp.png`
- Create: `public/logos/itau.png`
- Create: `public/logos/fiap.png`

- [ ] **Step 1: Create the logos directory**

```bash
mkdir -p public/logos
```

- [ ] **Step 2: Copy the logo images**

```bash
cp /Users/vinicius/.claude/image-cache/a4f7ff50-667c-4c96-8f46-7c0586ec2334/2.png public/logos/xp.png
cp /Users/vinicius/.claude/image-cache/a4f7ff50-667c-4c96-8f46-7c0586ec2334/3.png public/logos/itau.png
cp /Users/vinicius/.claude/image-cache/a4f7ff50-667c-4c96-8f46-7c0586ec2334/4.png public/logos/fiap.png
```

- [ ] **Step 3: Verify the files exist**

```bash
ls -lh public/logos/
```

Expected: three `.png` files each with non-zero size.

- [ ] **Step 4: Commit**

```bash
git add public/logos/
git commit -m "feat(about): add company logo assets"
```

---

### Task 2: Rewrite PT about page (`/sobre/`)

**Files:**
- Modify: `src/pages/sobre/index.astro` (full rewrite)

- [ ] **Step 1: Verify the build passes before changes**

```bash
npm run build 2>&1 | tail -5
```

Expected: `build complete` with no errors.

- [ ] **Step 2: Rewrite `src/pages/sobre/index.astro`**

Replace the entire file with:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';

const experience = [
  {
    logo: '/logos/xp.png',
    role: 'Software Engineering Manager',
    company: 'XP Inc.',
    period: 'out. 2024 – presente',
  },
  {
    logo: '/logos/xp.png',
    role: 'Senior Software Engineer',
    company: 'XP Inc.',
    period: 'abr. 2023 – out. 2024',
  },
  {
    logo: '/logos/itau.png',
    role: 'Software Engineer',
    company: 'Itaú Unibanco',
    period: 'ago. 2019 – jul. 2021',
  },
  {
    logo: '/logos/fiap.png',
    role: 'Tutor de Ensino Superior',
    company: 'FIAP',
    period: 'fev. 2023 – presente',
  },
];

const education = [
  { degree: 'MBA em Gestão de Projetos', institution: 'USP/Esalq', period: '2023 – 2024' },
  { degree: 'Engenharia da Computação', institution: 'FIAP', period: '2015 – 2019' },
];

const values = [
  'Engenharia como meio, negócio como fim — todo investimento técnico precisa se traduzir em valor para o cliente e a operação',
  'Liderança baseada em confiança, autonomia e contexto — não em controle',
  'Cultura de feedback, alta performance e desenvolvimento de pessoas',
  'Decisões arquiteturais conectadas à estratégia — escalabilidade, observabilidade, custo, time-to-market',
];
---

<BaseLayout
  title="Sobre — Vinicius Tirabassi"
  description="Software Engineering Manager @ XP Inc. | Liderando squads em plataformas de missão crítica"
  lang="pt"
  altHref="/en/about/"
>
  <div class="max-w-2xl mx-auto flex flex-col gap-12">

    <!-- Hero -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <img
        src="/avatar.jpg"
        alt="Vinicius Tirabassi"
        class="w-20 h-20 rounded-full object-cover shrink-0"
      />
      <div class="text-center sm:text-left">
        <h1 class="text-apple-display font-semibold text-apple-ink dark:text-[#f5f5f7]">
          Vinicius Tirabassi
        </h1>
        <p class="text-[17px] text-apple-ink-48 dark:text-[#98989d] mt-1">
          Engineering Manager · XP Inc. · São Paulo
        </p>
        <div class="flex gap-3 flex-wrap mt-4 justify-center sm:justify-start">
          <a
            href="https://github.com/vtirabassi"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-apple-blue text-white text-apple-body rounded-full px-[22px] py-[11px] transition-transform active:scale-95"
          >GitHub</a>
          <a
            href="https://www.linkedin.com/in/viniciustirabassi/"
            target="_blank"
            rel="noopener noreferrer"
            class="border border-apple-blue text-apple-blue text-apple-body rounded-full px-[22px] py-[11px] transition-transform active:scale-95"
          >LinkedIn</a>
          <a
            href="https://medium.com/@viniciustirabassi"
            target="_blank"
            rel="noopener noreferrer"
            class="border border-apple-hairline dark:border-[#3a3a3c] text-apple-ink-48 dark:text-[#98989d] text-apple-body rounded-full px-[22px] py-[11px] transition-transform active:scale-95"
          >Medium</a>
        </div>
      </div>
    </div>

    <!-- Bio -->
    <p class="text-apple-body text-apple-ink dark:text-[#f5f5f7]">
      Lidero squads de engenharia em plataformas de missão crítica na XP Inc. — Core Bancário e
      Core Investimentos, responsáveis pelos fluxos de cash-in e cash-out de toda a operação.
      Comecei como engenheiro fundador da Conta Digital PJ e hoje gerencio 12 engenheiros
      distribuídos em 2 squads, em ambiente 24/7 com tolerância zero a falhas.
    </p>

    <!-- Trajetória -->
    <div class="flex flex-col gap-5">
      <h2 class="text-apple-caption font-semibold uppercase tracking-wide text-apple-ink-48 dark:text-[#6e6e73]">
        Trajetória
      </h2>
      <ul class="flex flex-col gap-5">
        {experience.map((item) => (
          <li class="flex items-center gap-4">
            <img
              src={item.logo}
              alt={item.company}
              class="w-9 h-9 rounded-lg object-contain border border-apple-hairline dark:border-[#3a3a3c] shrink-0"
            />
            <div>
              <p class="text-[15px] font-semibold text-apple-ink dark:text-[#f5f5f7]">
                {item.role} · {item.company}
              </p>
              <p class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73]">{item.period}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <!-- O que move meu trabalho -->
    <div class="flex flex-col gap-4">
      <h2 class="text-apple-caption font-semibold uppercase tracking-wide text-apple-ink-48 dark:text-[#6e6e73]">
        O que move meu trabalho
      </h2>
      <ul class="flex flex-col gap-3">
        {values.map((value) => (
          <li class="flex gap-3 text-apple-body text-apple-ink dark:text-[#f5f5f7]">
            <span class="text-apple-blue dark:text-apple-blue-dark mt-[2px] shrink-0">→</span>
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </div>

    <!-- Formação -->
    <div class="flex flex-col gap-4">
      <h2 class="text-apple-caption font-semibold uppercase tracking-wide text-apple-ink-48 dark:text-[#6e6e73]">
        Formação
      </h2>
      <ul class="flex flex-col gap-3">
        {education.map((item) => (
          <li class="flex gap-3 items-start">
            <span class="w-2 h-2 rounded-full bg-apple-blue mt-[6px] shrink-0"></span>
            <div>
              <p class="text-[15px] font-semibold text-apple-ink dark:text-[#f5f5f7]">
                {item.degree} · {item.institution}
              </p>
              <p class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73]">{item.period}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>

  </div>
</BaseLayout>
```

- [ ] **Step 3: Run build to verify no errors**

```bash
npm run build 2>&1 | tail -5
```

Expected: `build complete` with no errors.

- [ ] **Step 4: Start dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:4321/sobre/` and check:
- Hero shows avatar left + name/subtitle/buttons right on desktop
- On mobile (narrow window): avatar on top, text centered below
- Dark mode toggle: all text and borders adapt correctly
- Logos display for XP, Itaú, FIAP
- Timeline shows 4 items
- Values section shows 4 → bullets
- Education shows 2 items with blue dots
- No stack pills section
- No footer teaching paragraph

- [ ] **Step 5: Commit**

```bash
git add "src/pages/sobre/index.astro"
git commit -m "feat(about): redesign PT about page with lateral hero and timeline"
```

---

### Task 3: Rewrite EN about page (`/en/about/`)

**Files:**
- Modify: `src/pages/en/about/index.astro` (full rewrite)

- [ ] **Step 1: Rewrite `src/pages/en/about/index.astro`**

Replace the entire file with:

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';

const experience = [
  {
    logo: '/logos/xp.png',
    role: 'Software Engineering Manager',
    company: 'XP Inc.',
    period: 'Oct 2024 – present',
  },
  {
    logo: '/logos/xp.png',
    role: 'Senior Software Engineer',
    company: 'XP Inc.',
    period: 'Apr 2023 – Oct 2024',
  },
  {
    logo: '/logos/itau.png',
    role: 'Software Engineer',
    company: 'Itaú Unibanco',
    period: 'Aug 2019 – Jul 2021',
  },
  {
    logo: '/logos/fiap.png',
    role: 'Higher Education Tutor',
    company: 'FIAP',
    period: 'Feb 2023 – present',
  },
];

const education = [
  { degree: 'MBA in Project Management', institution: 'USP/Esalq', period: '2023 – 2024' },
  { degree: 'Computer Engineering', institution: 'FIAP', period: '2015 – 2019' },
];

const values = [
  'Engineering as a means, business as the end — every technical investment must translate into value for the customer and the operation',
  'Leadership based on trust, autonomy, and context — not control',
  'Feedback culture, high performance, and people development',
  'Architectural decisions connected to strategy — scalability, observability, cost, time-to-market',
];
---

<BaseLayout
  title="About — Vinicius Tirabassi"
  description="Software Engineering Manager @ XP Inc. | Leading squads on mission-critical platforms"
  lang="en"
  altHref="/sobre/"
>
  <div class="max-w-2xl mx-auto flex flex-col gap-12">

    <!-- Hero -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <img
        src="/avatar.jpg"
        alt="Vinicius Tirabassi"
        class="w-20 h-20 rounded-full object-cover shrink-0"
      />
      <div class="text-center sm:text-left">
        <h1 class="text-apple-display font-semibold text-apple-ink dark:text-[#f5f5f7]">
          Vinicius Tirabassi
        </h1>
        <p class="text-[17px] text-apple-ink-48 dark:text-[#98989d] mt-1">
          Engineering Manager · XP Inc. · São Paulo
        </p>
        <div class="flex gap-3 flex-wrap mt-4 justify-center sm:justify-start">
          <a
            href="https://github.com/vtirabassi"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-apple-blue text-white text-apple-body rounded-full px-[22px] py-[11px] transition-transform active:scale-95"
          >GitHub</a>
          <a
            href="https://www.linkedin.com/in/viniciustirabassi/"
            target="_blank"
            rel="noopener noreferrer"
            class="border border-apple-blue text-apple-blue text-apple-body rounded-full px-[22px] py-[11px] transition-transform active:scale-95"
          >LinkedIn</a>
          <a
            href="https://medium.com/@viniciustirabassi"
            target="_blank"
            rel="noopener noreferrer"
            class="border border-apple-hairline dark:border-[#3a3a3c] text-apple-ink-48 dark:text-[#98989d] text-apple-body rounded-full px-[22px] py-[11px] transition-transform active:scale-95"
          >Medium</a>
        </div>
      </div>
    </div>

    <!-- Bio -->
    <p class="text-apple-body text-apple-ink dark:text-[#f5f5f7]">
      I lead engineering squads on mission-critical platforms at XP Inc. — Core Banking and
      Core Investments, responsible for cash-in and cash-out flows across the entire operation.
      I started as a founding engineer of the Business Digital Account and now manage 12 engineers
      across 2 squads, in a 24/7 environment with zero tolerance for failure.
    </p>

    <!-- Experience -->
    <div class="flex flex-col gap-5">
      <h2 class="text-apple-caption font-semibold uppercase tracking-wide text-apple-ink-48 dark:text-[#6e6e73]">
        Experience
      </h2>
      <ul class="flex flex-col gap-5">
        {experience.map((item) => (
          <li class="flex items-center gap-4">
            <img
              src={item.logo}
              alt={item.company}
              class="w-9 h-9 rounded-lg object-contain border border-apple-hairline dark:border-[#3a3a3c] shrink-0"
            />
            <div>
              <p class="text-[15px] font-semibold text-apple-ink dark:text-[#f5f5f7]">
                {item.role} · {item.company}
              </p>
              <p class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73]">{item.period}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <!-- What drives my work -->
    <div class="flex flex-col gap-4">
      <h2 class="text-apple-caption font-semibold uppercase tracking-wide text-apple-ink-48 dark:text-[#6e6e73]">
        What drives my work
      </h2>
      <ul class="flex flex-col gap-3">
        {values.map((value) => (
          <li class="flex gap-3 text-apple-body text-apple-ink dark:text-[#f5f5f7]">
            <span class="text-apple-blue dark:text-apple-blue-dark mt-[2px] shrink-0">→</span>
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </div>

    <!-- Education -->
    <div class="flex flex-col gap-4">
      <h2 class="text-apple-caption font-semibold uppercase tracking-wide text-apple-ink-48 dark:text-[#6e6e73]">
        Education
      </h2>
      <ul class="flex flex-col gap-3">
        {education.map((item) => (
          <li class="flex gap-3 items-start">
            <span class="w-2 h-2 rounded-full bg-apple-blue mt-[6px] shrink-0"></span>
            <div>
              <p class="text-[15px] font-semibold text-apple-ink dark:text-[#f5f5f7]">
                {item.degree} · {item.institution}
              </p>
              <p class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73]">{item.period}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>

  </div>
</BaseLayout>
```

- [ ] **Step 2: Run build to verify no errors**

```bash
npm run build 2>&1 | tail -5
```

Expected: `build complete` with no errors.

- [ ] **Step 3: Verify EN page in dev server**

With dev server running (`npm run dev`), open `http://localhost:4321/en/about/` and check:
- Same layout as PT page, all text in English
- `altHref` links correctly back to `/sobre/` (language toggle in nav switches between them)
- Dark mode works

- [ ] **Step 4: Commit**

```bash
git add "src/pages/en/about/index.astro"
git commit -m "feat(about): redesign EN about page with lateral hero and timeline"
```
