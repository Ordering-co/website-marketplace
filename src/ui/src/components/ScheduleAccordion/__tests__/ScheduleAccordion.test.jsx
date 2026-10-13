import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { ScheduleAccordion } from '../index'

describe('ScheduleAccordion', () => {
  it('expands to show hours when clicked', () => {
    const { getByText } = renderWithProviders(
      <ScheduleAccordion
        weekIndex={1}
        schedule={{ enabled: true, lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 17, minute: 0 } }] }}
        timeFormated={(t) => `${t.hour}:${String(t.minute).padStart(2, '0')}`}
      />
    )
    expect(getByText('Monday')).toBeInTheDocument()
    fireEvent.click(getByText('Monday'))
    expect(getByText('9:00 - 17:00')).toBeInTheDocument()
  })

  it('shows closed label when schedule is disabled', () => {
    const { getByText } = renderWithProviders(
      <ScheduleAccordion
        weekIndex={0}
        isDisableAccordion
        schedule={{ enabled: false, lapses: [{ open: { hour: 9, minute: 0 }, close: { hour: 17, minute: 0 } }] }}
        timeFormated={(t) => `${t.hour}:${t.minute}`}
      />
    )
    expect(getByText('Closed')).toBeInTheDocument()
  })
})
