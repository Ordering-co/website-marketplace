// Consumer sessions belong to their project, never to the developer pairing.
export function verifyLocalMarketplaceSession (settings, storage) {
  if (!settings._local_project_pin) return
  const previous = storage.getItem('marketplace-local-project') || storage.getItem('project')
  if (storage.getItem('token') && previous !== settings.project) {
    throw new Error('An existing consumer session belongs to another or unknown project. Open this preview in a fresh browser profile; your existing session has been preserved.')
  }
  storage.setItem('marketplace-local-project', settings.project)
}
