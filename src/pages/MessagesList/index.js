import React from 'react'
import { useTheme } from 'styled-components'

import { HelmetTags } from '../../components/HelmetTags'
import settings from '../../config'

import { useEvent } from '~components/contexts/EventContext'
import { MessagesListing } from '~ui/src/components/MessagesListing'

export const MessagesList = (props) => {
  const [events] = useEvent()
  const theme = useTheme()
  const websiteThemeType = theme?.my_products?.components?.website_theme?.components?.type
  const websiteThemeFranchiseSlug = theme?.my_products?.components?.website_theme?.components?.franchise_slug
  const websiteThemeBusinessSlug = theme?.my_products?.components?.website_theme?.components?.business_slug
  const updatedFranchiseSlug = (websiteThemeType === 'franchise' && websiteThemeFranchiseSlug) || settings?.franchiseSlug
  const updatedBusinessSlug = (websiteThemeType === 'single_store' && websiteThemeBusinessSlug) || settings?.businessSlug

  const messageprops = {
    ...props,
    franchiseId: updatedFranchiseSlug,
    businessId: updatedBusinessSlug,
    onRedirectPage: (data) => events.emit('go_to_page', data)
  }
  return (
    <>
      <HelmetTags page='messages' />
      <MessagesListing {...messageprops} />
    </>
  )
}

export default MessagesList
