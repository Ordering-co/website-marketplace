import React, { useState, useEffect } from 'react'
import { SpinnerLoader } from '../SpinnerLoader'

// Grace window that bridges the brief `orderState.loading` flicker after login,
// so the spinner doesn't blink off/on while the order options settle. See .
const SETTLE_GRACE_MS = 600

/**
 * Shows a loading spinner on Home during the post-login settle window — while the
 * order options (and the saved address) are still resolving — instead of an idle
 * Home that reads as "frozen". Once an address resolves the parent route redirects
 * to /search; an address-less user falls through to the Home content. See .
 */
export const PostLoginHomeGate = (props) => {
  const { auth, hasAddress, loading, children } = props
  const isSettling = auth && !hasAddress && loading
  const [showSpinner, setShowSpinner] = useState(isSettling)

  useEffect(() => {
    if (isSettling) {
      setShowSpinner(true)
      return
    }
    const timer = setTimeout(() => setShowSpinner(false), SETTLE_GRACE_MS)
    return () => clearTimeout(timer)
  }, [isSettling])

  return auth && !hasAddress && showSpinner ? <SpinnerLoader /> : children
}
