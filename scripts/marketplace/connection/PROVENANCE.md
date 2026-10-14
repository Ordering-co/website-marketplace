# Pairing helper provenance

Source: [Ordering-co/ordering-dev-quickstart](https://github.com/Ordering-co/ordering-dev-quickstart), snapshot `076061e943001a3a68eb37367d260a502f7c8593` (the repository was subsequently transferred without changing its history). The included MIT LICENSE is unchanged.

This pinned subset supports `project-login start --client codex|claude`, `project-login wait`, `project-login code`, `marketplace-project` and automatic `marketplace-config`. Legacy `login` remains for already paired helpers; it is not the normal Website flow. Global install/uninstall and unrelated commands are blocked, and implicit Claude plugin updates are disabled. Full MCP client registration belongs to the public Quickstart, not this Website helper.

Project selection uses the original RSA-OAEP/relay/nonce/code/expiry contract and Dashboard/Accounts bridges. The page validates membership and delivers only `{v:1,i,p,m:marketplace-project}`. Capability detection refuses an older key-creating page. Ignored `.marketplace-project.json` stores public selection only; new project selection creates no `.env` or administrative credential. Native/installed MCP reuse is preferred and credentials are never copied into the Website.

The exporter matches `scripts/marketplace-config.mjs` in Quickstart #7. It separates authenticated project discovery from public GET configuration and runtime. Existing legacy `.env` and temporary `.login/` remain private/ignored. `env.example` is a blank compatibility template; normal project-only setup does not need it.

Keep this controlled subset pinned until upstream changes have been reviewed and pairing tests pass. It is usable from public Git clones and forks independently of source packaging or package markers.

Publication status is separate from this source snapshot: [Finitless-com/ordering-docs #70](https://github.com/Finitless-com/ordering-docs/pull/70) project-only selection and Quickstart #7 exporter are pending upstream releases. The bundled capability check must pass against the live connect page before browser selection is offered as usable. Existing MCP reuse and public GET configuration work independently. Legacy login remains in the pinned source for provenance/compatibility and must not be invoked by Website onboarding.

The private Docs PR is source evidence, not a customer access requirement. The public connect page capability is the runtime contract.
