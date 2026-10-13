import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { SearchProducts } from '../index'

vi.mock('~ui/src/components/SearchBar', () => ({
  SearchBar: ({ placeholder, search }) => (
    <input data-testid='product-search' placeholder={placeholder} defaultValue={search} />
  )
}))
vi.mock('~ui/src/components/BusinessProductsList', () => ({
  BusinessProductsList: () => <div data-testid='products-list' />
}))

describe('SearchProducts', () => {
  it('renders search UI and cancel closes', () => {
    const onClose = vi.fn()
    const { getByText, getByTestId, queryByTestId } = renderWithProviders(
      <SearchProducts
        onClose={onClose}
        searchValue=''
        handleChangeSearch={vi.fn()}
        business={{ id: 1, categories: [], lazy_load_products_recommended: false }}
        featuredProducts={false}
        categorySelected={{ id: null }}
      />
    )
    expect(getByTestId('product-search')).toHaveAttribute('placeholder', 'Search Products')
    expect(queryByTestId('products-list')).not.toBeInTheDocument()
    fireEvent.click(getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows products list when search has value', () => {
    const { getByTestId } = renderWithProviders(
      <SearchProducts
        onClose={vi.fn()}
        searchValue='pizza'
        handleChangeSearch={vi.fn()}
        business={{ id: 1, categories: [{ id: 1, name: 'Mains', rank: 1 }], lazy_load_products_recommended: false }}
        featuredProducts={false}
        categorySelected={{ id: null }}
      />
    )
    expect(getByTestId('products-list')).toBeInTheDocument()
  })
})
