import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { sampleProductReorder } from '../../../__tests__/helpers/ordersTestMocks'
import { PreviousProductsOrdered } from '../index'

vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>
}))

vi.mock('~ui/src/components/SingleProductCard', () => ({
  SingleProductCard: ({ product, onProductClick }) => (
    <button type='button' onClick={() => onProductClick(product)}>{product.name}</button>
  )
}))

vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ children, open }) => (open ? <div data-testid='product-modal'>{children}</div> : null)
}))

vi.mock('~ui/src/components/ProductForm', () => ({
  ProductForm: () => <div>Product form</div>
}))

describe('PreviousProductsOrdered', () => {
  it('renders previously ordered products', () => {
    const { getByText } = renderWithProviders(
      <PreviousProductsOrdered
        products={[sampleProductReorder]}
        handleUpdateProducts={vi.fn()}
        onBusinessClick={vi.fn()}
      />
    )
    expect(getByText('Cheese Slice')).toBeInTheDocument()
  })
})
