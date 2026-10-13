import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../../__tests__/helpers/testUtils'
import { CustomLayout } from '../index'

vi.mock('react-calendar/dist/Calendar.css', () => ({}))
vi.mock('react-calendar', () => ({
  default: ({ onChange }) => (
    <button type='button' data-testid='calendar' onClick={() => onChange(new Date(2026, 6, 15))}>
      Calendar
    </button>
  )
}))

describe('CustomLayout', () => {
  it('renders calendar and time slots', () => {
    const handleChangeDate = vi.fn()
    const handleChangeTime = vi.fn()
    const { getByTestId, getByText } = renderWithProviders(
      <CustomLayout
        datesList={['2026-07-14', '2026-07-15']}
        handleChangeDate={handleChangeDate}
        isEnabled
        timeList={[{ value: '10:00', text: '10:00 AM' }]}
        timeSelected='10:00'
        handleChangeTime={handleChangeTime}
      />
    )
    expect(getByTestId('calendar')).toBeInTheDocument()
    fireEvent.click(getByText('10:00 AM'))
    expect(handleChangeTime).toHaveBeenCalledWith('10:00')
  })
})
