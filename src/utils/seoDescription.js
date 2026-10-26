// Shared by the Worker and SPA; keep dependency-free.

// Last-resort description applied by the Worker merge and HelmetTags when no
// configured description exists anywhere; the resolver itself stays null.
export const DEFAULT_SEO_DESCRIPTION = 'Food Marketplace by Ordering.co'

// Exact template descriptions shipped with default shell/SEO data, including
// the current default - never real customer copy. A persisted or injected
// template must not mask a valid configured description, so comparison is
// case-insensitive on the trimmed value and covers a trailing period.
const TEMPLATE_DESCRIPTIONS = new Set([
  'food marketplace by ordering.inc',
  'food marketplace by ordering.inc.',
  'food marketplace by orderingplus',
  'food marketplace by orderingplus.',
  'a dummy description about this page',
  DEFAULT_SEO_DESCRIPTION.toLowerCase(),
  `${DEFAULT_SEO_DESCRIPTION.toLowerCase()}.`
])

/**
 * Returns the first trimmed non-empty string that is not a known template
 * description, or null when nothing valid is configured.
 */
export const resolveSeoDescription = (...values) => {
  for (const value of values) {
    if (typeof value !== 'string') continue
    const trimmed = value.trim()
    if (!trimmed) continue
    if (TEMPLATE_DESCRIPTIONS.has(trimmed.toLowerCase())) continue
    return trimmed
  }
  return null
}
