import { getSiteFaviconUrl, getSiteLogoUrl } from './siteBranding'

const trim = (value) => String(value ?? '').trim()

export const resolvePwaBranding = ({
  theme,
  site,
  settings,
  languageCode,
  hostname
} = {}) => {
  const websiteValues = theme?.my_products?.components?.website_settings?.components?.values || {}
  const configuredLogo =
    theme?.my_products?.components?.images?.components?.logo_mobile?.components?.image ||
    theme?.my_products?.components?.images?.components?.logo?.components?.image
  const configuredFavicon = theme?.general?.components?.favicon?.components?.image
  const logo = getSiteLogoUrl(configuredLogo, theme?.images?.logos?.logotype, hostname)
  const favicon = getSiteFaviconUrl(configuredFavicon, site?.logo, hostname)

  return {
    name: trim(websiteValues.name) || trim(site?.name) || trim(settings?.app_name),
    description: trim(websiteValues.description) || trim(site?.description),
    lang: trim(languageCode),
    themeColor: trim(theme?.colors?.primary) || undefined,
    backgroundColor: trim(theme?.colors?.backgroundPage) || undefined,
    icons: [
      { src: favicon, sizes: '192x192', type: 'image/png' },
      { src: logo || favicon, sizes: '512x512', type: 'image/png' }
    ]
  }
}
