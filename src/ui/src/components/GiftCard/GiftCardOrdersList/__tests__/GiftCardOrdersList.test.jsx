import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { GiftCardOrdersList } from '../index'

vi.mock('~ui/src/components/GiftCard/VerticalGiftCardOrdersLayout', () => ({
  VerticalGiftCardOrdersLayout: ({ title }) => <div data-testid='vertical-layout'>{title}</div>
}))

describe('GiftCardOrdersList', () => {
  it('renders gift card order sections', () => {
    const { getByText } = renderWithProviders(<GiftCardOrdersList />)
    expect(getByText('Pending')).toBeInTheDocument()
    expect(getByText('Sent')).toBeInTheDocument()
    expect(getByText('Redeemed')).toBeInTheDocument()
  })
})
