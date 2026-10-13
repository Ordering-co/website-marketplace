const MANIFEST_LINK_ID = 'web-app-manifest'
const IOS_TITLE_META = 'apple-mobile-web-app-title'

const upsertMeta = (doc, name, content) => {
  let meta = doc.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = doc.createElement('meta')
    meta.setAttribute('name', name)
    doc.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
  return meta
}

export const applyWebManifestLink = (manifest, {
  document: doc = document,
  createObjectURL = (value) => URL.createObjectURL(value),
  revokeObjectURL = (value) => {
    if (typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(value)
  }
} = {}) => {
  if (!manifest?.name) return () => {}

  const href = createObjectURL(new Blob([JSON.stringify(manifest)], {
    type: 'application/manifest+json'
  }))

  let link = doc.getElementById(MANIFEST_LINK_ID) || doc.querySelector('link[rel="manifest"]')
  if (!link) {
    link = doc.createElement('link')
    link.id = MANIFEST_LINK_ID
    link.rel = 'manifest'
    doc.head.appendChild(link)
  }
  link.id = MANIFEST_LINK_ID
  link.setAttribute('href', href)
  upsertMeta(doc, IOS_TITLE_META, manifest.name)

  return () => {
    revokeObjectURL(href)
  }
}
