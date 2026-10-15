# Ordering Marketplace

## Quickstart

Paste this prompt into your AI agent:

```text
Get https://github.com/Ordering-co/website-marketplace.git, preserving any existing checkout. Read setup.md and follow it to use my confirmed Ordering project, configure and start Website Marketplace, verify its catalog and make a first visible local edit. Preserve my changes and never copy privileged credentials.
```

1. Paste the prompt and let the agent prepare the checkout.
2. Confirm the detected project. Sign in only when a compatible project-selection flow is available.
3. Open the local URL and check the selected project, catalog and first visible edit.

The agent prefers an existing Ordering connection. If browser selection is unavailable, it explains the explicit public-project fallback; public API validation does not establish membership. Reuse any existing checkout. The prompt obtains the public distribution only when a checkout is absent; existing instructions remain below.

See [setup.md](setup.md), [configuration](docs/marketplace-configuration.md), [first edit](docs/marketplace-first-edit.md) and [troubleshooting](docs/marketplace-troubleshooting.md). Existing development and deployment instructions remain below.

React 18 storefront using Vite, styled-components and the Ordering API. Browse businesses, products, checkout and order tracking.

## Setup

Use Node 24 and pnpm 9.15.0. The shared components are a Git submodule.

```sh
git clone --recurse-submodules https://github.com/Ordering-co/website-marketplace.git
cd website-marketplace
corepack enable
corepack prepare pnpm@9.15.0 --activate
HUSKY=0 pnpm install --frozen-lockfile
cp .env.example .env
pnpm start
```

For an existing checkout, run `git submodule update --init --recursive` before installing. See [setup.md](setup.md) for configuration and validation.

## Commands

```sh
pnpm build
pnpm preview
pnpm lint:check
pnpm i18n:verify
pnpm i18n:check-generated
pnpm test
pnpm test:coverage
node scripts/coverage-summary.js --no-run --strict
```

Development and preview use port 3000. Build output is `dist/`. Configure your own Ordering project and integrations before using the storefront. Runtime functionality requires the corresponding backend services and project permissions.

## Structure

- `src/pages/`: storefront routes.
- `src/ui/`: presentation and local components.
- `src/@/components/`: shared controllers, contexts and SDK submodule.
- `worker/`: SPA delivery, SEO and runtime configuration.
- `i18n/`: translation catalog and generators.

Change local presentation in this repository; shared SDK changes belong in its own repository. Keep translation fallbacks and existing locale values when updating copy.

## License

See `LICENSE` and `LICENSE-ORDERING` for the distribution terms. Third-party dependencies retain their own licenses and notices.
