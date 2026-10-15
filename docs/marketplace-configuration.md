# Local configuration and precedence

| Field | Source | Exposure | Purpose |
|---|---|---|---|
| project | Explicit expected project, checked with MCP whoami and public /current | Public, required | Tenant |
| api.url/version/language | Canonical api.ordering.co, v400, language selected in helper ORDERING_LANG (en default) | Public, required | Consumer API |
| socket.url | Pinned SDK sockets-v3.orderingplus.com | Public, required | Real-time endpoint; reachability checked separately |
| app_id / app_internal_name | Artifact contract web_marketplace_26 / website | Public, required | Website theme and settings |
| businessSlug / franchiseSlug | Empty / null for this pilot | Public | No single-store/franchise target |
| use_marketplace | false | Public | Historical flag routes to the business named marketplace when true; it is not the multi-business marketplace mode switch |
| use_project_domain/subdomain, use_kiosk | false | Public | Local project remains fixed |
| url_dashboard | dashboard.ordering.co | Public | Admin link |
| _local_project_pin | true in local pilot | Public, development only | Ignore stale stored project and refuse conflicting Worker project |
| ORDERING_MCP_KEY | Optional previously installed connection only | Private, unnecessary for runtime | Never requested, created or copied during Website onboarding |
| ORDERING_API_KEY | Optional existing quickstart credential | Private, unnecessary here | Not requested/used by pilot |

Local Vite development merges **src/config.json → window.__CONFIG__ → src/config.local.json**. API merges nested settings. Socket merges nested settings only for an explicitly pinned local setup; otherwise the original source/Worker precedence is unchanged. A conflicting Worker project is an error. Production builds load an empty local module and retain existing base → Worker precedence; the ignored local file is not copied to dist. The standard build still copies src/config.json, so local linking is not deployment configuration. No public environment variables are needed by this pilot.

Setup owns connection fields and preserves unrelated app/presentation fields from config.local.json. Source config.json, theme, lockfile and controller SHA remain unchanged. Backups and recovery receipts are private local files in .marketplace-local/. A changed project requires explicit --reconnect. Browser project pinning refuses an existing consumer token or SDK identity/address cache for another or unknown tenant; use a fresh profile rather than deleting someone else's session.

Remote Website theme is read to reject known non-marketplace modes. Missing type uses the ordinary multi-business route. The pilot never rewrites a project's theme, enables single_store, invents a businessSlug or deploys Worker settings. Custom API/socket hosts need a separately reviewed contract, not an unchecked URL override.

Catalog probe: consumer /businesses requires order_type_id and location. The pilot reads default_order_type and location_default_latitude/longitude from public project configs; missing/invalid defaults fail with catalog_order_type_required/catalog_location_required instead of inventing a location. A count can be empty at the configured location; select a customer location in the rendered UI to inspect its real catalog.

The pinned WebsocketContext currently overrides socket.url with https://sockets-v3.orderingplus.com and transports=[websocket]. The pilot records that effective endpoint; polling is rejected by the service. Changing the controller endpoint is separate shared-component work.

## Automatic selection and credentials

The project comes from existing whoami, the installed launcher or compatible browser selection. Confirm reuse or an intentional change; do not ask for an identifier already detected. If no discovery path is available, offer the explicit public-project fallback from setup.md. API/version, socket and app_id come from the fixed integration contract; language defaults to en and catalog probes read project defaults.

MCP and administrative API credentials are not Website runtime requirements. The public exporter performs GET requests with verification.identity=false. Claim identity or membership only when confirmed separately by existing MCP or compatible browser selection. Project-only pairing delivers the identifier in ignored .marketplace-project.json and creates no keys. Consumer sessions remain separate.
