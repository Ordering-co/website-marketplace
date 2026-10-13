import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { MyOrders } from '../index'

vi.mock('~ui/src/components/OrdersOption', () => ({
  OrdersOption: ({ setIsEmptyPast, setIsEmptyActive, setIsEmptyPreorder }) => {
    React.useEffect(() => {
      setIsEmptyPast?.({ loading: false, value: false })
      setIsEmptyActive?.({ loading: false, value: false })
      setIsEmptyPreorder?.({ loading: false, value: false })
    }, [setIsEmptyPast, setIsEmptyActive, setIsEmptyPreorder])
    return <div data-testid='orders-option-stub' />
  }
}))

vi.mock('~ui/src/components/GiftCard/GiftCardOrdersList', () => ({
  GiftCardOrdersList: () => <div data-testid='gift-card-orders-stub' />
}))

describe('MyOrders', () => {
  it('renders my orders title and orders tab', () => {
    const { getByText } = renderWithProviders(
      <MyOrders onRedirectPage={vi.fn()} onProductRedirect={vi.fn()} businessesSearchList={{ loading: false, result: [] }} />
    )
    expect(getByText('My Orders')).toBeInTheDocument()
    expect(getByText('Orders')).toBeInTheDocument()
  })
})
