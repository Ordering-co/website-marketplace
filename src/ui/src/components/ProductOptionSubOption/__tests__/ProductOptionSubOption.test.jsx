import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { ProductOptionSubOption } from '../index'

const toggleSelect = vi.hoisted(() => vi.fn())

vi.mock('~components/components/ProductOptionSuboption', () => ({
  ProductOptionSuboption: ({ UIComponent, ...rest }) => (
    <UIComponent
      suboption={{ id: 1, name: 'Large', price: 2, max: 1 }}
      option={{ id: 1, name: 'Size' }}
      state={{ selected: false, quantity: 0, position: 'whole' }}
      toggleSelect={toggleSelect}
      increment={vi.fn()}
      decrement={vi.fn()}
      balance={1}
      {...rest}
    />
  )
}))

describe('ProductOptionSubOption', () => {
  it('renders suboption name', () => {
    const { getByText } = renderWithProviders(<ProductOptionSubOption />)
    expect(getByText('Large')).toBeInTheDocument()
  })

  it('calls toggleSelect when clicked', () => {
    toggleSelect.mockClear()
    const { getByText } = renderWithProviders(<ProductOptionSubOption />)
    fireEvent.click(getByText('Large'))
    expect(toggleSelect).toHaveBeenCalled()
  })
})
