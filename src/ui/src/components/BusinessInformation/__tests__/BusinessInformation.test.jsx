import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { BusinessInformation } from '../index'

const businessFixture = vi.hoisted(() => ({
  id: 1,
  name: 'Demo Store',
  slug: 'demo-store',
  logo: 'logo.png',
  enabled: true
}))

vi.mock('~components/components/GoogleMaps', () => ({
  GoogleMaps: () => <div data-testid='google-maps' />
}))
vi.mock('~ui/src/components/ScheduleAccordion', () => ({
  ScheduleAccordion: () => <div data-testid='schedule-accordion' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))

vi.mock('~components/components/BusinessInformation', () => ({
  BusinessInformation: ({ UIComponent, ...rest }) => (
    <UIComponent
      business={businessFixture}
      businessLocation={{ lat: 1, lng: 2 }}
      businessSchedule={[{ enabled: true, lapses: [] }]}
      businessPhotos={[]}
      businessVideos={[]}
      onClose={vi.fn()}
      {...rest}
    />
  )
}))

describe('BusinessInformation', () => {
  it('renders business name and schedule section', () => {
    const { getByText, getByTestId } = renderWithProviders(<BusinessInformation />)
    expect(getByText('Demo Store')).toBeInTheDocument()
    expect(getByTestId('schedule-accordion')).toBeInTheDocument()
  })
})
