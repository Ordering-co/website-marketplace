import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { orderListFixture, pastOrder, activeOrder, paginationFixture, getOrderStatus } from '../../__tests__/helpers/ordersTestMocks'
import { OrdersOption } from '../index'

vi.mock('~components/components/OrderList', () => ({
  OrderList: ({ UIComponent, ...rest }) => (
    <UIComponent
      orderList={{ loading: false, error: null, orders: [pastOrder, activeOrder] }}
      pagination={paginationFixture}
      loading={false}
      error={null}
      reorderState={{ loading: false, error: null, result: null }}
      businesses={{ loading: false, result: [] }}
      products={[]}
      professionals={[]}
      getOrderStatus={getOrderStatus}
      handleReorder={vi.fn()}
      handleUpdateOrderList={vi.fn()}
      loadMoreOrders={vi.fn()}
      {...rest}
    />
  )
}))

vi.mock('~ui/src/components/HorizontalOrdersLayout', () => ({
  HorizontalOrdersLayout: () => <div data-testid='horizontal-layout' />
}))

vi.mock('~ui/src/components/VerticalOrdersLayout', () => ({
  VerticalOrdersLayout: () => <div data-testid='vertical-layout' />
}))

vi.mock('~ui/src/components/OrdersOption/PreviousBusinessOrdered', () => ({
  PreviousBusinessOrdered: () => <div data-testid='previous-business' />
}))

vi.mock('~ui/src/components/OrdersOption/PreviousProductsOrdered', () => ({
  PreviousProductsOrdered: () => <div data-testid='previous-products' />
}))

vi.mock('~ui/src/components/OrdersOption/PreviousProfessionalOrdered', () => ({
  PreviousProfessionalOrdered: () => <div data-testid='previous-professionals' />
}))

describe('OrdersOption', () => {
  it('renders past orders section title', () => {
    const { getByText } = renderWithProviders(
      <OrdersOption
        pastOrders
        onRedirectPage={vi.fn()}
        setIsEmptyPast={vi.fn()}
        setIsEmptyActive={vi.fn()}
        setIsEmptyPreorder={vi.fn()}
      />
    )
    expect(getByText('Past orders')).toBeInTheDocument()
  })
})
