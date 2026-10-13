import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { purchaseGiftCardFixture } from '../../../__tests__/helpers/giftCardStudentTestMocks'
import { PurchaseGiftCard } from '../index'

vi.mock('~components/components/GiftCard/PurchaseGiftCard', () => ({
  PurchaseGiftCard: ({ UIComponent, ...rest }) => (
    <UIComponent {...purchaseGiftCardFixture} {...rest} />
  )
}))

describe('PurchaseGiftCard', () => {
  it('renders gift card products', () => {
    const { getByText } = renderWithProviders(<PurchaseGiftCard isPage />)
    expect(getByText('Select your gift card')).toBeInTheDocument()
    expect(getByText('$25 Gift Card')).toBeInTheDocument()
    expect(getByText('Purchase')).toBeInTheDocument()
  })

  it('selects product on page mode', () => {
    const handleAccept = vi.fn()
    const { getByText } = renderWithProviders(
      <PurchaseGiftCard isPage handleAccept={handleAccept} />
    )
    fireEvent.click(getByText('$25 Gift Card'))
    expect(handleAccept).toHaveBeenCalled()
  })
})
