import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useApi } from '~components/contexts/ApiContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useSession } from '~components/contexts/SessionContext'

import { buildGateCheckoutFields, computeMissingProfileFields } from './profileFields'

const initialState = { fields: [], loading: false, error: null, fetchedForUserId: null }

const CheckoutFieldsContext = createContext({
  state: initialState,
  skipped: false,
  skip: () => {}
})

export const CheckoutFieldsProvider = ({ children }) => {
  const [ordering] = useApi()
  const [{ auth, user, token }] = useSession()
  const [state, setState] = useState(initialState)
  const [skipped, setSkipped] = useState(false)

  const skip = useCallback(() => {
    setSkipped(true)
  }, [])

  const isGuest = !!user?.guest_id

  useEffect(() => {
    let cancelled = false
    setSkipped(false)

    const getCheckoutFields = async () => {
      if (!auth || isGuest || !token) {
        setState(initialState)
        return
      }
      setState({ fields: [], loading: true, error: null, fetchedForUserId: null })
      try {
        const response = await fetch(`${ordering.root}/validation_field_order_types`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        const content = await response.json()
        if (cancelled) return
        if (content?.error) {
          setState({ fields: [], loading: false, error: content?.result, fetchedForUserId: null })
          return
        }
        setState({ fields: content?.result ?? [], loading: false, error: null, fetchedForUserId: user?.id ?? null })
      } catch (err) {
        if (cancelled) return
        setState({ fields: [], loading: false, error: err?.message ?? true, fetchedForUserId: null })
      }
    }

    getCheckoutFields()
    return () => {
      cancelled = true
    }
  }, [auth, isGuest, token, user?.id, ordering?.root])

  const contextValue = useMemo(
    () => ({ state, skipped, skip }),
    [state, skipped, skip]
  )

  return (
    <CheckoutFieldsContext.Provider value={contextValue}>
      {children}
    </CheckoutFieldsContext.Provider>
  )
}

export const useCheckoutFields = () => useContext(CheckoutFieldsContext).state

export const useProfileCompletion = () => {
  const { fields, loading, error, fetchedForUserId } = useCheckoutFields()
  const { skipped, skip } = useContext(CheckoutFieldsContext)
  const [{ auth, user }] = useSession()
  const [{ configs, loading: configsLoading }] = useConfig()

  // Backend flag, not implemented server-side yet: when absent the gate stays mandatory.
  const canSkip = configs?.profile_completion_skip_enabled?.value === '1'

  const missingFields = useMemo(
    () => computeMissingProfileFields({ user, fields, configs }),
    [user, fields, configs]
  )

  const checkoutFields = useMemo(
    () => buildGateCheckoutFields({ fields, configs, missingFields }),
    [fields, configs, missingFields]
  )

  const isRequired =
    !!auth &&
    !user?.guest_id &&
    !loading &&
    !error &&
    !configsLoading &&
    !!user?.id &&
    fetchedForUserId === user?.id &&
    missingFields.length > 0 &&
    !skipped

  return { isRequired, missingFields, checkoutFields, loading, canSkip, skip }
}
