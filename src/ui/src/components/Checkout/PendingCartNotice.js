import React, { useState, useEffect } from 'react'

import { WarningMessage, PendingCartNoticeContent } from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useToast, ToastType } from '~components/contexts/ToastContext'
import { Alert, Confirm } from '~ui/src/components/Confirm'
import { Button } from '~ui/src/styles/Buttons'

import { Icon } from '~ui-icon'

export const PendingCartNotice = (props) => {
  const {
    isCartPending,
    placing,
    paymethodName,
    isPendingCartReleasable,
    releasingPendingCart,
    handleReleasePendingCart,
    handleOrderRedirect,
    onReleased
  } = props

  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  const [dialog, setDialog] = useState(null)
  // A cart placed from this page stays pending until the redirect to the gateway
  // happens: the release option is only for a customer who came back to it.
  // The cart turns pending in the same render that ends `placing`, so this stays
  // mounted while the cart is not pending to see the place happen.
  const [isPlacedHere, setIsPlacedHere] = useState(!!placing)

  const paymethod = paymethodName || t('PAYMENT_GATEWAY', 'the payment gateway')
  const withPaymethod = (text) => text.replace('_paymethod_', paymethod)
  const closeDialog = () => setDialog(null)

  const handleRelease = async () => {
    setDialog(null)
    let response
    try {
      response = await handleReleasePendingCart()
    } catch {
      response = { outcome: 'error' }
    }
    if (!response) return
    if (response.outcome === 'released') {
      onReleased && onReleased()
      return
    }
    if (response.outcome === 'order_created') {
      showToast(ToastType.Success, withPaymethod(t('PAYMENT_FOUND_ORDER_CREATED', 'We found your payment with _paymethod_ and created your order.')))
      response.order?.uuid && handleOrderRedirect && handleOrderRedirect(response.order.uuid)
      return
    }
    setDialog(response.outcome === 'still_pending' ? 'still_pending' : 'error')
  }

  useEffect(() => {
    if (placing) setIsPlacedHere(true)
  }, [placing])

  useEffect(() => {
    if (!isCartPending) setDialog(null)
  }, [isCartPending])

  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) setIsPlacedHere(false)
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  if (!isCartPending) return null

  if (!isPendingCartReleasable || !handleReleasePendingCart || placing || isPlacedHere) {
    return (
      <WarningMessage>
        <Icon name="warning" />
        <h1>
          {t('CART_STATUS_PENDING_MESSAGE', 'Your order is being processed, please wait a little more. if you\'ve been waiting too long, please reload the page')}
        </h1>
      </WarningMessage>
    )
  }

  return (
    <>
      <WarningMessage data-doc-section='checkout-pending-cart-notice'>
        <Icon name="warning" />
        <PendingCartNoticeContent>
          <h1>{withPaymethod(t('CART_PENDING_PAYMENT_TITLE', 'Your payment with _paymethod_ is still pending'))}</h1>
          <p>{t('CART_PENDING_PAYMENT_DESC', 'If you didn\'t complete the payment, cancel the attempt to pay again.')}</p>
          <Button
            outline
            color='primary'
            data-doc-control='checkout-cancel-payment-attempt'
            disabled={releasingPendingCart}
            onClick={() => setDialog('confirm')}
          >
            {releasingPendingCart
              ? withPaymethod(t('VERIFYING_WITH_PAYMETHOD', 'Verifying with _paymethod_…'))
              : t('CANCEL_PAYMENT_ATTEMPT', 'Cancel payment attempt')}
          </Button>
        </PendingCartNoticeContent>
      </WarningMessage>
      <Confirm
        title={t('CANCEL_PAYMENT_ATTEMPT_QUESTION', 'Cancel the payment attempt?')}
        content={withPaymethod(t('CANCEL_PAYMENT_ATTEMPT_DESC', 'If you didn\'t pay, your cart will be released so you can pay again. If you already paid with _paymethod_, nothing is cancelled: we\'ll create your order.'))}
        cancelText={t('KEEP_WAITING', 'Keep waiting')}
        acceptText={t('YES_CANCEL', 'Yes, cancel')}
        open={dialog === 'confirm'}
        onClose={closeDialog}
        onCancel={closeDialog}
        onAccept={handleRelease}
        closeOnBackdrop={false}
      >
        <p>{withPaymethod(t('CANCEL_PAYMENT_ATTEMPT_CLOSE_TAB', 'If you left the _paymethod_ page open, close it: a payment made there after cancelling won\'t create your order.'))}</p>
      </Confirm>
      <Alert
        title={t('CART_STILL_PENDING_TITLE', 'It can\'t be cancelled yet')}
        content={withPaymethod(t('CART_STILL_PENDING_DESC', '_paymethod_ has a payment in process (for example, a cash payment) or did not respond. Try again in a few minutes.'))}
        acceptText={t('ACCEPT', 'Accept')}
        open={dialog === 'still_pending'}
        onClose={closeDialog}
        onAccept={closeDialog}
        closeOnBackdrop={false}
      />
      <Confirm
        title={t('CANCEL_PAYMENT_ATTEMPT_ERROR_TITLE', 'We couldn\'t connect')}
        content={t('CANCEL_PAYMENT_ATTEMPT_ERROR_DESC', 'Check your connection and try again. Your cart has not changed.')}
        cancelText={t('CLOSE', 'Close')}
        acceptText={t('RETRY', 'Retry')}
        open={dialog === 'error'}
        onClose={closeDialog}
        onCancel={closeDialog}
        onAccept={handleRelease}
        closeOnBackdrop={false}
      />
    </>
  )
}
