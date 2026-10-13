import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { WeekCalendarPicker } from '../index'

vi.mock('react-calendar/dist/Calendar.css', () => ({}))
vi.mock('react-calendar', () => ({
  default: ({ onChange }) => (
    <button type='button' data-testid='calendar' onClick={() => onChange(new Date(2026, 6, 15))}>
      Calendar
    </button>
  )
}))

describe('WeekCalendarPicker', () => {
  it('renders week calendar picker', () => {
    const { getByTestId } = renderWithProviders(
      <WeekCalendarPicker
        datesList={['2026-07-14', '2026-07-15']}
        handleChangeDate={vi.fn()}
        dateSelected='2026-07-14'
        maxDays={7}
        configs={{}}
      />
    )
    expect(getByTestId('calendar')).toBeInTheDocument()
  })
})
