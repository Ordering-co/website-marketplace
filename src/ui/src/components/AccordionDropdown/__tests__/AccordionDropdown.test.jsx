import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { AccordionDropdown } from '../index'

describe('AccordionDropdown', () => {
  it('renders subcategories when open', () => {
    const { getByText } = renderWithProviders(
      <AccordionDropdown
        item={{ name: 'Produce', subcategories: [{ id: 1, name: 'Fruit' }] }}
        isOpen
        isSelected={false}
        handleClickItem={vi.fn()}
        IterateCategories={() => <div>Fruit list</div>}
      />
    )
    expect(getByText('Produce')).toBeInTheDocument()
    expect(getByText('Fruit list')).toBeInTheDocument()
  })

  it('calls handleClickItem when header is clicked', () => {
    const handleClickItem = vi.fn()
    const { getByText } = renderWithProviders(
      <AccordionDropdown
        item={{ name: 'Dairy', subcategories: [] }}
        isOpen={false}
        isSelected={false}
        handleClickItem={handleClickItem}
        IterateCategories={() => null}
      />
    )
    fireEvent.click(getByText('Dairy'))
    expect(handleClickItem).toHaveBeenCalledWith(false)
  })
})
