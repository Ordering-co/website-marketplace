import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor, within } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CouponControl } from '../index'

const mocks = vi.hoisted(() => ({
  setConfirm: vi.fn(),
  handleButtonApplyClick: vi.fn(),
  handleLoadOffers: vi.fn(),
  handleOfferApplyClick: vi.fn(),
  handleOfferRemoveClick: vi.fn(),
  controllerProps: {}
}))

vi.mock('~components/components/CouponControl', () => ({
  CouponControl: ({ UIComponent, ...rest }) => (
    <UIComponent
      couponInput='SAVE10'
      couponDefault={null}
      handleButtonApplyClick={mocks.handleButtonApplyClick}
      handleLoadOffers={mocks.handleLoadOffers}
      handleOfferApplyClick={mocks.handleOfferApplyClick}
      handleOfferRemoveClick={mocks.handleOfferRemoveClick}
      handleRemoveCouponClick={vi.fn()}
      onChangeInputCoupon={vi.fn()}
      offersState={{ offers: [], loading: false, error: null }}
      applyingOfferId={null}
      removingOfferId={null}
      canLoadOffers
      cart={{ uuid: 'cart-uuid', offers: [] }}
      confirm={{ open: false, content: [] }}
      setConfirm={mocks.setConfirm}
      {...mocks.controllerProps}
      {...rest}
    />
  )
}))

vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, title, children }) => open
    ? (
      <div role='dialog' aria-label={title}>
        <h2>{title}</h2>
        {children}
      </div>
      )
    : null
}))

vi.mock('~ui/src/components/Confirm', () => ({
  Confirm: () => null
}))

describe('CouponControl', () => {
  afterEach(() => {
    vi.clearAllMocks()
    mocks.controllerProps = {}
  })

  it('opens the selector and loads saved offers', () => {
    const { getByPlaceholderText, getByRole } = renderWithProviders(<CouponControl />)

    fireEvent.click(getByRole('button', { name: /offers and coupons/i }))

    expect(getByRole('dialog', { name: 'Offers and coupons' })).toBeInTheDocument()
    expect(getByPlaceholderText('Discount coupon')).toBeInTheDocument()
    expect(mocks.handleLoadOffers).toHaveBeenCalledOnce()
  })

  it('applies an available saved offer', async () => {
    const offer = {
      id: 15,
      name: 'Lunch reward',
      coupon: 'LUNCH15',
      description: 'Save on your next lunch',
      applicable: true,
      stackable: true,
      rate_type: 1,
      rate: 15
    }
    mocks.controllerProps = {
      offersState: { offers: [offer], loading: false, error: null }
    }
    mocks.handleOfferApplyClick.mockResolvedValue(true)
    const { getByRole, getByText, queryByRole } = renderWithProviders(<CouponControl />)

    fireEvent.click(getByRole('button', { name: /offers and coupons/i }))
    const offerCard = getByText('Lunch reward').closest('article')
    fireEvent.click(within(offerCard).getByRole('button', { name: 'Apply' }))

    expect(mocks.handleOfferApplyClick).toHaveBeenCalledWith(offer)
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('shows applied offers in the current tab and confirms removal', () => {
    const appliedOffer = {
      id: 21,
      name: 'Current lunch reward',
      coupon: 'CURRENT15',
      description: 'Applied to this cart',
      rate_type: 1,
      rate: 15
    }
    mocks.controllerProps = {
      cart: { uuid: 'cart-uuid', offers: [appliedOffer] }
    }
    const { getByRole, getByText } = renderWithProviders(<CouponControl />)

    fireEvent.click(getByRole('button', { name: /offers and coupons/i }))
    fireEvent.click(getByRole('tab', { name: /current offers/i }))

    const offerCard = getByText('Current lunch reward').closest('article')
    fireEvent.click(within(offerCard).getByRole('button', { name: /remove current lunch reward/i }))

    expect(mocks.setConfirm).toHaveBeenCalledWith({
      open: true,
      content: 'Are you sure that you want to delete the offer?'
    })
  })

  it('keeps manual entry for guests without rendering saved offers', () => {
    mocks.controllerProps = { canLoadOffers: false }
    const { getByRole, getByPlaceholderText, queryByText } = renderWithProviders(<CouponControl />)

    fireEvent.click(getByRole('button', { name: /offers and coupons/i }))

    expect(getByPlaceholderText('Discount coupon')).toBeInTheDocument()
    expect(queryByText('Available offers')).not.toBeInTheDocument()
    expect(mocks.handleLoadOffers).not.toHaveBeenCalled()
  })

  it('renders an empty state when there are no saved offers', () => {
    const { getByRole, getByText } = renderWithProviders(<CouponControl />)

    fireEvent.click(getByRole('button', { name: /offers and coupons/i }))

    expect(getByText('No offers available right now')).toBeInTheDocument()
  })

  it('marks the offer list as busy while saved offers load', () => {
    mocks.controllerProps = {
      offersState: { offers: [], loading: true, error: null }
    }
    const { getByRole } = renderWithProviders(<CouponControl />)

    fireEvent.click(getByRole('button', { name: /offers and coupons/i }))

    expect(getByRole('dialog').querySelector('[aria-busy="true"]')).toBeInTheDocument()
  })

  it('lets customers retry when loading offers fails', () => {
    mocks.controllerProps = {
      offersState: { offers: [], loading: false, error: 'NETWORK_ERROR' }
    }
    const { getByRole } = renderWithProviders(<CouponControl />)

    fireEvent.click(getByRole('button', { name: /offers and coupons/i }))
    fireEvent.click(getByRole('button', { name: 'Try again' }))

    expect(mocks.handleLoadOffers).toHaveBeenCalledTimes(2)
  })
})
