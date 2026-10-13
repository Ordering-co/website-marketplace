import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { sampleProductReorder } from '../../__tests__/helpers/ordersTestMocks'
import { OrderItAgain } from '../index'

vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>
}))

vi.mock('~ui/src/components/SingleProductCard', () => ({
  SingleProductCard: ({ product }) => <div>{product.name}</div>
}))

describe('OrderItAgain', () => {
  it('renders order it again heading and products', () => {
    const { getByText } = renderWithProviders(
      <OrderItAgain productList={[sampleProductReorder]} businessId={1} onProductClick={vi.fn()} />
    )
    expect(getByText('Order it again')).toBeInTheDocument()
    expect(getByText('Cheese Slice')).toBeInTheDocument()
  })
})
