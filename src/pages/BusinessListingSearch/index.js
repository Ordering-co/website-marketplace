import React, { useMemo } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import { useTheme } from 'styled-components'
import { useEvent } from '~components/contexts/EventContext'
import { useSite } from '~components/contexts/SiteContext'
import { useOrder } from '~components/contexts/OrderContext'

import settings from '../../config'

import { HelmetTags } from '../../components/HelmetTags'
import { parseSearchQueryLocation, formatSearchQueryLocation } from '../../utils/searchQueryLocation'

import { checkSiteUrl } from '~ui/utils'
import { BusinessListingSearch as BusinessListingSearchController } from '~ui/src/components/BusinessListingSearch'

export const BusinessListingSearch = (props) => {
  const [events] = useEvent()
  const { search } = useLocation()
  const theme = useTheme()
  const searchParams = new URLSearchParams(search)
  const defaultTerm = searchParams.get('term') || ''
  const isShowMap = searchParams.get('view') === 'map'
  const customLocation = useMemo(() => parseSearchQueryLocation(search), [search])
  const [orderState] = useOrder()
  const orderLocation = useMemo(
    () => formatSearchQueryLocation(orderState?.options?.address?.location),
    [orderState?.options?.address?.location?.lat, orderState?.options?.address?.location?.lng]
  )
  const hasSearchLocation = Boolean(orderLocation || customLocation)
  const [{ site }] = useSite()
  const businessUrlTemplate = checkSiteUrl(site?.business_url_template, '/store/:business_slug')
  const productUrlTemplate = checkSiteUrl(site?.product_url_template, '/store/:business_slug?category=:category_id&product=:product_id')
  const websiteThemeType = theme?.my_products?.components?.website_theme?.components?.type
  const websiteThemeBusinessSlug = theme?.my_products?.components?.website_theme?.components?.business_slug
  const websiteThemeFranchiseSlug = theme?.my_products?.components?.website_theme?.components?.franchise_slug || websiteThemeBusinessSlug
  const updatedFranchiseSlug = (websiteThemeType === 'franchise' && websiteThemeFranchiseSlug) || settings?.franchiseSlug

  if (!orderState.loading && !hasSearchLocation) {
    return <Redirect to='/' />
  }

  const businessListingProps = {
    ...props,
    defaultTerm,
    isShowMap,
    customLocation,
    businessUrlTemplate,
    franchiseId: updatedFranchiseSlug,
    onBusinessClick: (business) => {
      if (businessUrlTemplate === '/store/:business_slug' || businessUrlTemplate === '/:business_slug') {
        events.emit('go_to_page', { page: 'business', params: { business_slug: business.slug } })
      } else {
        events.emit('go_to_page', { page: 'business', search: `?${businessUrlTemplate.split('?')[1].replace(':business_slug', '')}${business.slug}` })
      }
    },
    onRedirectPage: (data) => {
      if (data.page === 'business') {
        const businessSlug = data.params?.store
        if (businessUrlTemplate === '/store/:business_slug' || businessUrlTemplate === '/:business_slug') {
          events.emit('go_to_page', { page: 'business', params: { business_slug: businessSlug } })
        } else {
          events.emit('go_to_page', { page: 'business', search: `?${businessUrlTemplate.split('?')[1].replace(':business_slug', '')}${businessSlug}` })
        }
      } else {
        events.emit('go_to_page', data)
      }
    },
    onProductRedirect: ({ slug, category, product }) => {
      if (!category && !product) {
        if (businessUrlTemplate === '/store/:business_slug' || businessUrlTemplate === '/:business_slug') {
          return events.emit('go_to_page', { page: 'business', params: { business_slug: slug } })
        } else {
          return events.emit('go_to_page', { page: 'business', search: `?${businessUrlTemplate.split('?')[1].replace(':business_slug', '')}${slug}` })
        }
      }
      if (productUrlTemplate === '/store/:business_slug/:category_slug/:product_slug' || productUrlTemplate === '/:business_slug/:category_slug/:product_slug') {
        return events.emit('go_to_page', {
          page: 'product',
          params: {
            business_slug: slug,
            category_slug: category,
            product_slug: product
          },
          replace: true
        })
      }
      if (productUrlTemplate.includes('/store/:category_slug/:product_slug')) {
        const businessParameter = businessUrlTemplate.replace('/store?', '').replace('=:business_slug', '')
        return events.emit('go_to_page', {
          page: 'product',
          params: {
            category_slug: category,
            product_slug: product
          },
          search: `?${businessParameter}=${slug}`,
          replace: true
        })
      }
      if (productUrlTemplate.includes('/store/:business_slug') && productUrlTemplate.includes('category_id')) {
        const ids = productUrlTemplate.split('?')[1].split('&')
        const categoryParameter = ids[0].replace('=:category_id', '')
        const productParameter = ids[1].replace('=:product_id', '')
        return events.emit('go_to_page', {
          page: 'product',
          params: {
            business_slug: slug
          },
          search: `?${categoryParameter}=${category}&${productParameter}=${product}`,
          replace: true
        })
      }
      if (productUrlTemplate.includes('/:business_slug') && !productUrlTemplate.includes('store')) {
        const ids = productUrlTemplate.split('?')[1].split('&')
        const categoryParameter = ids[0].replace('=:category_id', '')
        const productParameter = ids[1].replace('=:product_id', '')
        return events.emit('go_to_page', {
          page: 'product',
          params: {
            business_slug: slug
          },
          search: `?${categoryParameter}=${category}&${productParameter}=${product}`,
          replace: true
        })
      }
    }
  }

  return (
    <>
      <HelmetTags page='business_search' />
      <BusinessListingSearchController {...businessListingProps} />
    </>
  )
}

export default BusinessListingSearch
