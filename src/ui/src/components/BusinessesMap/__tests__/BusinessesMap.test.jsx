import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { BusinessesMap } from '../index'

vi.mock('~components/components/BusinessesMap', () => ({
  BusinessesMap: ({ UIComponent, ...rest }) => (
    <UIComponent
      userLocation={{ lat: 30.26, lng: -97.74 }}
      businessLocations={[{ lat: 30.27, lng: -97.75, id: 1 }]}
      onBusinessClick={vi.fn()}
      setErrors={vi.fn()}
      {...rest}
    />
  )
}))
vi.mock('~components/components/GoogleMaps', () => ({
  GoogleMaps: () => <div data-testid='google-maps' />
}))

describe('BusinessesMap', () => {
  it('renders map wrapper with google maps', () => {
    const { getByTestId } = renderWithProviders(<BusinessesMap />)
    expect(getByTestId('google-maps')).toBeInTheDocument()
  })
})
