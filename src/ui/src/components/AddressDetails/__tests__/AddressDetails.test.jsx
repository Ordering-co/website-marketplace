import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { addressFixture } from '../../__tests__/helpers/cartTestMocks'
import { AddressDetails } from '../index'

vi.mock('~ui/src/components/AddressList', () => ({
  AddressList: () => <div data-testid='address-list' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))

vi.mock('~components/components/AddressDetails', () => ({
  AddressDetails: ({ UIComponent, ...rest }) => (
    <UIComponent
      addressToShow={addressFixture.address}
      googleMapsUrl='https://maps.example.com/static.png'
      apiKey='test-key'
      isCartPending={false}
      {...rest}
    />
  )
}))

describe('AddressDetails', () => {
  it('renders address and map toggle', () => {
    const { getByText } = renderWithProviders(<AddressDetails />)
    expect(getByText('Delivery Address')).toBeInTheDocument()
    expect(getByText('123 Main St')).toBeInTheDocument()
    fireEvent.click(getByText('Show map'))
    expect(document.getElementById('google-maps-image')).toBeInTheDocument()
  })
})
