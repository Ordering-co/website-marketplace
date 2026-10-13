import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { cartFixture, productFixture, studentFixture } from '../../__tests__/helpers/cartTestMocks'
import { CartStudentAlert } from '../index'

vi.mock('~components/hooks/useSchoolStudents', () => ({
  useSchoolStudents: () => ({ students: [studentFixture] })
}))

const removeProduct = vi.hoisted(() => vi.fn())

vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [
    { options: { type: 1 }, carts: {} },
    { removeProduct }
  ]
}))

describe('CartStudentAlert', () => {
  it('shows conflict modal for student allergen mismatch', () => {
    const cart = {
      ...cartFixture,
      student_id: 1,
      products: [{ ...productFixture, code: 'BRG-1', allergens: ['peanut'] }]
    }
    const { getByText } = renderWithProviders(<CartStudentAlert cart={cart} />)
    expect(getByText('Items not suitable for student')).toBeInTheDocument()
    expect(getByText('Allergies: peanut')).toBeInTheDocument()
    fireEvent.click(getByText('Keep them'))
  })
})
