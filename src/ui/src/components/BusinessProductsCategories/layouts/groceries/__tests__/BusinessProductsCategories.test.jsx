import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../../__tests__/helpers/testUtils'
import { BusinessProductsCategories } from '../index'

vi.mock('~ui/src/components/AccordionDropdown', () => ({
  AccordionDropdown: ({ item, isOpen }) => (
    <div data-testid='accordion' data-open={isOpen}>{item.name}</div>
  )
}))
vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))

vi.mock('~components/components/BusinessProductsCategories', () => ({
  BusinessProductsCategories: ({ UIComponent, ...rest }) => (
    <UIComponent
      categories={[{ id: 1, name: 'Aisles', subcategories: [{ id: 2, name: 'Snacks' }] }]}
      categorySelected={{ id: 1, name: 'Aisles' }}
      handlerClickCategory={vi.fn()}
      setCategoryClicked={vi.fn()}
      openCategories={[]}
      isSkeleton={false}
      {...rest}
    />
  )
}))

describe('BusinessProductsCategories groceries layout', () => {
  it('renders grocery accordion category', () => {
    const { getByTestId } = renderWithProviders(<BusinessProductsCategories />)
    expect(getByTestId('accordion')).toHaveTextContent('Aisles')
  })
})
