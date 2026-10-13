import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { checkoutCartFixture } from '../../__tests__/helpers/checkoutTestMocks'
import { sampleBusiness } from '../../__tests__/helpers/ordersTestMocks'
import { MultiCheckout } from '../index'

const handleGroupPlaceOrder = vi.hoisted(() => vi.fn())
const orderMocks = vi.hoisted(() => ({
  state: { options: { type: 1 }, carts: {} },
  actions: { refreshOrderOptions: () => {} }
}))

vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [orderMocks.state, orderMocks.actions]
}))

const verticalMocks = vi.hoisted(() => ({ byBusiness: {} }))

vi.mock('~ui/hooks/useBusinessVerticals', () => ({
  useBusinessVerticals: () => verticalMocks.byBusiness
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useHistory: () => ({ push: vi.fn(), replace: vi.fn() })
  }
})

vi.mock('~components/components/MultiCheckout', () => ({
  MultiCheckout: ({ UIComponent, ...rest }) => (
    <UIComponent
      openCarts={[{ ...checkoutCartFixture, business: sampleBusiness }]}
      cartGroup={{ loading: false, result: { status: 'pending', balance: 15.5 } }}
      walletState={{ error: null }}
      checkoutFieldsState={{ loading: false, fields: [] }}
      loyaltyPlansState={{ result: [] }}
      paymethodSelected={{ id: 1, gateway: 'cash', paymethod_id: 1 }}
      handleGroupPlaceOrder={handleGroupPlaceOrder}
      onRedirectPage={vi.fn()}
      placing={false}
      isUserEdit={false}
      {...rest}
    />
  )
}))

vi.mock('~ui/src/components/Cart', () => ({
  Cart: () => <div data-testid='cart-stub' />
}))

vi.mock('~ui/src/components/DriverTips', () => ({
  DriverTips: () => null
}))

vi.mock('~ui/src/components/CheckoutStudentDetails', () => ({
  CheckoutStudentDetails: ({ cart, onStudentAssigned }) => (
    <button type='button' data-testid='student-details-stub' onClick={() => onStudentAssigned(7)}>{cart?.uuid} {cart?.business?.slug}</button>
  )
}))

const secondSchoolCart = {
  ...checkoutCartFixture,
  uuid: 'school-cart-2',
  business_id: 3,
  business: { ...sampleBusiness, id: 3, slug: 'second-school', vertical: 'school' },
  student_id: null
}

const schoolBusiness = { ...sampleBusiness, vertical: 'school' }
const schoolCartWithoutStudent = { ...checkoutCartFixture, uuid: 'school-cart', business_id: 1, business: schoolBusiness, student_id: null }
const schoolCartWithStudent = { ...schoolCartWithoutStudent, student_id: 7 }
const foodCart = { ...checkoutCartFixture, uuid: 'food-cart', business_id: 2, business: { ...sampleBusiness, id: 2, vertical: 'food' } }

