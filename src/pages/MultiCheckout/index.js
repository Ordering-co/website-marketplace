import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useParams } from 'react-router-dom'
import { HelmetTags } from '../../components/HelmetTags'

import { useEvent } from '~components/contexts/EventContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { MultiCheckout as MultiCheckoutController } from '~ui/src/components/MultiCheckout'

const stripePayments = ['stripe', 'stripe_connect', 'stripe_direct', 'google_pay', 'apple_pay']
const redirectMethods = ['epayco']

export const MultiCheckout = (props) => {
  const [events] = useEvent()
  const { cartUuid } = useParams()
  const [, { confirmMultiCarts }] = useOrder()
  const [, t] = useLanguage()
  const [errors, setErrors] = useState([])

  const actionsBeforePlace = async (paymethod, cart) => {
    if (stripePayments.includes(paymethod.gateway)) {
      try {
        const publishable = paymethod?.data?.publishable || paymethod.paymethod?.credentials?.publishable || paymethod?.paymethod?.credentials?.publishable_key
        const clientSecret = cart.payment_events.find(event => event?.event === 'pending_payment')?.data?.extra?.client_secret || cart.paymethod_data.result.client_secret
        const stripe = await loadStripe(publishable)
        const result = await stripe.confirmCardPayment(clientSecret)
        if (result?.paymentIntent?.status === 'succeeded') {
          try {
            const confirmCartRes = await confirmMultiCarts(cartUuid)
            if (confirmCartRes.error) {
              setErrors([confirmCartRes.error.message])
            }
            if (confirmCartRes.result?.id) {
              events.emit('go_to_page', { page: 'multi_orders', params: { orderId: confirmCartRes.result?.id }, replace: true })
            }
          } catch (error) {
            setErrors([error.message])
          }
        }
        if (result?.error?.code === 'payment_intent_authentication_failure') {
          setErrors([t('CART_STATUS_CANCEL_MESSAGE', 'The payment has not been successful, please try again')])
        }
        return true
      } catch (error) {
        setErrors([error.message])
      }
    } else if (paymethod.gateway === 'stripe_redirect') {
      const stripe = await loadStripe(paymethod.paymethod?.credentials?.publishable)
      const confirmOption = {
        bancontact: {
          name: 'confirmBancontactPayment',
          type: 1
        },
        alipay: {
          name: 'confirmAlipayPayment',
          type: 2
        },
        giropay: {
          name: 'confirmGiropayPayment',
          type: 1
        },
        ideal: {
          name: 'confirmIdealPayment',
          type: 2
        }
      }
      const params = {
        1: {
          payment_method: {
            billing_details: cart.paymethod_data.data.owner
          },
          return_url: `${window.location.origin}/checkout/${cartUuid}`
        },
        2: {
          return_url: `${window.location.origin}/checkout/${cartUuid}`
        }
      }
      stripe[confirmOption[paymethod.data.type]?.name](
        cart.paymethod_data.result.client_secret,
        params[confirmOption[paymethod.data.type]?.type]
      ).then((result) => {
        if (result?.error) {
          setErrors([...errors, result?.error?.message])
        }
      }).catch((e) => {
        setErrors([...errors, e?.message || e?.toString()])
      })
    } else if (redirectMethods.includes(paymethod.gateway)) {
      const redirectUrl = cart.payment_events.find(event => event?.event === 'pending_payment')?.data?.extra?.redirect_url
      window.location.replace(redirectUrl)
    }
  }
  const multiCheckoutProps = {
    ...props,
    cartUuid,
    getForterToken: () => window.__forterToken,
    errors,
    clearErrors: () => setErrors([]),
    handleSearchRedirect: () => {
      events.emit('go_to_page', { page: 'search' })
    },
    onRedirectPage: (data) => events.emit('go_to_page', data),
    onPlaceOrderClick: (order) => {
      events.emit('go_to_page', { page: 'multi_orders', params: { orderId: order?.id } })
    },
    actionsBeforePlace
  }

  return (
    <>
      <HelmetTags page='multi_checkout' />
      <MultiCheckoutController {...multiCheckoutProps} />
    </>
  )
}

export default MultiCheckout
