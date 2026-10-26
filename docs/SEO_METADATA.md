# SEO metadata contract

Read this contract before changing metadata. When working in another product, carry over the relevant principles and verify that product's implementation instead of assuming it shares this architecture.

## Ownership and precedence

- The Worker owns initial HTML. Explicit page instances of `HelmetTags` own client descriptions; the global instance without `page` must not compete, even if its lazy chunk mounts last.
- An explicit page can adopt injected metadata before its theme/title is ready. Injected metadata is reusable only for its matching pathname.
- General routes prefer configured site then theme descriptions, retaining valid SEO API data when configured values are absent. Page-specific routes prefer valid API metadata and use site/theme to fill gaps.
- React normal-description precedence is page props, matching injected normal description, configured site/theme, matching injected OG, route `helmetdata.json` description, then the final default. Route defaults are filtered too; preserve real copy such as `tracking_home`, not dummy templates.
- OG precedence is explicit page `ogDescription`, matching injected OG, then effective normal description. A late normal-only `onChangeMetaTag` update must not erase distinct OG copy.
- The explicitly agreed last fallback is `Food Marketplace by Ordering.co`. Exact known old/current templates are not custom copy and must not mask valid candidates. Do not append provider suffixes to custom descriptions. Do not silently change this product decision.
- Every route must have an owning page instance. `/pages` (PagesList) and PageNotFound own `HelmetTags` (`page='pages'` and `page='page_not_found'`); without an owner, a root commit deletes the worker-managed descriptions and they never come back.
- The 404 route uses `page_not_found` metadata plus `robots='noindex, nofollow'`. On customer hosts, `robots` is page-owned — the global instance emits none — so a late global commit cannot reset a page's `noindex`. On provider hosts the global `noindex, nofollow` safeguard is unchanged.
- Scope limitation: adding route owners fixes *persistently missing* descriptions on those routes. It does not guarantee zero-duration metadata coverage while lazy page chunks are still loading — a brief gap between the global commit and the page mount can remain.

## Canonical tags

- Normalize equivalent API representations before filtering, deduplication, and HTML injection: `og:*` uses `property`; `twitter:*` and `description` use `name`. Remove the opposite attribute from normalized tags without mutating source data.
- Filter blank/known template descriptions whether `description`, `og:description`, or `twitter:description` arrives in `name` or `property`. Preserve valid distinct customer OG/Twitter copy.
- Apply source precedence to canonical identities, not to raw attribute spelling. An invalid early candidate must not block a later valid one. Do not create a Twitter description just to fill a missing one.

## Regression evidence

Keep regression cases in `src/components/HelmetTags/__tests__/HelmetTags.test.jsx`, `src/utils/__tests__/seoDescription.test.js`, `src/__tests__/workerSeo.test.js`, and `src/__tests__/workerSeoInjection.test.js`. Route-level ownership lives in the real page-level suites `src/pages/PagesList/__tests__/PagesList.test.jsx` and `src/pages/PageNotFound/__tests__/PageNotFound.test.jsx`. Cover both mount orders including a late global instance at an earlier JSX position, asynchronous page metadata updates, navigation with stale injection, theme-not-ready pages, real and dummy route defaults, empty/template/custom inputs, name/property aliases in both orders, uniqueness, and safe attribute/script escaping.

Use Node 24 and pnpm. Validate affected tests and the initial Worker HTML as well as the resulting React head. Use fixtures or an authorized test project; do not modify production settings to force a scenario. A passing CI run is not proof that untested representations or lifecycle orders work, and a local source check is not proof of production deployment or search-engine indexing.
