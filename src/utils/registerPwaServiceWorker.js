export const registerPwaServiceWorker = (registerSW, { enabled = true } = {}) => {
  if (!enabled || typeof registerSW !== 'function') return undefined

  try {
    return registerSW({ immediate: true })
  } catch (error) {
    return undefined
  }
}
