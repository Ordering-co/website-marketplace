# Website Marketplace setup runbook for an AI agent

```text
Get https://github.com/Ordering-co/website-marketplace.git, reusing any existing checkout. Read setup.md and follow it to connect my confirmed Ordering project, start the marketplace, and show one simple visible edit. Preserve my changes.
```

## Rules that apply before any sign-in

- Prefer detection or browser selection and never ask again for an identifier already returned. If neither is available, explain the pending capability and offer the explicit public-project fallback below. Do not silently choose a demo or the first project.
- Inspect an existing connection before starting any login. Never create a new key/session just because the source folder is new.
- The Website consumes public project configuration and consumer API endpoints. It requires no MCP key or administrative REST API key to run. MCP is an optional way to discover an already authenticated developer's project. Consumer login remains separate.
- Never read, print, copy or edit credentials yourself. Native MCP tools or their already installed launcher handle credentials. Public configuration stays public. Do not grant write scope, register clients, revoke connections or create keys for this pilot.
- Preserve active sessions, servers, local changes, lockfiles and the pinned shared components.

## 1. Inspect checkout and environment

Read CLAUDE.md, package.json, .nvmrc/NODE_VERSION.txt and the lockfile. Use the available Node 24 and pnpm 9.15.0 through Corepack; do not install latest or change the global default. Record git rev-parse HEAD and git ls-tree HEAD src/@/components. Reuse an existing checkout without recloning or changing its identity. Only when absent, obtain https://github.com/Ordering-co/website-marketplace.git and initialize its pinned submodule with git submodule update --init --recursive. Preserve existing source instructions and credentials; do not register new clients or change credentials. Preserve the included lockfile and existing customer changes.

Without an explicitly configured src/config.local.json, normal source and Worker behavior remains unchanged; do not alter the existing base configuration. Inspect an existing local override as public data. If this checkout already has a verified selected project and the customer asked to continue it, preserve it and proceed to doctor/start; do not repeat sign-in.

## 2. Detect and offer the existing project

First call the available Ordering MCP whoami tool. Read only its project and authenticated identity; never include email, tokens or the raw response in a message. Tool success is the source of the detected project, not a default/demo setting.

If native tools are unavailable, run:

```sh
corepack pnpm marketplace:connection
```

This inspects the bundled helper's existing selection/connection, then probes an already prepared ~/ordering-dev-quickstart/ordering launcher. It performs initialize/whoami only, reads no credential file itself, copies no key and makes no global changes. Missing installations are not installed. It prints only status, project and source. Do not inspect other clients' secrets.

If a valid project is found, ask once in the customer's language: **I found your existing connection to PROJECT. Use this project for the Website Marketplace?** Insert the actual detected value yourself. If their current instruction already explicitly selected that same project, do not ask again.

On yes, store that returned value in your process as DETECTED_PROJECT and run:

```sh
corepack pnpm marketplace:configure --public-project "$DETECTED_PROJECT"
```

DETECTED_PROJECT is filled by the agent from whoami/connection output; the customer must never type it. This command uses public API reads only. It does not copy credentials from the existing connection, request additional permissions or require a newly paired helper.

If they choose another project, or no valid connection is found, proceed to step 3. Do not select a demo/first project or use an expired/rejected connection silently.

## 3. Browser selection only when needed

This route is prepared, not guaranteed live: the project-only connect page release adds `marketplace-project-selection-v1`; its open branch is not evidence of deployment. This repository vendors the reviewed helper and exporter independently; the live capability check determines whether browser selection can run. The command below checks the live capability before creating a pairing.

```sh
./scripts/marketplace/connection/ordering project-login start --client codex
```

For Claude use --client claude. This uses the existing relay/RSA protocol and Dashboard/Accounts bridges. The helper checks the public page capability before creating the pairing. If the project-only page is not published yet, report that precise release dependency; do not fall back to creating MCP/REST keys. The existing-project path above works independently.

Show the private link and code once, only to the person who started this. They open their link, sign in, choose their project (Accounts supports multiple projects), accept using that project locally and type the code. The browser validates identity and project membership; the terminal receives only the project identifier encrypted for that pairing. No MCP enablement, MCP key, REST key or revocation is needed. Do not open their login yourself or publish pairing details.

```sh
./scripts/marketplace/connection/ordering project-login wait
corepack pnpm marketplace:configure
```

Keep the pending process/session ID and collect its final exit code. The browser's success is selection delivery, not installation. The helper remembers the selected project in ignored .marketplace-project.json; configure derives it automatically. **Do not ask for an expected project code before or after login.** On cancellation/expiry/failure, preserve previous config and retry project-login start if needed.

The old login command remains in the pinned source for compatibility; do not invoke it during Website onboarding because it can create an MCP key. If such a helper already finished a legacy login, marketplace:configure can derive that verified project automatically too. Do not start another pairing.

### Explicit public-project fallback

