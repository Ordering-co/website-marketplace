import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { studentOrderFixture } from '../../__tests__/helpers/giftCardStudentTestMocks'
import { OrderStudentInfo } from '../index'

vi.mock('~components/hooks/useSchoolStudents', () => ({
  useSchoolStudents: () => ({
    students: [studentOrderFixture.student]
  })
}))

describe('OrderStudentInfo', () => {
  it('renders student name from order payload', () => {
    const { getByText } = renderWithProviders(
      <OrderStudentInfo order={studentOrderFixture} />
    )
    expect(getByText('Student')).toBeInTheDocument()
    expect(getByText('Ada Lovelace')).toBeInTheDocument()
    expect(getByText('Room A · 5th')).toBeInTheDocument()
  })

  it('returns null when student is missing', () => {
    const { queryByText } = renderWithProviders(
      <OrderStudentInfo order={{ ...studentOrderFixture, student_id: null, student: null }} />
    )
    expect(queryByText('Student')).not.toBeInTheDocument()
  })
})
