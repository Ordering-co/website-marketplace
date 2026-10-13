import React from 'react'
import { useHistory, useParams, useLocation } from 'react-router-dom'

import { HelmetTags } from '../../components/HelmetTags'

import { useSite } from '~components/contexts/SiteContext'
import { useEvent } from '~components/contexts/EventContext'
import { useTheme } from 'styled-components'
import { checkSiteUrl } from '~ui/utils'
import { OrderDetails } from '~ui/src/components/OrderDetails'
import { resolveTrackingOnly } from '../../utils/trackingOnlyMode'

export const OrderDetailsPage = (props) => {
  const history = useHistory()
  const { orderId } = useParams()
  const hashKey = new URLSearchParams(useLocation()?.search)?.get('hash') || null
  const [events] = useEvent()
  const [{ site }] = useSite()
  const theme = useTheme()
  const businessUrlTemplate = checkSiteUrl(site?.business_url_template, '/store/:business_slug')
  const isTrackingOnly = resolveTrackingOnly(theme)

  const orderDetailsProps = {
    ...props,
    orderId,
    hashKey,
    isTrackingOnly,
    urlToShare: (hashKey) => hashKey ? `${window.location.origin}/orders/${orderId}?hash=${hashKey}` : null,
    handleOrderRedirect: () => {
      history.push(isTrackingOnly ? '/' : '/profile/orders')
    },
    handleBusinessRedirect: (slug) => {
      if (businessUrlTemplate === '/store/:business_slug' || businessUrlTemplate === '/:business_slug') {
        events.emit('go_to_page', { page: 'business', params: { business_slug: slug } })
      } else {
        events.emit('go_to_page', { page: 'business', search: `?${businessUrlTemplate.split('?')[1].replace(':business_slug', '')}${slug}` })
      }
    }
  }
  return (
    <>
      <HelmetTags page='order_details' helmetTitle={`Order #${orderId}`} />
      <OrderDetails {...orderDetailsProps} />
    </>
  )
}

export default OrderDetailsPage
