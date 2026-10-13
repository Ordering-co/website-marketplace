import React from 'react'
import { useTheme } from 'styled-components'
import { HelmetTags } from '../../components/HelmetTags'
import settings from '../../config'
import { Promotions as PromotionsController } from '~ui/src/components/Promotions'

export const Promotions = (props) => {
  const theme = useTheme()
  const websiteThemeType = theme?.my_products?.components?.website_theme?.components?.type
  const websiteThemeBusinessSlug = theme?.my_products?.components?.website_theme?.components?.business_slug
  const websiteThemeFranchiseSlug = theme?.my_products?.components?.website_theme?.components?.franchise_slug || websiteThemeBusinessSlug
  const updatedFranchiseSlug = (websiteThemeType === 'franchise' && websiteThemeFranchiseSlug) || settings?.franchiseSlug

  const promotionsProps = {
    franchiseId: updatedFranchiseSlug,
    ...props
  }
  return (
    <>
      <HelmetTags page='promotions' />
      <PromotionsController {...promotionsProps} />
    </>
  )
}

export default Promotions