When project-only browser selection is unavailable and no existing MCP project can be reused, report the release dependency and offer a manual alternative. Only after the customer explicitly chooses it, use the public project identifier they provide (or their already confirmed local public configuration):

```sh
corepack pnpm marketplace:configure --public-project "$CONFIRMED_PUBLIC_PROJECT"
```

The agent fills CONFIRMED_PUBLIC_PROJECT from that explicit choice. Public `/current`, configs, theme and catalog reads validate the configuration and project type. They do **not** authenticate the person or prove project membership. Say so in the result. Do not request credentials, use the legacy login command, or derive a default tenant. An intentional change still needs `--reconnect`.

## 4. Install, start, validate

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm marketplace:doctor
corepack pnpm marketplace:start
```

The local config is written atomically with recovery backup. Repetition preserves unrelated customizations. An intentional project change requires --reconnect after the person chooses it; a mismatch fails rather than silently changing tenant. marketplace:restore recovers the previous config.

Startup chooses an available port and never stops other listeners. For another device, use --host with the current private Tailscale IPv4 after checking device/network state. No public tunnel. Keep the server active and collect its startup result.

Open a fresh consumer profile. Confirm the selected project label, effective API project and a successful catalog/menu read, then the actual rendered Website. A prior consumer token from another/unknown project is preserved and blocked. Do not create orders, prices, payments or customer-data changes. Existing MCP may be disconnected after setup and the Website will still work.

## 5. First edit and report

Follow docs/marketplace-first-edit.md, verify Fast Refresh and the unchanged project. Edit presentation only, not src/@/components. Report separately: detected/authenticated project choice, validated public config, and running Website. A public config check is not proof of developer authentication; report whether identity came from native MCP, capability-checked browser selection, or remains unverified in the explicit public fallback. See the included reference, troubleshooting and prompts.

## Manual setup

Local agent setup uses ignored src/config.local.json; it preserves the public base configuration and does not configure deployment. The manual alternative below requires no administrative key. Deployment is a separate explicitly authorized operation.

Set `project` in `src/config.json` to your own Ordering project. The API URL, version and language and socket configuration must match your backend. Keep feature flags appropriate to your project. Store identifiers in the template are public integration identifiers; configure your own stores before release. Configure your own dashboard URL, support email and observability services. Never put privileged API credentials in browser code.

If `.env.example` is supplied, use it only when `.env` does not already exist; preserve existing environment settings. Values exposed by Vite are public browser configuration. Google Maps requires your own restricted browser key when enabled. Backend project settings control authentication, payments, analytics, notifications and franchise/business availability. Test these integrations only against a project you control.

### Requirements

Use the available pinned runtime. The Corepack activation command below is a manual fallback; do not change package-manager defaults automatically in an existing environment.

> Having installed:
> 1. Node.js 24
> 2. Git (version 2.30 or higher)
> 3. pnpm 9.15.0 — `corepack enable && corepack prepare pnpm@9.15.0 --activate`

### Option 1: Clone repository and run with pnpm

1. Open your terminal
2. Clone repository writing:
```
git clone --recursive https://github.com/Ordering-co/website-marketplace.git
```
3. Enter the downloaded repository folder
```
cd website-marketplace
```
4. To install dependencies run
```
HUSKY=0 corepack pnpm install --frozen-lockfile
```

If a blank environment template is supplied and no environment file exists, initialize it without overwriting your settings:

```sh
if [ ! -e .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi
```

5. To start the development server run
```
pnpm start
```

### Expose the dev server via an HTTPS tunnel (Cloudflare)

Public tunnels expose the preview. Use them only when explicitly requested and authorized; prefer private Tailscale access for local device testing.

Sometimes you need to open the local dev server on a public HTTPS URL — to test on a phone, share a preview, or run flows that require `https`. The dev server supports this through an **opt-in** `VITE_TUNNEL` flag, so the default `pnpm start` (plain `localhost`) is never affected.

1. Install `cloudflared` (one-time):
```
brew install cloudflared
```
2. Start the dev server in tunnel mode (enables `host`, tunnel `allowedHosts`, and HMR over port 443):
```
VITE_TUNNEL=true pnpm start
```
3. In a second terminal, open a Cloudflare quick tunnel to the dev server:
```
cloudflared tunnel --url http://localhost:3000
```
4. `cloudflared` prints a public `https://<random>.trycloudflare.com` URL. Open it in any browser — hot reload (HMR) works over the tunnel.

Notes:
- Without `VITE_TUNNEL=true`, the tunnel-specific settings stay off and normal `localhost` HMR works as usual — do **not** set the flag for regular local development.
- Quick tunnels are ephemeral: a new URL is generated on each `cloudflared` run and there is no uptime guarantee. For a stable URL, use a [named tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps).
- VS Code Dev Tunnels (`*.devtunnels.ms`) are also allowed in tunnel mode.

### Option 2: Clone repository and run with Docker
> "You need to have Docker previously installed. You can install it from [here](https://docs.docker.com/engine/install/)"

1. Ensure Docker is opened.
2. Open your terminal.
3. Clone repository writing:
```
git clone --recursive https://github.com/Ordering-co/website-marketplace.git
```
4. Enter the downloaded repository folder
```
cd website-marketplace
```
5. Run
```
docker-compose up
```
6. Open `localhost:3000` in your browser

### Docker troubleshooting

- If you can't get the server with `0.0.0.0:3000` you can use `localhost:3000` instead.
- If you have troubles with Docker, and it’s not running when you run `docker-compose` up https://d.pr/v/J1G6Sk, you can try Quit docker or Restart Docker  https://d.pr/i/eKntOb. Open Docker again, and run `docker-compose up`.
- FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
Check your CPU and memory settings in Docker. Go to Docker `Desktop/Preferences` or `Settings/Resources` Increase the memory and CPU limit (keep in mind that this may affect your computer's performance, so make sure your computer has the capabilities to handle it without getting overwhelmed and don't set a limit higher than what your computer can support).

### Format code

Run `pnpm lint` to execute the linter.

### Deploy to Cloudflare Workers

This storefront can be hosted as a SPA on Cloudflare Workers using static assets. Choose your own account, worker names, project and asset URLs in `wrangler.toml` for each environment, and supply account credentials through your local environment or deployment platform. Review the configuration before using deployment scripts.

**Repository:** [Ordering-co/website-marketplace](https://github.com/Ordering-co/website-marketplace)

1. Build the app (includes the `src/@/components` submodule):
```
pnpm cf:build
```
2. Preview locally with Wrangler:
```
pnpm cf:dev
```
3. Deploy to staging:
```
pnpm deploy:staging
```
4. Deploy to your configured production worker:
```
pnpm deploy:production
```

#### Cloudflare Workers Builds settings

| Setting | Value |
|--------|--------|
| **Build command** | `pnpm cf:build` |
| **Deploy command** | `pnpm deploy:production` (prod) or `pnpm deploy:staging` |
| **Root directory** | `/` |

**Build environment variables** (Settings → Build variables and secrets):

- `NODE_VERSION=24`
- `HUSKY=0` (skip git hooks in CI)
- The generic `.env.example` template and `wrangler.toml` use `ASSET_BASE_URL=/`; preserve your own `.env`. Configure the Vite asset base for your hosting environment explicitly.
- For a CDN or subpath deployment, update `ASSET_BASE_URL` to the same value in `.env` and every applicable `wrangler.toml` environment. A Cloudflare build variable with that name can override the tracked build default.

Use worker names belonging to your own account and review routes and custom domains before deploying.

**Do not use `pnpm deploy` in Cloudflare** — that invokes pnpm's built-in workspace deploy, not this app. Use `pnpm deploy:production` instead.

### Apache deployment (legacy)

The file `public/.htaccess` is kept **only** to allow building and deploying this project to a traditional Apache server (cPanel/shared hosting). It is **ignored by Cloudflare Workers**, where SEO and routing are handled by `worker/index.js`.

If you deploy to Apache, you also need to provide a `seohelper.php` file alongside the build output, since `.htaccess` references it for SEO bot redirection. That file is not part of this repository anymore.

Do **not** rely on `.htaccess` rules when running on Cloudflare — all rewrites, SEO injection, and caching live in the Worker

Legacy demo reference: earlier instructions describe demosv5 as resetting every two hours. Confirm current demo behavior and never treat demo data as persistent project configuration.

## Validation and translations

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

Coverage is scoped by the test configuration; it does not represent every source file. A successful bundle or HTTP preview verifies asset delivery, not backend tenant behavior, checkout, payments or notifications.

Translations are managed in `i18n/translations.json`. New keys need real literal fallbacks, entries in each locale and refreshed generated files with `pnpm i18n:generate`. Retain existing translations. See `i18n/README.md` for catalog operations.

## Development reference

This React 18 storefront uses functional components, Vite, styled-components and the Ordering API to browse businesses, products, checkout and order tracking. The shared commerce controllers and SDK are a pinned Git submodule from [Finitless-com/ordering-components](https://github.com/Finitless-com/ordering-components); initialize it before installation and keep its selected revision.

- `src/pages/`: storefront routes.
- `src/ui/`: presentation and local components.
- `src/@/components/`: shared controllers, contexts and SDK submodule.
- `worker/`: SPA delivery, SEO and runtime configuration.
- `i18n/`: translation catalog and generators.

Change local presentation in this repository; shared SDK changes belong in its own repository. Keep translation fallbacks and existing locale values when updating copy. See [CLAUDE.md](CLAUDE.md) for the controller/UI boundaries and deep-import rules.

Development and preview default to port 3000; the local onboarding launcher chooses an available port. Build output is `dist/`. Configure your own project and integrations before using the storefront; runtime functionality requires the corresponding backend services and project permissions.
