import React from 'react'

import { HelmetTags } from '../../components/HelmetTags'
import { TrackingHome } from '~ui/src/components/TrackingHome'

export const TrackingHomePage = () => {
  return (
    <>
      <HelmetTags page='tracking_home' />
      <TrackingHome />
    </>
  )
}

export default TrackingHomePage
