import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { GiftCardUI } from '../index'

vi.mock('~ui/src/components/GiftCard/PurchaseGiftCard', () => ({
  PurchaseGiftCard: () => <div data-testid='purchase-gift-card-stub' />
}))

vi.mock('~ui/src/components/GiftCard/RedeemGiftCard', () => ({
  RedeemGiftCard: () => <div data-testid='redeem-gift-card-stub' />
}))

describe('GiftCardUI', () => {
  it('renders gift card hero and purchase section', () => {
    const { getAllByText, getByTestId } = renderWithProviders(<GiftCardUI />)
    expect(getAllByText('Gift Card Wallet').length).toBeGreaterThan(0)
    expect(getByTestId('purchase-gift-card-stub')).toBeInTheDocument()
  })

  it('opens redeem popup when redeem is pressed', () => {
    const { getByText, getByTestId } = renderWithProviders(<GiftCardUI />)
    fireEvent.click(getByText('Redeem'))
    expect(getByTestId('redeem-gift-card-stub')).toBeInTheDocument()
  })
})
