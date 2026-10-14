// Consumer sessions belong to their project, never to the developer pairing.
export function verifyLocalMarketplaceSession (settings, storage) {
  if (!settings._local_project_pin) return
  // Both markers must agree: a stale local pin cannot validate another tenant's token.
  const previous = ['marketplace-local-project', 'project']
    .map(key => storage.getItem(key))
    .filter(value => value !== null)
  if (storage.getItem('token') && (!previous.length || previous.some(project => project !== settings.project))) {
    throw new Error('An existing consumer session belongs to another or unknown project. Open this preview in a fresh browser profile; your existing session has been preserved.')
  }
  storage.setItem('marketplace-local-project', settings.project)
}
