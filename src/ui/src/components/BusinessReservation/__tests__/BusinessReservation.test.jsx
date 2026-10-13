import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture } from '../../__tests__/helpers/menuTestMocks'
import { BusinessReservation } from '../index'

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
vi.mock('~ui/src/components/Cart', () => ({
  Cart: () => <div data-testid='cart' />
}))
vi.mock('~ui/src/components/UserDetails', () => ({
  UserDetails: () => <div data-testid='user-details' />
}))

vi.mock('~components/components/BusinessReservation', () => ({
  BusinessReservation: ({ UIComponent, ...rest }) => (
    <UIComponent
      business={businessFixture}
      cart={{ products: [] }}
      reservationState={{ changes: {} }}
      setReservationState={vi.fn()}
      datesList={['2026-07-15']}
      hoursList={[{ value: '12:00', text: '12:00' }]}
      reservationSetting={{
        min_guests_reservation: 2,
        max_guests_reservation: 4,
        allow_preorder_reservation: true,
        late_arrival_hold_minutes: 15
      }}
      handleAddReservation={vi.fn()}
      checkoutFieldsState={{ fields: [] }}
      isCheckout={false}
      isEnabled
      {...rest}
    />
  )
}))

describe('BusinessReservation', () => {
  it('renders reservation date selector', () => {
    const { getAllByTestId } = renderWithProviders(<BusinessReservation />)
    expect(getAllByTestId('react-select').length).toBeGreaterThan(0)
  })
})
