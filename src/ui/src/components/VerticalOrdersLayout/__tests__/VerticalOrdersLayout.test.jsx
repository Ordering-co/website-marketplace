import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { pastOrder, paginationFixture, getOrderStatus } from '../../__tests__/helpers/ordersTestMocks'
import { VerticalOrdersLayout } from '../index'

vi.mock('~ui/src/components/SingleOrderCard', () => ({
  SingleOrderCard: ({ order }) => <div data-testid='order-card'>{order.business.name}</div>
}))

vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ children, open }) => (open ? <div data-testid='review-modal'>{children}</div> : null)
}))

vi.mock('~ui/src/components/ReviewOrder', () => ({
  ReviewOrder: () => <div>Review order modal</div>
}))

vi.mock('~ui/src/components/ReviewProduct', () => ({
  ReviewProduct: () => null
}))

vi.mock('~ui/src/components/ReviewDriver', () => ({
  ReviewDriver: () => null
}))

describe('VerticalOrdersLayout', () => {
  it('renders orders and load more button', () => {
    const { getByText } = renderWithProviders(
      <VerticalOrdersLayout
        orders={[pastOrder]}
        pagination={paginationFixture}
        loadMoreOrders={vi.fn()}
        getOrderStatus={getOrderStatus}
        handleUpdateOrderList={vi.fn()}
        setRefreshOrders={vi.fn()}
      />
    )
    expect(getByText('Pizza Place')).toBeInTheDocument()
    expect(getByText('Load more orders')).toBeInTheDocument()
  })
})
