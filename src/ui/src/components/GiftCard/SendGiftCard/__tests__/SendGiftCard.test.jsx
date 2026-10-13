import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { sendGiftCardFixture } from '../../../__tests__/helpers/giftCardStudentTestMocks'
import { SendGiftCard } from '../index'

vi.mock('~components/components/GiftCard/SendGiftCard', () => ({
  SendGiftCard: ({ UIComponent, ...rest }) => (
    <UIComponent {...sendGiftCardFixture} {...rest} />
  )
}))

describe('SendGiftCard', () => {
  it('renders send gift card form', () => {
    const { getByText } = renderWithProviders(<SendGiftCard />)
    expect(getByText('Gift Card details')).toBeInTheDocument()
    expect(getByText('Send gift card')).toBeInTheDocument()
  })
})
