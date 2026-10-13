import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { Checkout } from '../index'

const mocks = vi.hoisted(() => {
  const noop = () => {}
  const handlerClickPlaceOrder = vi.fn()
  return {
    cart: null,
    selectedStudentId: null,
    handlerClickPlaceOrder,
    orderState: { loading: false, options: { type: 2 }, carts: {} },
    orderActions: { confirmCart: noop },
    sessionState: { user: { id: 1, name: 'Parent' }, loading: false, auth: true, token: 'tok' },
    sessionActions: { login: noop },
    configState: { configs: {} },
    customerState: { user: null },
    events: { on: noop, off: noop, emit: noop },
    validationFields: { fields: {} },
    selectedStudent: { setStudentId: noop },
    controllerProps: {
      paymethodSelected: { id: 1, gateway: 'cash', paymethod_id: 1 },
      handlePaymethodChange: noop,
      handlerClickPlaceOrder,
      handleOrderRedirect: noop,
      placing: false,
      checkoutFieldsState: { loading: false, fields: [] },
      loyaltyPlansState: { result: [] },
      instructionsOptions: { result: [] },
      deliveryOptionSelected: undefined,
      cardList: { cards: [] }
    }
  }
})

const baseCart = {
  uuid: 'cart-1',
  status: 0,
  valid: true,
  valid_products: true,
  valid_maximum: true,
  valid_minimum: true,
  business_id: 1,
  business: { id: 1, name: 'Demo School', slug: 'demo-school', vertical: 'school' },
  products: [{ id: 10, name: 'Lunch', code: 'LNC-1', price: 9.5 }],
  total: 9.5,
  subtotal: 9.5,
  balance: 9.5
}

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({ default: () => <div data-testid='skeleton' /> }))
vi.mock('~ui/src/components/NotFoundSource', () => ({ NotFoundSource: () => null }))
vi.mock('~ui/src/components/CartContent', () => ({ CartContent: () => null }))
vi.mock('~ui/src/components/UpsellingPage', () => ({ UpsellingPage: () => null }))
vi.mock('~ui/src/components/Confirm', () => ({ Alert: () => null, Confirm: () => null }))
vi.mock('~ui/src/components/SignUpForm', () => ({ SignUpForm: () => null }))
vi.mock('~ui/src/components/LoginForm', () => ({ LoginForm: () => null }))
vi.mock('~ui/src/components/AddressDetails', () => ({ AddressDetails: () => null }))
vi.mock('~ui/src/components/UserDetails', () => ({ UserDetails: () => null }))
vi.mock('~ui/src/components/PaymentOptions', () => ({ PaymentOptions: () => null }))
vi.mock('~ui/src/components/PaymentOptionWallet', () => ({ PaymentOptionWallet: () => null }))
vi.mock('~ui/src/components/DriverTips', () => ({ DriverTips: () => null }))
vi.mock('~ui/src/components/Cart', () => ({ Cart: () => null }))
vi.mock('~ui/src/components/PlaceSpot', () => ({ PlaceSpot: () => null }))
vi.mock('~ui/src/components/OrderContextUI', () => ({ OrderContextUI: () => null }))
vi.mock('~ui/src/components/BusinessReservation', () => ({ BusinessReservation: () => null }))
vi.mock('~ui/src/components/Modal', () => ({ Modal: () => null }))
vi.mock('../OrderDetail', () => ({ OrderDetail: () => null }))
vi.mock('../../RewardsBanner', () => ({ RewardsBanner: () => null }))
vi.mock('../../CheckoutStudentDetails', () => ({
  CheckoutStudentDetails: ({ onStudentAssigned }) => (
    <button type='button' data-testid='student-details-stub' onClick={() => onStudentAssigned(5)}>assign</button>
  )
}))
vi.mock('~components/hooks/useSelectedStudent', () => ({
  useSelectedStudent: () => {
    mocks.selectedStudent.studentId = mocks.selectedStudentId
    return mocks.selectedStudent
  }
}))
vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [mocks.orderState, mocks.orderActions]
}))
vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [mocks.sessionState, mocks.sessionActions]
}))
vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [mocks.configState]
}))
vi.mock('~components/contexts/CustomerContext', () => ({
  useCustomer: () => [mocks.customerState]
}))
vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [mocks.events]
}))
vi.mock('~components/contexts/ValidationsFieldsContext', () => ({
  useValidationFields: () => [mocks.validationFields]
}))
vi.mock('~components/components/Checkout', () => ({
  Checkout: ({ UIComponent, cartState, uuid, ...rest }) => (
    <UIComponent
      cart={cartState?.cart}
      cartState={cartState}
      businessDetails={mocks.businessDetails}
      {...mocks.controllerProps}
      {...rest}
    />
  )
}))

const noop = () => {}

const renderCheckout = (cart) => {
  mocks.cart = cart
  mocks.orderState = { loading: false, options: { type: 2 }, carts: { 'businessId:1': cart } }
  mocks.businessDetails = { business: cart.business, loading: false, error: null }
  return renderWithProviders(
    <Checkout cartUuid={cart.uuid} handleOrderRedirect={noop} handleCheckoutRedirect={noop} />
  )
}

describe('Checkout school gate', () => {
  beforeEach(() => {
    window.scrollTo = noop
    mocks.cart = null
    mocks.selectedStudentId = null
    mocks.handlerClickPlaceOrder.mockReset()
    window.localStorage.removeItem('user-customer')
  })

  it('blocks place order on a school cart without a student even if one is remembered locally', async () => {
    mocks.selectedStudentId = '5'
    const { findByText, getByTestId } = renderCheckout({ ...baseCart, student_id: null })
    const button = (await findByText('Place Order')).closest('button')
    expect(button).toBeDisabled()
    expect(await findByText('Please select a student to place the order.')).toBeInTheDocument()
    expect(getByTestId('student-details-stub')).toBeInTheDocument()
    fireEvent.click(button)
    expect(mocks.handlerClickPlaceOrder).not.toHaveBeenCalled()
  })

  it('allows place order once the cart carries the student', async () => {
    const { findByText, queryByText } = renderCheckout({ ...baseCart, student_id: 5 })
    const button = (await findByText('Place Order')).closest('button')
    expect(button).not.toBeDisabled()
    expect(queryByText('Please select a student to place the order.')).not.toBeInTheDocument()
    fireEvent.click(button)
    expect(mocks.handlerClickPlaceOrder).toHaveBeenCalled()
  })

  it('opens the gate once the student details report a successful assign', async () => {
    const { findByText, getByTestId, queryByText } = renderCheckout({ ...baseCart, student_id: null })
    const button = (await findByText('Place Order')).closest('button')
    expect(button).toBeDisabled()
    fireEvent.click(getByTestId('student-details-stub'))
    expect(button).not.toBeDisabled()
    expect(queryByText('Please select a student to place the order.')).not.toBeInTheDocument()
    fireEvent.click(button)
    expect(mocks.handlerClickPlaceOrder).toHaveBeenCalled()
  })

  it('does not gate non-school carts', async () => {
    const { findByText, queryByTestId } = renderCheckout({
      ...baseCart,
      business: { ...baseCart.business, vertical: 'food' },
      student_id: null
    })
    const button = (await findByText('Place Order')).closest('button')
    expect(button).not.toBeDisabled()
    expect(queryByTestId('student-details-stub')).not.toBeInTheDocument()
  })
})
