import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { AddressesPopover } from '../index'

vi.mock('react-popper', () => ({
  usePopper: () => ({
    styles: { popper: {}, arrow: {} },
    attributes: { popper: {}, arrow: {} }
  })
}))
vi.mock('~ui/src/components/AddressList', () => ({
  AddressList: () => <div data-testid='address-list' />
}))
vi.mock('~ui/src/components/AddressForm', () => ({
  AddressForm: () => <div data-testid='address-form' />
}))

vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ auth: true, user: { id: 1 }, token: 'test-token' }, { login: vi.fn() }]
}))

describe('AddressesPopover', () => {
  it('renders addresses list for authenticated users', () => {
    window.localStorage.setItem('user-customer', JSON.stringify({ id: 1 }))
    const { getByText, getByTestId } = renderWithProviders(
      <AddressesPopover open auth onClose={vi.fn()} onClick={vi.fn()} />
    )
    expect(getByText('Addresses')).toBeInTheDocument()
    expect(getByTestId('address-list')).toBeInTheDocument()
  })
})
