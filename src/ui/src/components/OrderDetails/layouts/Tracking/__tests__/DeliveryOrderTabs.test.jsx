import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../../__tests__/helpers/testUtils'
import { DeliveryOrderTabs } from '../DeliveryOrderTabs'

vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~components/contexts/UtilsContext', () => ({
  useUtils: () => [{ parsePrice: (value) => `$${Number(value).toFixed(2)}` }]
}))
vi.mock('~ui-icon', () => ({
  Icon: ({ name }) => <span data-testid={`icon-${name}`} />
}))

const order = {
  id: 1,
  delivery_type: 1,
  customer: { name: 'Ana', lastname: 'Lopez', address: 'Calle 1 #23', cellphone: '+51888' },
  driver: { name: 'Luis', lastname: 'Perez', cellphone: '+51999', vehicle: { name: 'Moto', plate: 'ABC-123' } },
  summary: { subtotal: 20, discount: 0, total: 25, driver_tip: 2, delivery_price: 3, service_fee: 0 },
  taxes: [{ id: 9, type: 2, rate: 18, target: 'product', name: 'IGV', summary: { tax: 3.6 } }],
  fees: [],
  offers: [],
  products: [{ id: 1, name: 'Burger', price: 10 }],
  paymethod: { name: 'Pago Post' },
  paymethod_data: { card: { brand: 'visa', last4: '4242' } }
}

const renderTabs = (overrides = {}, props = {}) => renderWithProviders(
  <DeliveryOrderTabs order={{ ...order, ...overrides }} productList={<div data-testid='product-list' />} productsCount={1} {...props} />
)

describe('DeliveryOrderTabs', () => {
  it('shows the delivery fields and the driver with a call button by default', () => {
    const { getByText, container } = renderTabs()
    expect(getByText('Delivery address')).toBeInTheDocument()
    expect(getByText('Calle 1 #23')).toBeInTheDocument()
    expect(getByText('Ana Lopez')).toBeInTheDocument()
    expect(getByText('+51888')).toBeInTheDocument()
    expect(getByText('Luis Perez')).toBeInTheDocument()
    expect(getByText('Moto · Plate ABC-123')).toBeInTheDocument()
    expect(container.querySelector('a.call[href="tel:+51999"]')).toBeTruthy()
  })

  it('respects the hidden flags', () => {
    const { queryByText, container } = renderTabs({}, { hideCustomerAddress: true, hideCustomerPhone: true, hideDriverName: true, hideDriverPhone: true })
    expect(queryByText('Calle 1 #23')).toBeNull()
    expect(queryByText('+51888')).toBeNull()
    expect(queryByText('Luis Perez')).toBeNull()
    expect(container.querySelector('a.call')).toBeNull()
  })

  it('switches to the order tab with the totals, products and payment method', () => {
    const { getByText, getByTestId } = renderTabs()
    fireEvent.click(getByText('Your order'))
    expect(getByText('Total cost')).toBeInTheDocument()
    expect(getByText('Products')).toBeInTheDocument()
    expect(getByText('$20.00')).toBeInTheDocument()
    expect(getByText('IGV (18%)')).toBeInTheDocument()
    expect(getByText('$3.60')).toBeInTheDocument()
    expect(getByText('Delivery fee')).toBeInTheDocument()
    expect(getByText('$3.00')).toBeInTheDocument()
    expect(getByText('Driver tip')).toBeInTheDocument()
    expect(getByText('$25.00')).toBeInTheDocument()
    expect(getByTestId('product-list')).toBeInTheDocument()
    expect(getByText('Payment method')).toBeInTheDocument()
    expect(getByText('VISA ****4242')).toBeInTheDocument()
  })

  it('shows discounts, fees and the payment name when there is no card', () => {
    const { getByText } = renderTabs({
      summary: { subtotal: 20, discount: 2, subtotal_with_discount: 18, total: 18, service_fee: 1 },
      offer_type: 1,
      offer_rate: 10,
      taxes: [],
      fees: [{ id: 3, name: 'Servicio', fixed: 1, percentage: 0, summary: { fixed: 1 } }],
      paymethod_data: {}
    })
    fireEvent.click(getByText('Your order'))
    expect(getByText('Discount (10%)')).toBeInTheDocument()
    expect(getByText('- $2.00')).toBeInTheDocument()
    expect(getByText('Subtotal with discount')).toBeInTheDocument()
    expect(getByText('Servicio ($1.00)')).toBeInTheDocument()
    expect(getByText('Pago Post')).toBeInTheDocument()
  })

  it('hides the order comment and number outside courier projects', () => {
    const { getByText, queryByText } = renderTabs({ comment: 'McCombo grande' })
    fireEvent.click(getByText('Your order'))
    expect(queryByText('McCombo grande')).toBeNull()
    expect(queryByText('#1')).toBeNull()
  })

  it('shows the order number, products and comment without costs or payment for courier projects', () => {
    const { getByText, getByTestId, queryByText } = renderTabs({ comment: 'McCombo grande' }, { isCourierTracking: true })
    fireEvent.click(getByText('Your order'))
    expect(getByText('Order number')).toBeInTheDocument()
    expect(getByText('#1')).toBeInTheDocument()
    expect(getByTestId('product-list')).toBeInTheDocument()
    expect(getByText('Comment')).toBeInTheDocument()
    expect(getByText('McCombo grande')).toBeInTheDocument()
    expect(queryByText('Total cost')).toBeNull()
    expect(queryByText('Delivery fee')).toBeNull()
    expect(queryByText('$25.00')).toBeNull()
    expect(queryByText('Payment method')).toBeNull()
  })

  it('omits the comment block for courier projects when the order has no comment', () => {
    const { getByText, queryByText } = renderTabs({}, { isCourierTracking: true })
    fireEvent.click(getByText('Your order'))
    expect(queryByText('Comment')).toBeNull()
  })
})
