import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { orderListFixture, pastOrder, paginationFixture } from '../../__tests__/helpers/ordersTestMocks'
import { LastOrders } from '../index'

vi.mock('~components/components/OrderList', () => ({
  OrderList: ({ UIComponent, ...rest }) => (
    <UIComponent
      orderList={orderListFixture}
      pagination={paginationFixture}
      {...rest}
    />
  )
}))

describe('LastOrders', () => {
  it('renders last order section with business name', () => {
    const { getByText } = renderWithProviders(<LastOrders onRedirect={vi.fn()} />)
    expect(getByText('Last order')).toBeInTheDocument()
    expect(getByText('Pizza Place')).toBeInTheDocument()
  })
})
