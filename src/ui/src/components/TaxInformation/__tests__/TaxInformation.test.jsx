import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { TaxInformation } from '../index'

vi.mock('~ui/src/components/SingleProductCard', () => ({
  SingleProductCard: ({ product }) => <div data-testid='product-card'>{product?.name}</div>
}))

describe('TaxInformation', () => {
  it('renders tax description heading', () => {
    const { getByText } = renderWithProviders(
      <TaxInformation
        type='tax'
        data={{ id: 1, description: 'City sales tax', type: 2, target: 'product' }}
        products={[]}
      />
    )
    expect(getByText(/Description:/)).toBeInTheDocument()
    expect(getByText(/City sales tax/)).toBeInTheDocument()
  })
})
