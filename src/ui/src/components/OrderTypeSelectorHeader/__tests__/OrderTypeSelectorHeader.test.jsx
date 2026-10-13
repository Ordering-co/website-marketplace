import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { OrderTypeSelectorHeader } from '../index'

vi.mock('~ui/src/styles/Select', () => ({
  Select: ({ options = [] }) => (
    <div data-testid='order-type-select'>
      {options.map((opt) => <span key={opt.value}>{opt.content}</span>)}
    </div>
  )
}))

vi.mock('~components/components/OrderTypeControl', () => ({
  OrderTypeControl: ({ UIComponent, ...rest }) => (
    <UIComponent
      handleChangeOrderType={vi.fn()}
      typeSelected={1}
      configTypes={[1, 2]}
      orderTypes={[
        { value: 1, content: 'Delivery', showOnSelected: 'Delivery' },
        { value: 2, content: 'Pickup', showOnSelected: 'Pickup' }
      ]}
      orderTypeList={['delivery', 'pickup']}
      customView
      {...rest}
    />
  )
}))

describe('OrderTypeSelectorHeader', () => {
  it('renders order type selector', () => {
    const { getByTestId } = renderWithProviders(<OrderTypeSelectorHeader />)
    expect(getByTestId('order-type-select')).toBeInTheDocument()
  })
})
