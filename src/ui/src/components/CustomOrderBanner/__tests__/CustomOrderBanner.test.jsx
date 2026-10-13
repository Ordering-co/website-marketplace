import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CustomOrderBanner } from '../index'

describe('CustomOrderBanner', () => {
  it('renders custom order banner copy and button', () => {
    const { getByText } = renderWithProviders(<CustomOrderBanner onCustomOrderClick={vi.fn()} />)
    expect(getByText('Do you need a special delivery?')).toBeInTheDocument()
    expect(getByText('Custom order')).toBeInTheDocument()
  })
})