describe('MultiCheckout', () => {
  beforeEach(() => {
    handleGroupPlaceOrder.mockReset()
    orderMocks.state = { options: { type: 1 }, carts: {} }
    verticalMocks.byBusiness = {}
  })

  it('renders checkout title and place order action', () => {
    const { getByText } = renderWithProviders(<MultiCheckout cartUuid={checkoutCartFixture.uuid} />)
    expect(getByText('Checkout')).toBeInTheDocument()
    expect(getByText('Place Order')).toBeInTheDocument()
  })

  it('keeps place order enabled for non-school carts', () => {
    const { getByText, queryByTestId } = renderWithProviders(
      <MultiCheckout cartUuid={foodCart.uuid} openCarts={[foodCart]} />
    )
    expect(getByText('Place Order').closest('button')).not.toBeDisabled()
    expect(queryByTestId('student-details-stub')).not.toBeInTheDocument()
  })

  it('blocks place order and explains when a school cart has no student', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <MultiCheckout cartUuid={schoolCartWithoutStudent.uuid} openCarts={[foodCart, schoolCartWithoutStudent]} />
    )
    const button = getByText('Place Order').closest('button')
    expect(button).toBeDisabled()
    expect(getByText('Please select a student to place the order.')).toBeInTheDocument()
    expect(getByTestId('student-details-stub')).toHaveTextContent('school-cart')
    fireEvent.click(button)
    expect(handleGroupPlaceOrder).not.toHaveBeenCalled()
  })

  it('opens the gate once the school cart reports a successful assign', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <MultiCheckout cartUuid={schoolCartWithoutStudent.uuid} openCarts={[schoolCartWithoutStudent]} />
    )
    const button = getByText('Place Order').closest('button')
    expect(button).toBeDisabled()
    fireEvent.click(getByTestId('student-details-stub'))
    expect(button).not.toBeDisabled()
    fireEvent.click(button)
    expect(handleGroupPlaceOrder).toHaveBeenCalled()
  })

  it('renders one selector per school cart and waits for all of them', () => {
    const { getByText, getAllByTestId } = renderWithProviders(
      <MultiCheckout cartUuid={schoolCartWithStudent.uuid} openCarts={[schoolCartWithStudent, secondSchoolCart]} />
    )
    const button = getByText('Place Order').closest('button')
    const selectors = getAllByTestId('student-details-stub')
    expect(selectors).toHaveLength(2)
    expect(selectors[0]).toHaveTextContent('school-cart')
    expect(selectors[1]).toHaveTextContent('school-cart-2')
    expect(button).toBeDisabled()
    fireEvent.click(selectors[1])
    expect(button).not.toBeDisabled()
  })

  it('detects the school from the order context when the cart group omits the vertical', () => {
    const groupCart = { ...checkoutCartFixture, uuid: 'school-cart', business_id: 1, business: { id: 1, name: 'School' } }
    orderMocks.state = {
      options: { type: 1 },
      carts: { 'businessId:1': { ...groupCart, business: { id: 1, slug: 'the-school', vertical: 'school' }, student_id: null } }
    }
    const { getByText, getByTestId } = renderWithProviders(
      <MultiCheckout cartUuid={groupCart.uuid} openCarts={[groupCart]} />
    )
    expect(getByTestId('student-details-stub')).toHaveTextContent('the-school')
    expect(getByText('Place Order').closest('button')).toBeDisabled()
  })

  it('detects the school from the business lookup when neither payload carries the vertical', () => {
    const groupCart = { ...checkoutCartFixture, uuid: 'school-cart', business_id: 3169, business: { id: 3169, slug: 'los_carrisos' }, student_id: null }
    verticalMocks.byBusiness = { 3169: 'school' }
    const { getByText, getByTestId } = renderWithProviders(
      <MultiCheckout cartUuid={groupCart.uuid} openCarts={[groupCart]} />
    )
    expect(getByTestId('student-details-stub')).toHaveTextContent('los_carrisos')
    expect(getByText('Place Order').closest('button')).toBeDisabled()
  })

  it('trusts the order context student when the cart group omits it', () => {
    const groupCart = { ...checkoutCartFixture, uuid: 'school-cart', business_id: 1, business: { id: 1, name: 'School' } }
    orderMocks.state = {
      options: { type: 1 },
      carts: { 'businessId:1': { ...groupCart, business: { id: 1, slug: 'the-school', vertical: 'school' }, student_id: 9 } }
    }
    const { getByText } = renderWithProviders(
      <MultiCheckout cartUuid={groupCart.uuid} openCarts={[groupCart]} />
    )
    expect(getByText('Place Order').closest('button')).not.toBeDisabled()
  })

  it('allows place order once every school cart has a student', () => {
    const { getByText, queryByText } = renderWithProviders(
      <MultiCheckout cartUuid={schoolCartWithStudent.uuid} openCarts={[foodCart, schoolCartWithStudent]} />
    )
    expect(getByText('Place Order').closest('button')).not.toBeDisabled()
    expect(queryByText('Please select a student to place the order.')).not.toBeInTheDocument()
  })
})
