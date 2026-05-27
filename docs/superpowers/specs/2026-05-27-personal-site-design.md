# Personal Site — Design Spec

**Date:** 2026-05-27  
**Status:** Approved

---

## Overview

A public personal website with three sections: a blog for sharing articles, a profile page, and a resource library (dictionary) of articles, videos, and links organized by theme. Resources can be added via a Telegram bot or via Claude Code CLI. The site is hosted on Vercel and publicly shareable.

---

## Goals

- Share technical articles via a blog
- Present a professional profile (who I am, links, areas of interest)
- Curate a public library of studied resources, auto-classified by theme
- Allow adding resources quickly via Telegram or Claude Code CLI
- Keep the site online and shareable at all times

---

## Architecture

### Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Astro + Tailwind CSS |
| Hosting + Serverless Functions | Vercel |
| Articles | Markdown files in Git |
| Library data | JSON file in Git |
| Ratings storage | Vercel KV (Redis) |
| Telegram bot | Vercel Serverless Function |
| Theme classification | Claude API |
| Share functionality | Web Share API (native mobile) + clipboard fallback |

### Repository Structure

```
personal-site/
├── src/
│   ├── pages/
│   │   ├── index.astro              ← Profile page
│   │   ├── blog/
│   │   │   ├── index.astro          ← Blog listing
│   │   │   └── [slug].astro         ← Individual article
│   │   └── library/
│   │       └── index.astro          ← Resource library
│   ├── content/
│   │   └── blog/                    ← Markdown articles (.md)
│   ├── components/
│   │   ├── StarRating.astro         ← Public rating widget
│   │   └── ShareButton.astro        ← Share button component
│   └── data/
│       └── library.json             ← Resource library data
├── api/
│   ├── telegram-webhook.ts          ← Bot webhook (Serverless Function)
│   └── ratings.ts                   ← Rating read/write endpoints
└── docs/
    └── superpowers/specs/
        └── 2026-05-27-personal-site-design.md
```

---

## Pages

### `/` — Profile

Homepage presenting the owner's professional identity:

- Photo, name, professional title
- Short bio
- Areas of interest / expertise
- External links (GitHub, LinkedIn, etc.)
- Navigation to Blog and Library

### `/blog` — Blog

- Chronological list of articles with title, date, description, and tags
- Individual article pages at `/blog/[slug]`
- Articles written in Markdown with frontmatter

**Article frontmatter schema:**
```markdown
---
title: "Article title"
date: 2026-05-27
description: "Short summary"
tags: ["AI", "Software Engineering"]
---
```

### `/library` — Resource Library

- Grid or list of resources grouped and filterable by theme
- Each resource displays: title, type badge (article/video/link), theme tag, personal note, public star rating, and a share button
- Theme filter at the top of the page (client-side filtering via JavaScript — no page reload)

---

## Data Model

### Library item (`src/data/library.json`)

```json
{
  "items": [
    {
      "id": "attention-is-all-you-need",
      "title": "Attention Is All You Need",
      "url": "https://arxiv.org/abs/1706.03762",
      "type": "article",
      "theme": "Machine Learning",
      "description": "Original Transformer paper",
      "personalNote": "Required reading to understand LLMs",
      "addedAt": "2026-05-27"
    }
  ]
}
```

**Field definitions:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | URL-safe slug, unique identifier |
| `title` | string | Resource title (fetched from og:title or provided) |
| `url` | string | Full URL of the resource |
| `type` | enum | `article`, `video`, or `link` |
| `theme` | string | Theme assigned by Claude API |
| `description` | string | Short description (fetched from og:description) |
| `personalNote` | string | Optional personal commentary |
| `addedAt` | date | ISO 8601 date of addition |

### Ratings (Vercel KV)

Ratings are stored in Vercel KV (Redis), keyed by item `id`. Two keys per item:

- `rating:total:{id}` → sum of all votes
- `rating:count:{id}` → number of votes

Average is computed as `total / count` at read time. No user authentication — anonymous voting, one vote per session (tracked via localStorage to prevent repeat votes from the same browser).

**API endpoints (`/api/ratings.ts`):**

- `GET /api/ratings?id={id}` → returns `{ average: number, count: number }`
- `POST /api/ratings` with body `{ id, vote }` (vote: 1–5) → records vote, returns updated average

---

## Telegram Bot Flow

### Adding a resource

```
User  → [URL]
Bot   → "Fetching metadata..."
Bot   → "Theme identified: Machine Learning. Confirm?"
User  → ✅  (or types a different theme)
Bot   → "Added! Deploy in ~2 min."
```

With personal note (pipe-separated):
```
User  → [URL] | Required reading to understand LLMs
```

### Backend steps

1. Webhook receives message in Serverless Function at `/api/telegram-webhook`
2. Function fetches URL metadata (`og:title`, `og:description`)
3. Calls Claude API with title + description → returns suggested theme
4. Bot sends confirmation message to user
5. On confirmation, generates a new item object and commits it to `library.json` via GitHub API
6. Vercel detects the push → automatic deploy (~2 min)

### Environment variables (Vercel)

| Variable | Purpose |
|----------|---------|
| `TELEGRAM_BOT_TOKEN` | Authenticate with Telegram API |
| `GITHUB_TOKEN` | Allow bot to commit to the repository |
| `ANTHROPIC_API_KEY` | Claude API for theme classification |
| `KV_URL` | Vercel KV connection string for ratings |

---

## Claude Code CLI Flow

When adding resources via Claude Code CLI:

1. User shares the URL (and optional personal note) in the conversation
2. Claude fetches metadata, calls the classification logic, and edits `library.json` directly
3. User reviews the change and runs `git push`
4. Vercel deploys automatically

This flow gives the user full control to review and adjust before publishing.

---

## Share Button

Each library item has a share button that:

1. On mobile: triggers the native **Web Share API** (`navigator.share`) with the item's title and URL
2. On desktop: copies the URL to clipboard with a "Copied!" confirmation tooltip

---

## Deploy and CI/CD

- GitHub repository connected to Vercel
- Every `git push` to `main` triggers an automatic production deploy (~1-2 min)
- Pull Requests get automatic preview URLs (useful for reviewing before publishing)
- Telegram webhook registered at: `https://<project>.vercel.app/api/telegram-webhook`
- No server to manage — fully serverless on Vercel free tier

---

## Out of Scope (v1)

- User authentication or admin panel
- Comments on articles
- Search functionality across blog and library
- Custom domain (will use Vercel subdomain initially)
- Email newsletter
