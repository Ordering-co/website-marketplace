// Consumer sessions belong to their project, never to the developer pairing.
export function verifyLocalMarketplaceSession (settings, storage) {
  if (!settings._local_project_pin) return
  // Both markers must agree before any tenant-owned session or cache is hydrated.
  const previous = ['marketplace-local-project', 'project']
    .map(key => storage.getItem(key))
    .filter(value => value !== null)
  // Pinned SDK reads these in SessionContext, CustomerContext, OrderContext and useSelectedStudent.
  const hasTenantState = ['token', 'user', 'device_code', 'user-customer', 'options', 'school_selected_students']
    .some(key => storage.getItem(key) !== null)
  if (hasTenantState && (!previous.length || previous.some(project => project !== settings.project))) {
    throw new Error('An existing consumer session belongs to another or unknown project. Open this preview in a fresh browser profile; your existing session has been preserved.')
  }
  storage.setItem('marketplace-local-project', settings.project)
}
