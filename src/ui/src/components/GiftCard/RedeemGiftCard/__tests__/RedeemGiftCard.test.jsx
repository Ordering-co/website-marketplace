import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { redeemGiftCardFixture } from '../../../__tests__/helpers/giftCardStudentTestMocks'
import { RedeemGiftCard } from '../index'

vi.mock('~components/components/GiftCard/RedeemGiftCard', () => ({
  RedeemGiftCard: ({ UIComponent, ...rest }) => (
    <UIComponent {...redeemGiftCardFixture} {...rest} />
  )
}))

describe('RedeemGiftCard', () => {
  it('renders redeem form fields', () => {
    const { getByText } = renderWithProviders(<RedeemGiftCard onClose={vi.fn()} />)
    expect(getByText('Redeem a gift card')).toBeInTheDocument()
    expect(getByText('Apply to your balance')).toBeInTheDocument()
  })

  it('shows redeemed gift card summary', () => {
    const { getByText } = renderWithProviders(
      <RedeemGiftCard
        onClose={vi.fn()}
        redeemedGiftCard={{
          type: 'digital',
          amount: 25,
          receiver: { name: 'Jane', lastname: 'Doe' },
          title: 'Happy Birthday',
          message: 'Enjoy!'
        }}
      />
    )
    expect(getByText('Gift card')).toBeInTheDocument()
    expect(getByText(/Jane Doe/)).toBeInTheDocument()
    fireEvent.click(getByText('Ok'))
  })
})
