import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { feeFixture } from '../../__tests__/helpers/checkoutTestMocks'
import { FeeBillRows } from '../index'

describe('FeeBillRows', () => {
  it('renders visible fee rows', () => {
    const parsePrice = (value) => `$${value}`
    const t = (_key, fallback) => fallback
    const { getByText } = renderWithProviders(
      <table>
        <tbody>
          <FeeBillRows fees={[feeFixture]} parsePrice={parsePrice} t={t} />
        </tbody>
      </table>
    )
    expect(getByText('Service Fee')).toBeInTheDocument()
    expect(getByText('$2.5')).toBeInTheDocument()
  })
})
