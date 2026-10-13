export const lazyRetry = function (componentImport) {
  // Key the "already retried" flag per chunk. A single shared flag let a
  // successful chunk reset the flag for a different, permanently-missing chunk
  // (stale reference after a deploy) — so that chunk's retry kept seeing
  // hasRefreshed=false and reloaded the page on every attempt (infinite loop).
  // componentImport.toString() is stable per build and unique per import path.
  const storageKey = `retry-lazy-refreshed:${componentImport.toString()}`
  return new Promise((resolve, reject) => {
    const hasRefreshed = JSON.parse(
      window.sessionStorage.getItem(storageKey) || 'false'
    )
    componentImport().then((component) => {
      window.sessionStorage.setItem(storageKey, 'false')
      resolve(component)
    }).catch((error) => {
      if (!hasRefreshed) {
        window.sessionStorage.setItem(storageKey, 'true')
        return window.location.reload()
      }
      reject(error)
    })
  })
}
