import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PhoneAutocomplete } from '../index'

vi.mock('react-select', () => ({
  default: ({ options = [], onChange, value }) => (
    <select
      data-testid='react-select'
      value={value?.value ?? ''}
      onChange={(e) => onChange?.(options.find((o) => String(o.value) === e.target.value))}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))
vi.mock('~ui/src/components/SignUpForm', () => ({
  SignUpForm: () => <div data-testid='signup-form' />
}))
vi.mock('~ui/src/components/AddressList', () => ({
  AddressList: () => <div data-testid='address-list' />
}))
vi.mock('~ui/src/components/UserDetails', () => ({
  UserDetails: () => <div data-testid='user-details' />
}))

vi.mock('~components/components/PhoneAutocomplete', () => ({
  PhoneAutocomplete: ({ UIComponent, ...rest }) => (
    <UIComponent
      phone='5551234'
      customerState={{}}
      customersPhones={{
        users: [{ cellphone: '5551234', phone: '5551234', name: 'Test User' }],
        error: null
      }}
      setCustomersPhones={vi.fn()}
      openModal={false}
      setOpenModal={vi.fn()}
      onChangeNumber={vi.fn()}
      setCustomerState={vi.fn()}
      countryCallingCode='+1'
      orderTypes={[{ value: 1, name: 'Delivery' }]}
      limitPhoneLength={10}
      {...rest}
    />
  )
}))

describe('PhoneAutocomplete', () => {
  it('renders phone autocomplete select', () => {
    const { getByTestId } = renderWithProviders(<PhoneAutocomplete />)
    expect(getByTestId('react-select')).toBeInTheDocument()
  })
})
