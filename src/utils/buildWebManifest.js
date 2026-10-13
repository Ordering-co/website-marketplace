const trim = (value) => String(value ?? '').trim()

const toIcon = (icon) => {
  const src = trim(icon?.src)
  if (!src) return null

  const entry = { src }
  const sizes = trim(icon.sizes)
  const type = trim(icon.type)
  const purpose = trim(icon.purpose)

  if (sizes) entry.sizes = sizes
  if (type) entry.type = type
  if (purpose) entry.purpose = purpose
  return entry
}

const toAbsoluteAppUrl = (origin) => {
  const value = trim(origin).replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(value)) return '/'
  return `${value}/`
}

export const buildWebManifest = ({
  name,
  shortName,
  description,
  lang,
  origin,
  icons,
  themeColor,
  backgroundColor
} = {}) => {
  const resolvedName = trim(name)
  if (!resolvedName) return null

  const appUrl = toAbsoluteAppUrl(origin)

  const manifest = {
    name: resolvedName,
    short_name: trim(shortName) || resolvedName,
    lang: trim(lang) || 'en',
    start_url: appUrl,
    scope: appUrl,
    display: 'standalone',
    icons: (Array.isArray(icons) ? icons : []).map(toIcon).filter(Boolean)
  }

  const resolvedDescription = trim(description)
  if (resolvedDescription) manifest.description = resolvedDescription

  const resolvedThemeColor = trim(themeColor)
  if (resolvedThemeColor) manifest.theme_color = resolvedThemeColor

  const resolvedBackgroundColor = trim(backgroundColor)
  if (resolvedBackgroundColor) manifest.background_color = resolvedBackgroundColor

  return manifest
}
