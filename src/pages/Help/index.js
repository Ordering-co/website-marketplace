import React from 'react'
import { HelmetTags } from '../../components/HelmetTags'
import settings from '../../config'

import { Help as HelpController } from '~ui/src/components/Help'

export const Help = (props) => {
  const helpProps = {
    ...props,
    franchiseId: settings?.franchiseSlug
  }
  return (
    <>
      <HelmetTags page='help' />
      <HelpController {...helpProps} />
    </>
  )
}

export default Help
