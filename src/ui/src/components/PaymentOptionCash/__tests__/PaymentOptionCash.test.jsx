import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PaymentOptionCash } from '../index'

describe('PaymentOptionCash', () => {
  it('renders cash amount helper label', () => {
    const { getByText } = renderWithProviders(
      <PaymentOptionCash orderTotal={20} onChangeData={() => {}} />
    )
    expect(getByText(/Don't have exact amount/)).toBeInTheDocument()
  })
})
