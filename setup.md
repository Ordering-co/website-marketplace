# Website Marketplace setup runbook for an AI agent

```text
Get https://github.com/Ordering-co/website-marketplace.git, preserving any existing checkout. Read setup.md and follow it to use my confirmed Ordering project, configure and start Website Marketplace, verify its catalog and make a first visible local edit. Preserve my changes and never copy privileged credentials.
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

## Manual configuration and deployment reference

Local agent setup uses ignored src/config.local.json; it does not replace the public base configuration or configure deployment. Preserve the following distribution-specific instructions.

Set `project` in `src/config.json` to your own Ordering project. The API URL, version and language and socket configuration must match your backend. Keep feature flags appropriate to your project. Store identifiers in the template are public integration identifiers; configure your own stores before release. Configure your own dashboard URL, support email and observability services. Never put privileged API credentials in browser code.

`.env.example` lists local Vite settings; values exposed by Vite are public browser configuration. Google Maps requires your own restricted browser key when enabled. Backend project settings control authentication, payments, analytics, notifications and franchise/business availability. Test these integrations only against a project you control.

For Cloudflare, choose your own account and worker names in `wrangler.toml`, set the project and asset URL for each environment and supply account credentials through your local environment or deployment platform. `pnpm cf:dev` starts the worker locally; deployment scripts publish to the configured account and environment. Review configuration before using them. Docker requires the submodule to be initialized before building; use `docker compose up --build` for development.

Run `pnpm build`, `pnpm lint:check`, `pnpm i18n:verify`, `pnpm i18n:check-generated`, `pnpm test:coverage` and `node scripts/coverage-summary.js --no-run --strict`. Coverage is scoped by the test configuration; it does not represent every source file. A successful bundle or HTTP preview verifies asset delivery, not backend tenant behavior, checkout, payments or notifications.

Translations are managed in `i18n/translations.json`. New keys need real literal fallbacks, entries in each locale and refreshed generated files with `pnpm i18n:generate`. Retain existing translations. See `i18n/README.md` for catalog operations.
