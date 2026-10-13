import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import {
  giftCardPaginationFixture,
  giftCardsListFixture
} from '../../../__tests__/helpers/giftCardStudentTestMocks'
import { VerticalGiftCardOrdersLayout } from '../index'

vi.mock('~components/components/GiftCard/GiftCardOrdersList', () => ({
  GiftCardOrdersList: ({ UIComponent, ...rest }) => (
    <UIComponent
      giftCards={giftCardsListFixture}
      paginationProps={giftCardPaginationFixture}
      loadMoreOrders={vi.fn()}
      title='Pending'
      setIsEmpty={vi.fn()}
      {...rest}
    />
  )
}))

describe('VerticalGiftCardOrdersLayout', () => {
  it('renders gift card list with title', () => {
    const { getAllByText, getByText } = renderWithProviders(
      <VerticalGiftCardOrdersLayout title='Pending' defaultStatus='pending' setIsEmpty={vi.fn()} />
    )
    expect(getAllByText('Pending').length).toBeGreaterThan(0)
    expect(getByText('$25 Gift Card')).toBeInTheDocument()
  })

  it('shows load more when more pages exist', () => {
    const loadMoreOrders = vi.fn()
    const { getByText } = renderWithProviders(
      <VerticalGiftCardOrdersLayout
        title='Pending'
        defaultStatus='pending'
        setIsEmpty={vi.fn()}
        paginationProps={{ totalPages: 3, currentPage: 1 }}
        loadMoreOrders={loadMoreOrders}
        giftCards={giftCardsListFixture}
      />
    )
    fireEvent.click(getByText('Load more orders'))
    expect(loadMoreOrders).toHaveBeenCalled()
  })
})
