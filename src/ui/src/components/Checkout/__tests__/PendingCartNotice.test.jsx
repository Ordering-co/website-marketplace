import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { useToast } from '~components/contexts/ToastContext'
import { PendingCartNotice } from '../PendingCartNotice'

const [, { showToast }] = useToast()

const renderNotice = (props = {}) => renderWithProviders(
  <PendingCartNotice
    isCartPending
    paymethodName='Mercado Pago'
    isPendingCartReleasable
    releasingPendingCart={false}
    handleReleasePendingCart={vi.fn()}
    handleOrderRedirect={vi.fn()}
    onReleased={vi.fn()}
    {...props}
  />
)

const confirmRelease = (utils) => {
  fireEvent.click(utils.getByText('Cancel payment attempt'))
  fireEvent.click(utils.getByText('Yes, cancel'))
}

describe('PendingCartNotice', () => {
  beforeEach(() => {
    showToast.mockClear()
  })

  it('keeps the generic pending message when the cart is not releasable', () => {
    const { getByText, queryByText } = renderNotice({ isPendingCartReleasable: false })
    expect(getByText(/Your order is being processed/)).toBeInTheDocument()
    expect(queryByText('Cancel payment attempt')).not.toBeInTheDocument()
  })

  it('keeps the generic pending message when the controller has no release handler', () => {
    const { queryByText } = renderNotice({ handleReleasePendingCart: undefined })
    expect(queryByText('Cancel payment attempt')).not.toBeInTheDocument()
  })

  it('hides the release option for a cart placed from this page until the customer comes back', () => {
    const props = {
      paymethodName: 'Mercado Pago',
      releasingPendingCart: false,
      handleReleasePendingCart: vi.fn()
    }
    // Before the place: the cart is not pending yet and nothing is shown
    const { rerender, container, getByText, queryByText } = renderWithProviders(
      <PendingCartNotice {...props} isCartPending={false} isPendingCartReleasable={false} placing={false} />
    )
    expect(container).toBeEmptyDOMElement()

    rerender(<PendingCartNotice {...props} isCartPending={false} isPendingCartReleasable={false} placing />)
    expect(container).toBeEmptyDOMElement()

    // The place ends and the cart turns pending in the same render
    rerender(<PendingCartNotice {...props} isCartPending isPendingCartReleasable placing={false} />)
    expect(queryByText('Cancel payment attempt')).not.toBeInTheDocument()
    expect(getByText(/Your order is being processed/)).toBeInTheDocument()

    const pageShow = new Event('pageshow')
    pageShow.persisted = true
    act(() => { window.dispatchEvent(pageShow) })
    expect(getByText('Cancel payment attempt')).toBeInTheDocument()
  })

  it('renders nothing when the cart is not pending', () => {
    const { container } = renderNotice({ isCartPending: false })
    expect(container).toBeEmptyDOMElement()
  })

  it('names the paymethod and asks for confirmation before releasing', () => {
    const handleReleasePendingCart = vi.fn()
    const utils = renderNotice({ handleReleasePendingCart })
    expect(utils.getByText('Your payment with Mercado Pago is still pending')).toBeInTheDocument()
    fireEvent.click(utils.getByText('Cancel payment attempt'))
    expect(utils.getByTestId('confirm')).toHaveTextContent('If you already paid with Mercado Pago')
    expect(handleReleasePendingCart).not.toHaveBeenCalled()
  })

  it('disables the button and shows the verifying label while releasing', () => {
    const { getByText } = renderNotice({ releasingPendingCart: true })
    expect(getByText('Verifying with Mercado Pago…').closest('button')).toBeDisabled()
  })

  it('notifies the checkout when the cart was released', async () => {
    const onReleased = vi.fn()
    const handleReleasePendingCart = vi.fn().mockResolvedValue({ outcome: 'released' })
    const utils = renderNotice({ handleReleasePendingCart, onReleased })
    confirmRelease(utils)
    await waitFor(() => expect(onReleased).toHaveBeenCalledTimes(1))
    expect(utils.queryByTestId('confirm')).not.toBeInTheDocument()
    expect(utils.queryByTestId('alert')).not.toBeInTheDocument()
  })

  it('redirects to the order when an approved payment was found', async () => {
    const handleOrderRedirect = vi.fn()
    const handleReleasePendingCart = vi.fn().mockResolvedValue({ outcome: 'order_created', order: { uuid: 'order-1' } })
    const utils = renderNotice({ handleReleasePendingCart, handleOrderRedirect })
    confirmRelease(utils)
    await waitFor(() => expect(handleOrderRedirect).toHaveBeenCalledWith('order-1'))
    expect(showToast).toHaveBeenCalledWith('success', 'We found your payment with Mercado Pago and created your order.')
  })

  it('explains that the cart cannot be released yet when it is still pending', async () => {
    const onReleased = vi.fn()
    const handleReleasePendingCart = vi.fn().mockResolvedValue({ outcome: 'still_pending' })
    const utils = renderNotice({ handleReleasePendingCart, onReleased })
    confirmRelease(utils)
    expect(await utils.findByTestId('alert')).toHaveTextContent('Mercado Pago has a payment in process')
    expect(onReleased).not.toHaveBeenCalled()
  })

  it('offers a retry when the request fails', async () => {
    const handleReleasePendingCart = vi.fn()
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({ outcome: 'error' })
    const utils = renderNotice({ handleReleasePendingCart })
    confirmRelease(utils)
    expect(await utils.findByTestId('confirm')).toHaveTextContent('Check your connection and try again')
    fireEvent.click(utils.getByText('Retry'))
    await waitFor(() => expect(handleReleasePendingCart).toHaveBeenCalledTimes(2))
    expect(await utils.findByTestId('confirm')).toHaveTextContent('Check your connection and try again')
  })

  it('falls back to a generic paymethod name', () => {
    const { getByText } = renderNotice({ paymethodName: undefined })
    expect(getByText('Your payment with the payment gateway is still pending')).toBeInTheDocument()
  })
})
