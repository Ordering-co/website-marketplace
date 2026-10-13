import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { taxFixture } from '../../__tests__/helpers/checkoutTestMocks'
import { TaxBillRows } from '../index'

describe('TaxBillRows', () => {
  it('renders tax rows for target', () => {
    const parsePrice = (value) => `$${value}`
    const parseNumber = (value) => value
    const t = (_key, fallback) => fallback
    const { getByText } = renderWithProviders(
      <table>
        <tbody>
          <TaxBillRows
            taxes={[taxFixture]}
            target='product'
            parsePrice={parsePrice}
            parseNumber={parseNumber}
            t={t}
          />
        </tbody>
      </table>
    )
    expect(getByText(/Sales Tax/)).toBeInTheDocument()
    expect(getByText('$1.2')).toBeInTheDocument()
  })
})
