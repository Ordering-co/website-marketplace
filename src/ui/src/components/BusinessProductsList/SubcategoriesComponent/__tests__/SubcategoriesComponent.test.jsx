import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { SubcategoriesComponent } from '../index'

describe('SubcategoriesComponent', () => {
  it('renders All and subcategory buttons', () => {
    const { getByText } = renderWithProviders(
      <SubcategoriesComponent
        category={{ id: 1, name: 'Pizza', subcategories: [{ id: 2, name: 'Classic' }] }}
        subcategoriesSelected={[]}
        onClickSubcategory={vi.fn()}
      />
    )
    expect(getByText('All')).toBeInTheDocument()
    expect(getByText('Classic')).toBeInTheDocument()
  })

  it('calls onClickSubcategory for a subcategory', () => {
    const onClickSubcategory = vi.fn()
    const category = { id: 1, name: 'Pizza', subcategories: [{ id: 2, name: 'Classic' }] }
    const { getByText } = renderWithProviders(
      <SubcategoriesComponent
        category={category}
        subcategoriesSelected={[]}
        onClickSubcategory={onClickSubcategory}
      />
    )
    fireEvent.click(getByText('Classic'))
    expect(onClickSubcategory).toHaveBeenCalledWith(category.subcategories[0], category)
  })
})
