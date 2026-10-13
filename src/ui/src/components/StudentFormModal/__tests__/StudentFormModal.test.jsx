import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import {
  sampleSchool,
  sampleStudent,
  schoolsHookFixture,
  schoolStudentsHookFixture
} from '../../__tests__/helpers/giftCardStudentTestMocks'
import { StudentFormModal } from '../index'

const mocks = vi.hoisted(() => ({
  schools: null,
  showToast: vi.fn()
}))

vi.mock('~components/hooks/useSchools', () => ({
  useSchools: () => mocks.schools
}))
vi.mock('~components/hooks/useSchoolStudents', () => ({
  useSchoolStudents: () => schoolStudentsHookFixture
}))
vi.mock('~components/contexts/ToastContext', () => ({
  ToastType: { Error: 'error', Success: 'success' },
  useToast: () => [{}, { showToast: mocks.showToast }]
}))
vi.mock('~ui/src/styles/Select', () => ({
  Select: ({ placeholder, options = [], onChange }) => (
    <div data-testid='select'>
      <span>{placeholder}</span>
      {options.map((opt) => (
        <button key={opt.value} type='button' onClick={() => onChange(opt.value)}>{opt.content}</button>
      ))}
    </div>
  )
}))

const fillRequiredFields = (utils) => {
  fireEvent.change(utils.getByPlaceholderText('Name'), { target: { value: 'Ada' } })
  fireEvent.change(utils.getByPlaceholderText('Lastname'), { target: { value: 'Lovelace' } })
  fireEvent.click(utils.getByText('Room A'))
}

describe('StudentFormModal', () => {
  beforeEach(() => {
    mocks.schools = schoolsHookFixture
    mocks.showToast.mockReset()
    schoolStudentsHookFixture.createStudent.mockClear()
  })

  it('renders add student form fields', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <StudentFormModal open onClose={vi.fn()} onSaved={vi.fn()} defaultSchoolId={sampleSchool.id} />
    )
    expect(getByText('Add student')).toBeInTheDocument()
    expect(getByText('Select a school')).toBeInTheDocument()
    expect(getByPlaceholderText('Name')).toBeInTheDocument()
    expect(getByText('Save')).toBeInTheDocument()
  })

  it('requires a grade before creating the student', async () => {
    const utils = renderWithProviders(
      <StudentFormModal open onClose={vi.fn()} onSaved={vi.fn()} defaultSchoolId={sampleSchool.id} />
    )
    fillRequiredFields(utils)
    fireEvent.click(utils.getByText('Save'))
    await waitFor(() => expect(mocks.showToast).toHaveBeenCalledWith('error', 'Grade is required'))
    expect(schoolStudentsHookFixture.createStudent).not.toHaveBeenCalled()
  })

  it('creates the student with the picked grade', async () => {
    const utils = renderWithProviders(
      <StudentFormModal open onClose={vi.fn()} onSaved={vi.fn()} defaultSchoolId={sampleSchool.id} />
    )
    fillRequiredFields(utils)
    fireEvent.click(utils.getByText('5th'))
    fireEvent.click(utils.getByText('Save'))
    await waitFor(() => expect(schoolStudentsHookFixture.createStudent).toHaveBeenCalledWith(expect.objectContaining({ grade_id: 5, classroom_id: 10 })))
    expect(mocks.showToast).not.toHaveBeenCalledWith('error', 'Grade is required')
  })

  it('does not require a grade when the school has none configured', async () => {
    mocks.schools = { ...schoolsHookFixture, schools: [{ ...sampleSchool, grades: [] }] }
    const utils = renderWithProviders(
      <StudentFormModal open onClose={vi.fn()} onSaved={vi.fn()} defaultSchoolId={sampleSchool.id} />
    )
    fillRequiredFields(utils)
    fireEvent.click(utils.getByText('Save'))
    await waitFor(() => expect(schoolStudentsHookFixture.createStudent).toHaveBeenCalled())
    expect(mocks.showToast).not.toHaveBeenCalledWith('error', 'Grade is required')
  })

  it('renders edit mode when student is provided', () => {
    const { getByText } = renderWithProviders(
      <StudentFormModal
        open
        onClose={vi.fn()}
        onSaved={vi.fn()}
        student={sampleStudent}
      />
    )
    expect(getByText('Edit student')).toBeInTheDocument()
    expect(getByText('Test School')).toBeInTheDocument()
  })
})
