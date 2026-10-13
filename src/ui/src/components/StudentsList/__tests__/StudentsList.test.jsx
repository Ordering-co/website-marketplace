import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { sampleStudent, schoolStudentsHookFixture } from '../../__tests__/helpers/giftCardStudentTestMocks'
import { StudentsList } from '../index'

vi.mock('~components/hooks/useSchoolStudents', () => ({
  useSchoolStudents: () => schoolStudentsHookFixture
}))
vi.mock('~ui/src/components/StudentFormModal', () => ({
  StudentFormModal: ({ open }) => (open ? <div data-testid='student-form-modal'>Add student</div> : null)
}))

describe('StudentsList', () => {
  it('renders registered students', () => {
    const { getByText } = renderWithProviders(<StudentsList />)
    expect(getByText('My students')).toBeInTheDocument()
    expect(getByText('Add student')).toBeInTheDocument()
    expect(getByText(/Ada Lovelace/)).toBeInTheDocument()
  })

  it('opens create form when add student is pressed', () => {
    const { getByText, getByTestId } = renderWithProviders(<StudentsList />)
    fireEvent.click(getByText('Add student'))
    expect(getByTestId('student-form-modal')).toBeInTheDocument()
  })

  it('opens edit form when student card is clicked', () => {
    const { getByText, getByTestId } = renderWithProviders(<StudentsList />)
    fireEvent.click(getByText(/Ada Lovelace/))
    expect(getByTestId('student-form-modal')).toBeInTheDocument()
  })
})
