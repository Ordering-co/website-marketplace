import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import {
  sampleStudent,
  secondStudent,
  schoolBusinessFixture,
  schoolStudentsHookFixture
} from '../../__tests__/helpers/giftCardStudentTestMocks'
import { StudentOnboardingPopup } from '../index'

const setStudentId = vi.hoisted(() => vi.fn())

vi.mock('~components/hooks/useSchoolStudents', () => ({
  useSchoolStudents: () => schoolStudentsHookFixture
}))
vi.mock('~components/hooks/useSelectedStudent', () => ({
  useSelectedStudent: () => ({ studentId: null, setStudentId })
}))
vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ auth: true, user: { id: 1 }, token: 'token' }, { login: vi.fn() }]
}))
vi.mock('~ui/src/components/StudentFormModal', () => ({
  StudentFormModal: ({ open }) => (open ? <div data-testid='student-form-modal' /> : null)
}))

describe('StudentOnboardingPopup', () => {
  it('renders student picker when forced open', () => {
    const { getByText } = renderWithProviders(
      <StudentOnboardingPopup
        business={schoolBusinessFixture}
        forceOpen
        onForceClose={vi.fn()}
      />
    )
    expect(getByText('Who are you ordering for?')).toBeInTheDocument()
    expect(getByText('Ada Lovelace')).toBeInTheDocument()
    expect(getByText('Grace Hopper')).toBeInTheDocument()
  })

  it('selects student and closes popup', () => {
    const onForceClose = vi.fn()
    const { getByText } = renderWithProviders(
      <StudentOnboardingPopup
        business={schoolBusinessFixture}
        forceOpen
        onForceClose={onForceClose}
      />
    )
    fireEvent.click(getByText('Ada Lovelace'))
    expect(setStudentId).toHaveBeenCalledWith(sampleStudent.id)
    expect(onForceClose).toHaveBeenCalled()
  })

  it('opens create form from popup', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <StudentOnboardingPopup
        business={schoolBusinessFixture}
        forceOpen
        onForceClose={vi.fn()}
      />
    )
    fireEvent.click(getByText('Add student'))
    expect(getByTestId('student-form-modal')).toBeInTheDocument()
  })
})
