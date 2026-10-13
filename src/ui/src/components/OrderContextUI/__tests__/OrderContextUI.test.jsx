import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { OrderContextUI } from '../index'

vi.mock('~ui/src/components/OrderTypeSelectorHeader', () => ({
  OrderTypeSelectorHeader: () => <div data-testid='order-type-header' />
}))
vi.mock('~ui/src/components/OrderTypeSelectorContent', () => ({
  OrderTypeSelectorContent: () => <div data-testid='order-type-content' />
}))
vi.mock('~ui/src/components/MomentPopover', () => ({
  MomentPopover: () => <div data-testid='moment-popover' />
}))
vi.mock('~ui/src/components/MomentContent', () => ({
  MomentContent: () => <div data-testid='moment-content' />
}))
vi.mock('~ui/src/components/AddressForm', () => ({
  AddressForm: () => <div data-testid='address-form' />
}))
vi.mock('~ui/src/components/AddressList', () => ({
  AddressList: () => <div data-testid='address-list' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null)
}))

describe('OrderContextUI', () => {
  it('renders delivery address prompt and order type header', () => {
    window.localStorage.setItem('user-customer', JSON.stringify({ id: 1 }))
    const { getByText, getByTestId } = renderWithProviders(<OrderContextUI />)
    expect(getByText('Where do we delivery?')).toBeInTheDocument()
    expect(getByTestId('order-type-header')).toBeInTheDocument()
    expect(getByTestId('moment-popover')).toBeInTheDocument()
  })
})
