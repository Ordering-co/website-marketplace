import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { BusinessesListing } from '../index'

vi.mock('../layouts/OriginalBusinessesListing', () => ({
  OriginalBusinessesListing: () => <div data-testid='original-listing' />
}))
vi.mock('../layouts/AppointmentsBusinessListing', () => ({
  AppointmentsBusinessListing: () => <div data-testid='appointments-listing' />
}))

describe('BusinessesListing', () => {
  it('renders original layout by default', () => {
    const { getByTestId } = renderWithProviders(<BusinessesListing />)
    expect(getByTestId('original-listing')).toBeInTheDocument()
  })

  it('renders appointments layout when theme says so', () => {
    const theme = {
      colors: { primary: '#000', white: '#fff', backgroundPage: '#fff' },
      fonts: { primary: { name: 'Helvetica', weights: [400] } },
      business_listing_view: { components: { layout: { type: 'appointments' } } }
    }
    const { getByTestId, queryByTestId } = renderWithProviders(<BusinessesListing />, { theme })
    expect(getByTestId('appointments-listing')).toBeInTheDocument()
    expect(queryByTestId('original-listing')).not.toBeInTheDocument()
  })
})
