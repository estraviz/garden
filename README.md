# TheDataIsFlat.com

This repository contains the source code for my [Digital Garden](https://www.thedataisflat.com/notes/What-is-a-Digital-Garden).

I use this site to publish evolving notes, connect ideas over time, and keep a personal knowledge base that stays in motion.

The site is built on top of [Quartz v4](https://quartz.jzhao.xyz/) with custom content organization, layout, and styling.

## Quick structure

- `content/`: notes, posts, books, and images
- `quartz.config.ts`: global site configuration
- `quartz.layout.ts`: page layout and component composition
- `quartz/styles/custom.scss`: custom visual tweaks

## Local development

### Prerequisites

- Node.js 20+
- npm 9+

### Install dependencies

```bash
npm ci
```

### Run locally

```bash
npm run quartz -- build --serve
```

If you prefer a fixed port (for example, `8000`), run:

```bash
npm run quartz -- build --serve --port 8000
```

### Recommended checks

```bash
npm run check
npm run quartz -- build --bundleInfo
```

## CI

CI is defined in `.github/workflows/ci.yaml` and runs on `push` and `pull_request` for `v4` and `ver*` branches.

Current CI steps:

1. `npm ci`
2. `npm run check`
3. `npm run quartz -- build --bundleInfo`

## Deployment

Production deploys are handled by Netlify, connected to this GitHub repository.

Typical flow:

1. I push/merge changes into the publishing branch (`v4`).
2. Netlify detects the update and deploys the site.

## Upstream relationship (Quartz)

This repository is a Quartz-derived project and keeps an `upstream` remote:

- `https://github.com/jackyzha0/quartz.git`

Upstream updates are integrated manually when it makes sense, balancing framework improvements with compatibility for my local customizations.

Example sync flow:

```bash
git fetch upstream
git checkout -b chore/sync-upstream-v4
git merge upstream/v4
```

## Attribution and license

- Base framework: Quartz (Jacky Zhao and contributors)
- Upstream attribution is intentionally preserved
- License for Quartz-derived code remains MIT (`LICENSE.txt`)

## Inspiration

This project is strongly inspired by:

- [Andy Matuschak's evergreen notes](https://notes.andymatuschak.org/About_these_notes)
- [Maggie Appleton's digital gardeners collection](https://github.com/MaggieAppleton/digital-gardeners)
