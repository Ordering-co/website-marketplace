import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { GoogleGpsButton } from '../index'

vi.mock('~components/components/GpsButton', () => ({
  GpsButton: ({ UIComponent, ...rest }) => (
    <UIComponent
      handleGPS={vi.fn()}
      isGoogleButton
      googleReady
      isLoading={false}
      IconButton={() => <span>GPS</span>}
      {...rest}
    />
  )
}))

describe('GoogleGpsButton', () => {
  it('renders gps button label', () => {
    const { getByText } = renderWithProviders(<GoogleGpsButton />)
    expect(getByText('GPS')).toBeInTheDocument()
  })
})
