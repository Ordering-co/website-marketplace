const ORDERING_HOSTS = ['tryordering.com', 'ordering.co', 'orderingplus.com']

export const isOrderingHostname = (hostname) =>
  !!hostname && ORDERING_HOSTS.some(domain => hostname.includes(domain))

export const isUsableProject = (value) =>
  typeof value === 'string' && value.trim() !== '' && value !== 'null' && value !== '0'

export const projectFromHostname = (hostname) => {
  if (!hostname) return null
  const slug = hostname.split('.')[0].replace(/^v\d+-/, '')
  return slug || null
}

export const resolveBootstrapProject = ({
  workerProject,
  hostname,
  settings,
  storedProject
}) => {
  if (settings?._local_project_pin) return settings.project
  if (isUsableProject(workerProject)) return workerProject
  if (settings?.use_project_subdomain && isOrderingHostname(hostname)) {
    const fromHost = projectFromHostname(hostname)
    if (isUsableProject(fromHost)) return fromHost
  }

  if (isUsableProject(storedProject)) return storedProject
  if (isUsableProject(settings?.project)) return settings.project
  return null
}

export const resolveCurrentLookupProject = ({
  hostname,
  settings,
  storedProject
}) => {
  if (settings?._local_project_pin) return settings.project
  if (settings?.use_project_subdomain && isOrderingHostname(hostname)) {
    const fromHost = projectFromHostname(hostname)
    if (isUsableProject(fromHost)) return fromHost
  }
  if (settings?.use_project_domain && !isOrderingHostname(hostname)) {
    return '_'
  }
  if (isUsableProject(storedProject)) return storedProject
  if (isUsableProject(settings?.project)) return settings.project
  return null
}
