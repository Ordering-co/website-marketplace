import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture } from '../../__tests__/helpers/menuTestMocks'
import { BusinessBasicInformation } from '../index'

vi.mock('dayjs', () => {
  function dayjs (value) {
    return {
      tz: () => dayjs(value),
      format: () => '2026-07-15',
      isBetween: () => true,
      isValid: () => true,
      extend: () => {}
    }
  }
  dayjs.extend = () => {}
  dayjs.tz = (value) => dayjs(value)
  dayjs.prototype = {
    tz () { return this },
    isValid () { return true },
    format () { return '2026-07-15' }
  }
  return { default: dayjs }
})
vi.mock('dayjs/plugin/utc', () => ({ default: () => {} }))
vi.mock('dayjs/plugin/timezone', () => ({ default: () => {} }))
vi.mock('dayjs/plugin/isBetween', () => ({ default: () => {} }))
vi.mock('dayjs/plugin/isSameOrAfter', () => ({ default: () => {} }))
vi.mock('~components/constants/timezones', () => ({
  TIMEZONES: {},
  createDayjsWithTimezone: () => ({
    format: () => '2026-07-15',
    day: () => 3,
    tz () { return this }
  }),
  parseBusinessDateTime: () => null,
  getPreorderMaxDate: () => new Date('2026-12-31')
}))
vi.mock('~components/components/BusinessController', () => ({
  BusinessController: () => null
}))
vi.mock('~ui/src/components/MomentContent', () => ({
  MomentContent: () => null
}))
vi.mock('~ui/src/components/BusinessInformation', () => ({
  BusinessInformation: () => <div data-testid='business-information' />
}))
vi.mock('~ui/src/components/BusinessReviews', () => ({
  BusinessReviews: () => <div data-testid='business-reviews' />
}))
vi.mock('~ui/src/components/BusinessPreorder', () => ({
  BusinessPreorder: () => <div data-testid='business-preorder' />
}))
vi.mock('~ui/src/components/SearchProducts', () => ({
  SearchProducts: () => <div data-testid='search-products' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))

describe('BusinessBasicInformation', () => {
  it('renders store name from business state', () => {
    const { getByText } = renderWithProviders(
      <BusinessBasicInformation
        businessState={{ business: businessFixture, loading: false }}
        openBusinessInformation={false}
        setOpenBusinessInformation={vi.fn()}
      />
    )
    expect(getByText('Demo Store')).toBeInTheDocument()
  })
})
