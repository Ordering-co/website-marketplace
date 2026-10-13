import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PreorderDateTimeSteps } from '../index'

vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
  SwiperSlide: ({ children, onClick }) => (
    <div data-testid='swiper-slide' onClick={onClick}>{children}</div>
  )
}))
vi.mock('swiper/modules', () => ({ Navigation: {}, Thumbs: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('../WeekCalendarPicker', () => ({
  WeekCalendarPicker: () => <div data-testid='week-picker' />
}))

const formatTimeDisplay = (text) => {
  const [hours, minutes] = String(text).split(':')
  return { hours, minutes, period: 'AM' }
}

describe('PreorderDateTimeSteps', () => {
  it('renders date and time step headers', () => {
    const { getByText } = renderWithProviders(
      <PreorderDateTimeSteps
        datesList={['2026-07-15']}
        dateSelected='2026-07-15'
        timeSelected='12:00'
        timeList={[{ value: '12:00', text: '12:00' }]}
        isEnabled
        formatTimeDisplay={formatTimeDisplay}
        handleChangeDate={vi.fn()}
        handleChangeTime={vi.fn()}
        business={{ id: 1 }}
        hasExistingMoment
      />
    )
    expect(getByText('Choose Date')).toBeInTheDocument()
    expect(getByText('Choose Time')).toBeInTheDocument()
  })

  it('calls handleChangeTime when a time slot is clicked', () => {
    const handleChangeTime = vi.fn()
    const { getByText } = renderWithProviders(
      <PreorderDateTimeSteps
        datesList={['2026-07-15']}
        dateSelected='2026-07-15'
        timeSelected=''
        timeList={[{ value: '12:00', text: '12:00' }]}
        isEnabled
        formatTimeDisplay={formatTimeDisplay}
        handleChangeDate={vi.fn()}
        handleChangeTime={handleChangeTime}
        business={{ id: 1 }}
        hasExistingMoment
      />
    )
    fireEvent.click(getByText('Choose Time').closest('button'))
    fireEvent.click(getByText('12:00 AM'))
    expect(handleChangeTime).toHaveBeenCalledWith('12:00')
  })
})
