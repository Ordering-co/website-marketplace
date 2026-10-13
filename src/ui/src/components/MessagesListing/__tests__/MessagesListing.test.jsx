import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { orderListFixture } from '../../__tests__/helpers/ordersTestMocks'
import { MessagesListing } from '../index'

vi.mock('~components/components/OrderList', () => ({
  OrderList: ({ UIComponent, ...rest }) => (
    <UIComponent
      orderList={orderListFixture}
      pagination={{ currentPage: 1, totalPages: 1 }}
      loadMoreOrders={vi.fn()}
      handleOrderCardClick={rest.handleOrderCardClick}
      selectedOrderCard={rest.selectedOrderCard}
      small
      {...rest}
    />
  )
}))

vi.mock('~ui/src/components/Messages', () => ({
  Messages: () => <div data-testid='messages-pane'>Messages pane</div>
}))

vi.mock('~components/components/OrderDetails', () => ({
  OrderDetails: ({ UIComponent, ...rest }) => (
    <UIComponent
      order={{ loading: false, order: orderListFixture.orders[0] }}
      messages={[]}
      setMessages={vi.fn()}
      readMessages={vi.fn()}
      {...rest}
    />
  )
}))

beforeEach(() => {
  window.localStorage.setItem('user-customer', JSON.stringify({ id: 1 }))
})

describe('MessagesListing', () => {
  it('renders messages listing header', () => {
    const { getByText } = renderWithProviders(<MessagesListing onRedirectPage={vi.fn()} />)
    expect(getByText('Messages')).toBeInTheDocument()
  })
})
