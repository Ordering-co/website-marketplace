# First visible modification

1. Run the configured preview with corepack pnpm marketplace:start and open its URL in a fresh profile. The bottom-left label contains the selected project.
2. Open src/components/LocalMarketplacePreview/index.jsx. Change previewLabel from Local Marketplace preview to My first Marketplace edit. Save.
3. Observe the label change without a manual reload. Vite Fast Refresh preserves the page. Record a before/after screenshot and a successful API URL for the same project.
4. Change it back to undo the example. The label exists only for a locally pinned development preview; it is absent from production.

Continue editing src/ui/src/components/* and sibling styles.js for customer presentation; src/pages/* compose pages; src/theme.json contains base tokens (remote theme may override them). src/@/components is the pinned shared controller/SDK submodule: do not edit it from this checkout. Presentation changes do not authorize writes to customer/project data.
