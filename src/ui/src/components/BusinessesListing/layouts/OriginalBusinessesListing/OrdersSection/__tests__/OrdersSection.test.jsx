import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../../../__tests__/helpers/testUtils'
import { OrdersSection } from '../index'

vi.mock('~ui/src/components/OrdersOption', () => ({
  OrdersOption: ({ titleContent, activeOrders, pastOrders }) => (
    <div
      data-testid='orders-option'
      data-title={titleContent}
      data-active={String(!!activeOrders)}
      data-past={String(!!pastOrders)}
    />
  )
}))

describe('OrdersSection', () => {
  it('renders open carts, active, and past order sections', () => {
    const { getAllByTestId } = renderWithProviders(
      <OrdersSection
        onRedirectPage={vi.fn()}
        businessesIds={[1]}
        getCustomArray={() => []}
        businessesList={{ loading: false, businesses: [] }}
        titleContent='Previous orders'
      />
    )
    const options = getAllByTestId('orders-option')
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveAttribute('data-title', 'Open carts')
    expect(options[1]).toHaveAttribute('data-active', 'true')
    expect(options[2]).toHaveAttribute('data-past', 'true')
  })

  it('renders nothing without onRedirectPage', () => {
    const { queryByTestId } = renderWithProviders(
      <OrdersSection
        businessesList={{ loading: false, businesses: [] }}
        getCustomArray={() => []}
      />
    )
    expect(queryByTestId('orders-option')).not.toBeInTheDocument()
  })
})
