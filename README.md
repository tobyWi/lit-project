# lit-project

Interactive CV/portfolio built with Lit + TypeScript + Vite.

## What This Repo Is

- Personal CV site
- Component-based Lit application
- Data-driven content (section copy is stored under `src/data`)
- GitHub Pages deployment via GitHub Actions

## Tech Stack

- Lit
- TypeScript
- Vite
- pnpm

## Install

```bash
pnpm install
```

## Run Locally

```bash
pnpm dev
```

## Type Check

```bash
pnpm check
```

## Production Build

```bash
pnpm build
```

## Deploy (GitHub Pages)

Deployment is automated through:

- `.github/workflows/deploy.yml`

Current trigger:

- push to `master`

The workflow builds and publishes `dist/` to GitHub Pages.

## Content/Data

Most text content is centralized in:

- `src/data/cv-data.ts`
- `src/data/sections/*`
- `src/data/ui/*`
