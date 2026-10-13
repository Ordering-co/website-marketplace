import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { ProfessionalBusinessFilter } from '../index'

vi.mock('~ui/src/components/SearchBar', () => ({
  SearchBar: ({ placeholder }) => <input data-testid='search' placeholder={placeholder} />
}))
vi.mock('~ui/src/styles/Select', () => ({
  Select: ({ defaultValue, options }) => (
    <div data-testid='sort-select' data-value={defaultValue}>
      {options?.map((o) => o.content || o.name || o.value).join(',')}
    </div>
  )
}))

describe('ProfessionalBusinessFilter', () => {
  it('renders search and price filters', () => {
    const { getByTestId, getByPlaceholderText } = renderWithProviders(
      <ProfessionalBusinessFilter
        sortByValue='rank'
        sortByOptions={[{ value: 'rank', content: 'Rank' }]}
        handleChangeSortBy={vi.fn()}
        handleChangeSearch={vi.fn()}
        searchValue=''
        business={{}}
        handleChangePriceFilterValues={vi.fn()}
        priceFilterValues={{ min: '', max: '' }}
      />
    )
    expect(getByTestId('search')).toHaveAttribute('placeholder', 'Search Products')
    expect(getByPlaceholderText('Min')).toBeInTheDocument()
    expect(getByPlaceholderText('Max')).toBeInTheDocument()
    expect(getByTestId('sort-select')).toBeInTheDocument()
  })
})
