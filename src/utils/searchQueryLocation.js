export const parseSearchQueryLocation = (search) => {
  if (!search) return null

  const params = new URLSearchParams(search)
  const lat = parseFloat(params.get('lat'))
  const lng = parseFloat(params.get('lng'))

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat === 0 && lng === 0) return null

  return { lat, lng }
}

export const formatSearchQueryLocation = (location) => {
  if (!location) return null

  const lat = parseFloat(location.lat)
  const lng = parseFloat(location.lng)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat === 0 && lng === 0) return null

  return { lat, lng }
}

export const hasValidSearchLocation = (location) => !!formatSearchQueryLocation(location)

export const appendLocationToSearch = (existingSearch, location) => {
  const formatted = formatSearchQueryLocation(location)
  if (!formatted) return existingSearch || ''

  const params = new URLSearchParams((existingSearch || '').replace(/^\?/, ''))
  params.set('lat', String(formatted.lat))
  params.set('lng', String(formatted.lng))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const resolveSearchQuery = (existingSearch, orderLocation, fallbackLocation) => {
  const normalizedExisting = (existingSearch || '').replace(/^\?/, '')
  if (formatSearchQueryLocation(orderLocation)) {
    return normalizedExisting ? `?${normalizedExisting}` : ''
  }
  return appendLocationToSearch(existingSearch, fallbackLocation || orderLocation)
}

export const stripLocationSearchParams = (search) => {
  const params = new URLSearchParams((search || '').replace(/^\?/, ''))
  params.delete('lat')
  params.delete('lng')
  params.delete('order_type')
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}
