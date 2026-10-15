# Website project selection

| Data | Source | Private credential required |
| --- | --- | --- |
| Project | Existing MCP/installed launcher or Dashboard/Accounts browser selection | Authentication establishes the choice; the resulting identifier is public |
| API URL, v400, app_id | Repository integration contract | No |
| Language | Helper ORDERING_LANG, en by default | No |
| Socket | Pinned SDK endpoint | No for guests |
| Config/theme/default location and order type | Public project GET requests | No |
| Business catalog | Consumer API | No |
| Consumer account | Normal Website consumer login | Its own session, separate from developer credentials |

The Website does not require an MCP or administrative REST key to render. An existing MCP connection avoids repeat sign-in and lets the agent offer the detected project. Compatible browser selection verifies membership and delivers only the project identifier. Never ask again for information already detected.

## Capability check and explicit fallback

Browser project selection requires the public connect page to advertise `marketplace-project-selection-v1`. Check this capability before creating a pairing; a source branch is not proof of deployment. The included exporter performs public reads independently of upstream release timing.

If no reusable MCP connection or compatible browser capability is available, explain the limitation and offer an explicit public-project identifier confirmed by the person. `marketplace:configure --public-project` validates public project/configuration/catalog responses; its exporter reports `verification.identity=false`. This does not authenticate the person or establish membership. Never choose the first project or generate credentials as a fallback.
