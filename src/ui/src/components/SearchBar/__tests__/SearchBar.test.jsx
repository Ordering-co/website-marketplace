import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { SearchBar } from '../index'

describe('SearchBar', () => {
  it('renders search input with accessible label', () => {
    const { getByLabelText } = renderWithProviders(
      <SearchBar onSearch={vi.fn()} placeholder='Search stores' />
    )
    expect(getByLabelText('search')).toHaveAttribute('placeholder', 'Search stores')
  })
})
