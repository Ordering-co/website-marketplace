export const haversineDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const PLUGIN_BASE_URL = 'https://custom-order.plugins.orderingplus.com'

export const fetchPluginConfig = async (projectCode) => {
  try {
    const res = await fetch(`${PLUGIN_BASE_URL}/${projectCode}/api/config`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
    const data = await res.json()
    return data.result || {}
  } catch {
    return {}
  }
}

export const createCustomOrder = async (projectCode, token, payload) => {
  const res = await fetch(`${PLUGIN_BASE_URL}/${projectCode}/api/orders/custom`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
    body: JSON.stringify(payload)
  })
  return res.json()
}
