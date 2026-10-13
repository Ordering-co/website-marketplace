import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { AddressOrderType } from '../index'

vi.mock('@loadable/component', () => ({
  default: (loader) => {
    const Component = () => <div data-testid='loadable' />
    Component.load = loader
    return Component
  }
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null)
}))

vi.mock('~components/components/OrderTypeControl', () => ({
  OrderTypeControl: ({ UIComponent, ...rest }) => (
    <UIComponent
      handleChangeOrderType={vi.fn()}
      configTypes={[1, 2]}
      typeSelected={1}
      orderTypes={[
        { value: 1, text: 'DELIVERY', textDisplay: 'Delivery' },
        { value: 2, text: 'PICKUP', textDisplay: 'Pickup' }
      ]}
      setOrderTypeValue={vi.fn()}
      hideOrderTypes={false}
      {...rest}
    />
  )
}))

describe('AddressOrderType', () => {
  it('renders order type options', () => {
    const { getByText } = renderWithProviders(<AddressOrderType />)
    expect(getByText('Delivery')).toBeInTheDocument()
    expect(getByText('Pickup')).toBeInTheDocument()
  })
})
