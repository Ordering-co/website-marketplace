import baseSettings from './config.json'
import localSettings from 'virtual:marketplace-local-config'

const runtimeOverride = (typeof window !== 'undefined' && window.__CONFIG__) || {}

if (localSettings._local_project_pin && runtimeOverride.project && runtimeOverride.project !== localSettings.project) {
  throw new Error('Local Marketplace project conflicts with Worker configuration')
}

const settings = {
  ...baseSettings,
  ...runtimeOverride,
  ...localSettings,
  api: {
    ...(baseSettings.api || {}),
    ...(runtimeOverride.api || {}),
    ...(localSettings.api || {})
  },
  socket: { ...(baseSettings.socket || {}), ...(runtimeOverride.socket || {}), ...(localSettings.socket || {}) }
}

const keysToNull = [
  'franchiseSlug',
  'businessSlug',
  'store_facebook_pixel_id',
  'store_google_analytics_id',
  'store_segment_id'
]

keysToNull.forEach(key => {
  if (settings[key] === '0' || settings[key] === 'null') {
    settings[key] = null
  };
})

export default settings
