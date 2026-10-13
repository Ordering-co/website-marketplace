import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { Locations } from '../index'

vi.mock('~components/components/LocationsMap', () => ({
  LocationsMap: () => <div data-testid='locations-map' />
}))

describe('Locations', () => {
  it('renders locations map for businesses with coordinates', () => {
    const { getByTestId } = renderWithProviders(
      <Locations
        businessList={[
          { id: 1, name: 'Demo Cafe', location: { lat: 30.26, lng: -97.74 }, address: '1 Main' }
        ]}
        userLocation={{ lat: 30.25, lng: -97.73 }}
        onBusinessClick={vi.fn()}
      />
    )
    expect(getByTestId('locations-map')).toBeInTheDocument()
  })
})
