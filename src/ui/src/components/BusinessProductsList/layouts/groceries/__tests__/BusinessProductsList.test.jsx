import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../../__tests__/helpers/testUtils'
import { productFixture } from '../../../../__tests__/helpers/menuTestMocks'
import { BusinessProductsList } from '../index'

vi.mock('~ui/src/components/SingleProductCard', () => ({
  SingleProductCard: ({ product }) => <div data-testid='product-card'>{product.name}</div>
}))
vi.mock('~ui/src/components/AccordionDropdown', () => ({
  AccordionDropdown: ({ item }) => <div data-testid='accordion'>{item.name}</div>
}))

vi.mock('~components/components/ProductsList', () => ({
  ProductsList: ({ UIComponent, ...rest }) => (
    <UIComponent
      business={{ id: 1, name: 'Grocery' }}
      category={{ id: 1, name: 'Produce' }}
      categories={[{ id: 1, name: 'Produce', subcategories: [] }]}
      categoriesState={{ loading: false }}
      categoryState={{ products: [productFixture], loading: false }}
      onProductClick={vi.fn()}
      onClickCategory={vi.fn()}
      subcategoriesSelected={[]}
      setSubcategoriesSelected={vi.fn()}
      {...rest}
    />
  )
}))

describe('BusinessProductsList groceries layout', () => {
  it('renders grocery category and product', () => {
    const { getByText, getByTestId } = renderWithProviders(<BusinessProductsList />)
    expect(getByText('Produce')).toBeInTheDocument()
    expect(getByTestId('product-card')).toHaveTextContent('Burger')
  })
})
