import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import {
  giftCardPaginationFixture,
  giftCardsListFixture
} from '../../../__tests__/helpers/giftCardStudentTestMocks'
import { HorizontalGiftCardOrdersLayout } from '../index'

vi.mock('~components/components/GiftCard/GiftCardOrdersList', () => ({
  GiftCardOrdersList: ({ UIComponent, ...rest }) => (
    <UIComponent
      giftCards={giftCardsListFixture}
      paginationProps={giftCardPaginationFixture}
      goToPage={vi.fn()}
      title='Sent'
      setIsEmpty={vi.fn()}
      scrollId='sentGifts'
      {...rest}
    />
  )
}))

vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>
}))

vi.mock('~ui/src/components/Pagination', () => ({
  Pagination: () => <div data-testid='pagination' />
}))

describe('HorizontalGiftCardOrdersLayout', () => {
  it('renders horizontal gift card list with title', () => {
    const { getByText } = renderWithProviders(
      <HorizontalGiftCardOrdersLayout title='Sent' defaultStatus='sent' setIsEmpty={vi.fn()} scrollId='sentGifts' />
    )
    expect(getByText('Sent')).toBeInTheDocument()
    expect(getByText('$25 Gift Card')).toBeInTheDocument()
  })
})
