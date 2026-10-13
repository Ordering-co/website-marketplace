import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { checkoutCartFixture, studentFixture } from '../../__tests__/helpers/checkoutTestMocks'
import { CheckoutStudentDetails } from '../index'

const mocks = vi.hoisted(() => ({
  students: [],
  selectedStudentId: null,
  assignStudent: vi.fn(),
  setStudentId: vi.fn(),
  showToast: vi.fn(),
  onStudentAssigned: vi.fn()
}))

vi.mock('~components/hooks/useSchoolStudents', () => ({
  useSchoolStudents: () => ({
    students: mocks.students,
    loading: false,
    loaded: true,
    refresh: vi.fn()
  })
}))
vi.mock('~components/hooks/useCartStudent', () => ({
  useCartStudent: () => ({ assignStudent: mocks.assignStudent })
}))
vi.mock('~components/hooks/useSelectedStudent', () => ({
  useSelectedStudent: () => ({ studentId: mocks.selectedStudentId, setStudentId: mocks.setStudentId })
}))
vi.mock('~components/contexts/ToastContext', () => ({
  ToastType: { Error: 'error' },
  useToast: () => [{}, { showToast: mocks.showToast }]
}))
vi.mock('~ui/src/styles/Select', () => ({
  Select: ({ placeholder, options = [], onChange }) => (
    <div data-testid='student-select'>
      <span>{placeholder}</span>
      {options.map((opt) => (
        <button key={opt.value} type='button' onClick={() => onChange(opt.value)}>{opt.content}</button>
      ))}
    </div>
  )
}))
vi.mock('~ui/src/components/StudentFormModal', () => ({
  StudentFormModal: () => null
}))

const secondStudent = { ...studentFixture, id: 2, name: 'John', lastname: 'Roe' }

describe('CheckoutStudentDetails', () => {
  beforeEach(() => {
    mocks.students = [studentFixture]
    mocks.selectedStudentId = null
    mocks.assignStudent.mockReset()
    mocks.setStudentId.mockReset()
    mocks.showToast.mockReset()
    mocks.onStudentAssigned.mockReset()
  })

  it('renders student selector for school cart', () => {
    const cart = {
      ...checkoutCartFixture,
      business_id: 1,
      student_id: 1
    }
    const { getByText } = renderWithProviders(<CheckoutStudentDetails cart={cart} />)
    expect(getByText('Student')).toBeInTheDocument()
    expect(getByText('Select a student')).toBeInTheDocument()
    expect(getByText('Jane Doe')).toBeInTheDocument()
  })

  it('stores the selection only after the cart assign succeeds', async () => {
    mocks.students = [studentFixture, secondStudent]
    mocks.assignStudent.mockResolvedValue({ error: false, result: {} })
    const cart = { ...checkoutCartFixture, business_id: 1, student_id: null }
    const { getByText } = renderWithProviders(<CheckoutStudentDetails cart={cart} onStudentAssigned={mocks.onStudentAssigned} />)
    fireEvent.click(getByText('John Roe'))
    await waitFor(() => expect(mocks.assignStudent).toHaveBeenCalledWith('cart-1', 2))
    await waitFor(() => expect(mocks.setStudentId).toHaveBeenCalledWith(2))
    expect(mocks.onStudentAssigned).toHaveBeenCalledWith(2)
    expect(mocks.showToast).not.toHaveBeenCalled()
  })

  it('does not store the selection and warns when the cart assign fails', async () => {
    mocks.students = [studentFixture, secondStudent]
    mocks.assignStudent.mockResolvedValue({ error: true, result: ['STUDENT_NOT_ALLOWED'] })
    const cart = { ...checkoutCartFixture, business_id: 1, student_id: null }
    const { getByText } = renderWithProviders(<CheckoutStudentDetails cart={cart} onStudentAssigned={mocks.onStudentAssigned} />)
    fireEvent.click(getByText('John Roe'))
    await waitFor(() => expect(mocks.assignStudent).toHaveBeenCalledWith('cart-1', 2))
    await waitFor(() => expect(mocks.showToast).toHaveBeenCalled())
    expect(mocks.setStudentId).not.toHaveBeenCalledWith(2)
    expect(mocks.onStudentAssigned).not.toHaveBeenCalled()
  })

  it('assigns a remembered student to a cart that has none before storing it', async () => {
    mocks.students = [studentFixture, secondStudent]
    mocks.selectedStudentId = '2'
    mocks.assignStudent.mockResolvedValue({ error: false, result: {} })
    const cart = { ...checkoutCartFixture, business_id: 1, student_id: null }
    renderWithProviders(<CheckoutStudentDetails cart={cart} />)
    await waitFor(() => expect(mocks.assignStudent).toHaveBeenCalledWith('cart-1', '2'))
  })

  it('follows the cart when the same cart arrives without a student', async () => {
    mocks.students = [studentFixture, secondStudent]
    mocks.selectedStudentId = '2'
    const cart = { ...checkoutCartFixture, business_id: 1, student_id: 2 }
    const { rerender } = renderWithProviders(<CheckoutStudentDetails cart={cart} onStudentAssigned={mocks.onStudentAssigned} />)
    expect(mocks.assignStudent).not.toHaveBeenCalled()
    rerender(<CheckoutStudentDetails cart={{ ...cart, student_id: null }} onStudentAssigned={mocks.onStudentAssigned} />)
    await waitFor(() => expect(mocks.setStudentId).toHaveBeenCalledWith(null))
    expect(mocks.onStudentAssigned).toHaveBeenCalledWith(null)
    expect(mocks.assignStudent).not.toHaveBeenCalled()
  })

  it('follows the cart when the same cart arrives with another student', async () => {
    mocks.students = [studentFixture, secondStudent]
    mocks.selectedStudentId = '2'
    const cart = { ...checkoutCartFixture, business_id: 1, student_id: 2 }
    const { rerender } = renderWithProviders(<CheckoutStudentDetails cart={cart} onStudentAssigned={mocks.onStudentAssigned} />)
    rerender(<CheckoutStudentDetails cart={{ ...cart, student_id: 1 }} onStudentAssigned={mocks.onStudentAssigned} />)
    await waitFor(() => expect(mocks.setStudentId).toHaveBeenCalledWith(1))
    expect(mocks.onStudentAssigned).toHaveBeenCalledWith(1)
    expect(mocks.assignStudent).not.toHaveBeenCalled()
  })

  it('clears a remembered student that the cart assign rejects', async () => {
    mocks.students = [studentFixture, secondStudent]
    mocks.selectedStudentId = '2'
    mocks.assignStudent.mockResolvedValue({ error: true, result: ['STUDENT_NOT_ALLOWED'] })
    const cart = { ...checkoutCartFixture, business_id: 1, student_id: null }
    renderWithProviders(<CheckoutStudentDetails cart={cart} />)
    await waitFor(() => expect(mocks.assignStudent).toHaveBeenCalledWith('cart-1', '2'))
    await waitFor(() => expect(mocks.setStudentId).toHaveBeenCalledWith(null))
  })
})
