import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { productFixture } from '../../__tests__/helpers/menuTestMocks'
import { BusinessProductsList } from '../index'

vi.mock('~ui/src/components/SingleProductCard', () => ({
  SingleProductCard: ({ product }) => <div data-testid='product-card'>{product.name}</div>
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null)
}))
vi.mock('~ui/src/components/NotFoundSource', () => ({
  NotFoundSource: () => <div data-testid='not-found' />
}))

vi.mock('~components/components/ProductsList', () => ({
  ProductsList: ({ UIComponent, ...rest }) => (
    <UIComponent
      category={{ id: 1, name: 'Mains' }}
      categories={[]}
      categoryState={{ products: [productFixture], loading: false, pagination: { currentPage: 1, pageSize: 10, total: 1 } }}
      onProductClick={vi.fn()}
      subcategoriesSelected={[]}
      setSubcategoriesSelected={vi.fn()}
      errors={[]}
      {...rest}
    />
  )
}))

describe('BusinessProductsList', () => {
  it('renders products for a category', () => {
    const { getByTestId } = renderWithProviders(<BusinessProductsList />)
    expect(getByTestId('product-card')).toHaveTextContent('Burger')
  })
})
