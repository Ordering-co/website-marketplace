import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { pastOrder, getOrderStatus } from '../../../__tests__/helpers/ordersTestMocks'
import { SingleOrderCard } from '../index'

vi.mock('~components/components/SingleOrderCard', () => ({
  SingleOrderCard: ({ UIComponent, ...rest }) => (
    <UIComponent
      order={pastOrder}
      getOrderStatus={getOrderStatus}
      handleReorder={vi.fn()}
      setOrderSelected={vi.fn()}
      onRedirectPage={vi.fn()}
      {...rest}
    />
  )
}))

describe('VerticalOrdersLayout/SingleOrderCard', () => {
  it('renders vertical order card with review and reorder actions', () => {
    const { getByText } = renderWithProviders(<SingleOrderCard />)
    expect(getByText('Pizza Place')).toBeInTheDocument()
    expect(getByText('Review')).toBeInTheDocument()
    expect(getByText('Reorder')).toBeInTheDocument()
  })
})
