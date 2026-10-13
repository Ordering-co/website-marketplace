import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { useOrder } from '~components/contexts/OrderContext'
import { OriginalBusinessesListing } from './layouts/OriginalBusinessesListing'
import { AppointmentsBusinessListing } from './layouts/AppointmentsBusinessListing'

export const BusinessesListing = (props) => {
  const { logosLayout } = props
  const theme = useTheme()
  const [{ loading }] = useOrder()

  const [firstLoad, setFirstLoad] = useState(loading)
  const layout = theme?.business_listing_view?.components?.layout?.type || 'original'

  useEffect(() => {
    if (loading) return
    setFirstLoad(false)
  }, [loading])

  return (
    <>
      {(layout === 'original' || logosLayout) && !firstLoad && <OriginalBusinessesListing {...props} />}
      {(layout === 'appointments') && !logosLayout && !firstLoad && <AppointmentsBusinessListing {...props} />}
    </>
  )
}
