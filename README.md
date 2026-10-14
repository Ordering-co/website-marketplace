# Website Marketplace

## Quickstart

Paste this prompt into your AI agent:

```text
Get https://github.com/Ordering-co/website-marketplace.git, preserving any existing checkout. Read setup.md and follow it to use my confirmed Ordering project, configure and start Website Marketplace, verify its catalog and make a first visible local edit. Preserve my changes and never copy privileged credentials.
```

1. Paste the prompt and let the agent prepare the checkout.
2. Confirm the detected project. Sign in only if the agent offers a compatible project-selection flow.
3. Open the local URL: the project label, loaded catalog and first visible edit show that setup is working.

The agent prefers an existing Ordering connection. Browser selection is offered only when available; otherwise it explains the explicit public-project fallback.

See the [full setup runbook](setup.md), [configuration](docs/marketplace-configuration.md), [first edit](docs/marketplace-first-edit.md) or [troubleshooting](docs/marketplace-troubleshooting.md) for details.

Ordering.co consumer marketplace (React/Vite) with shared commerce controllers pinned in `src/@/components`.

## Obtain the code

Open or fork [Ordering-co/website-marketplace](https://github.com/Ordering-co/website-marketplace). To clone it with its pinned public components:

```sh
git clone --recurse-submodules https://github.com/Ordering-co/website-marketplace.git
cd website-marketplace
```

For an existing checkout, use `git submodule update --init --recursive`. Preserve customer changes, the lockfile and the fixed SDK revision. Keep `LICENSE`, `LICENSE-ORDERING` and dependency notices unchanged. Creating a fork uses your own GitHub account; cloning requires no private membership.

## Requirements

Node **24** (`.nvmrc` / `NODE_VERSION.txt`), **pnpm 9.15.0** (`packageManager`), Git, bash, curl, openssl, and jq or Python 3. macOS/Linux; Windows through WSL. Use the available pinned runtime without changing global defaults. Reuse an existing connected project first; administrator/business manager access is needed only for a new browser project selection. Account/project access is managed at [Accounts](https://accounts.ordering.co).

## First start after project configuration

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm marketplace:doctor
corepack pnpm marketplace:start
```

The process chooses an available port and stays running. For another device, pass `--host` with this machine's current private Tailscale IPv4 address; keep both devices online. See [configuration](docs/marketplace-configuration.md), [first edit](docs/marketplace-first-edit.md), [troubleshooting and maintenance](docs/marketplace-troubleshooting.md), and [prompts](prompts/marketplace.md).

Manual configuration remains available in [setup.md](setup.md#manual-configuration-and-deployment-reference). Build and deployment are separate from local onboarding. Updates use Git merges that preserve your changes; see the troubleshooting guide.

## License

See `LICENSE` and `LICENSE-ORDERING` for distribution terms. Third-party dependencies retain their licenses and notices.
