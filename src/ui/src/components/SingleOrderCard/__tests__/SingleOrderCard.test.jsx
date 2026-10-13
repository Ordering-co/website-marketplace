import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { pastOrder, getOrderStatus } from '../../__tests__/helpers/ordersTestMocks'
import { SingleOrderCard } from '../index'

vi.mock('~components/components/SingleOrderCard', () => ({
  SingleOrderCard: ({ UIComponent, ...rest }) => (
    <UIComponent
      order={pastOrder}
      pastOrders
      getOrderStatus={getOrderStatus}
      handleReorder={vi.fn()}
      onRedirectPage={vi.fn()}
      {...rest}
    />
  )
}))

vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ children }) => <div>{children}</div>
}))

vi.mock('~ui/src/components/Confirm', () => ({
  Confirm: () => null
}))

vi.mock('~ui/src/components/ReviewOrder', () => ({
  ReviewOrder: () => null
}))

vi.mock('~ui/src/components/ReviewProduct', () => ({
  ReviewProduct: () => null
}))

vi.mock('~ui/src/components/ReviewDriver', () => ({
  ReviewDriver: () => null
}))

describe('SingleOrderCard', () => {
  it('renders business name and reorder action', () => {
    const { getByText } = renderWithProviders(<SingleOrderCard />)
    expect(getByText('Pizza Place')).toBeInTheDocument()
    expect(getByText('Reorder')).toBeInTheDocument()
  })
})
