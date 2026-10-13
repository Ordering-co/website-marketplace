import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { activeOrder, orderListFixture } from '../../__tests__/helpers/ordersTestMocks'
import { OrderProgress } from '../index'

vi.mock('~components/components/OrderList', () => ({
  OrderList: ({ UIComponent, ...rest }) => (
    <UIComponent orderList={{ ...orderListFixture, orders: [activeOrder] }} {...rest} />
  )
}))

describe('OrderProgress', () => {
  it('renders in-progress order banner', () => {
    const { getByText } = renderWithProviders(<OrderProgress />)
    expect(getByText('Order in progress')).toBeInTheDocument()
    expect(getByText('Go to my orders')).toBeInTheDocument()
  })
})
