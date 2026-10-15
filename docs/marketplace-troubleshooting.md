# Troubleshooting, update and recovery

| Symptom | Diagnostic and recovery |
|---|---|
| Node/pnpm mismatch | Use Node 24 already available on your machine and corepack pnpm (9.15.0). Read this checkout’s packageManager; do not install latest. |
| Missing components | Run git submodule update --init --recursive at the pinned SHA. Do not select the SDK’s latest branch. |
| Interrupted dependencies | Rerun corepack pnpm install --frozen-lockfile. Keep lockfile and existing working servers. |
| Cancelled/expired pairing | Collect project-login wait exit; capability-check before restarting project-login start. Config is untouched until configure succeeds. |
| Project-only browser selection is not published yet | Preserve connections; report that the project-only connect page capability is pending publication. Offer existing MCP reuse or an explicit public-project fallback, which does not prove membership. Never use legacy login to create a key. |
| Permission denied | Sign in as administrator/business manager for the intended project. Use your existing connection or browser project selection. No MCP/REST key is required by the Website. |
| project_mismatch | Compare the detected or browser-selected project with the current config. Select the intended project in the browser; an intentional change requires --reconnect. Never ask the customer to type a code already detected. |
| Partial configure | Backups/receipt precede atomic replacement. Run corepack pnpm marketplace:restore. A replaced current file is saved before recovery. |
| Wrong previous browser tenant | Local pin ignores localStorage.project; another/unknown consumer session blocks startup. Use a fresh browser profile; leave old session intact. |
| Worker conflict | Plain Vite is the supported local path. Disable the other test injection in your own profile or use a fresh one. No production Worker changes. |
| API/catalog error | marketplace:doctor checks HTTP and error envelope/current code. It never prints business or user data. Check live service and intended project. |
| CORS | Compare browser request Origin and response CORS to the private preview URL. Do not disable browser security or use an arbitrary proxy. |
| Socket failure | Inspect socket.io WebSocket handshake to sockets-v3.orderingplus.com and intended project. Doctor's catalog success does not verify websocket events. |
| :3000 occupied | marketplace:start chooses another free port with strictPort. Never kill an unknown listener; another app may own :3000. |
| No visual edit | Use the LocalMarketplacePreview presentation label; remote theme may override other tokens. Check Vite websocket/Fast Refresh. |

## Update without losing changes

Git checkout or customer fork: inspect git status and remote first; commit your own changes on a working branch, save HEAD as a recovery ref, then merge the approved upstream ref (never reset or rebase customer work). Resolve file conflicts by preserving both intentions, initialize the new pinned gitlink, install the frozen lockfile and verify again. Do not update a shared/foreign checkout. A branch merge is not a release.

## Reconnect and local cleanup

To renew, first offer the existing detected project. For another project, capability-check the bundled project-login route before start/wait; if unavailable, report the pending release and offer the explicit public-project fallback from setup.md. Collect the final selection result before rerunning marketplace:configure. To change project, verify the new selected code and pass --reconnect. Use a fresh consumer profile after a change.

Stop only your preview process (Ctrl-C). marketplace:restore restores previous config and keeps the current copy in .marketplace-local. Project-only selection writes no credential. Existing legacy credentials, if any, stay in the helper’s ignored .env, never in source or the compiled bundle. Do not revoke or disconnect an existing MCP simply to stop the Website. Archive your own local helper state/backups privately before removing them, and never delete them in bulk or remove another client's global registration. Logout/global uninstall is not part of the bundled pilot.

Catalog probe: consumer /businesses requires order_type_id and location. The pilot reads default_order_type and location_default_latitude/longitude from public project configs; missing/invalid defaults fail with catalog_order_type_required/catalog_location_required instead of inventing a location. A count can be empty at the configured location; select a customer location in the rendered UI to inspect its real catalog.
