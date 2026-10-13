import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { DatePickerUI } from '../index'

vi.mock('react-date-range/dist/styles.css', () => ({}))
vi.mock('react-date-range/dist/theme/default.css', () => ({}))
vi.mock('react-date-range', () => ({
  Calendar: () => <div data-testid='date-picker'>Calendar</div>
}))

describe('DatePicker', () => {
  it('renders calendar picker', () => {
    const { getByTestId } = renderWithProviders(
      <DatePickerUI value={new Date('2026-07-01')} onChange={vi.fn()} />
    )
    expect(getByTestId('date-picker')).toBeInTheDocument()
  })
})
