import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { walletTransactionFixture } from '../../__tests__/helpers/profileWalletTestMocks'
import { WalletTransactionItem } from '../index'

describe('WalletTransactionItem', () => {
  it('renders transaction description and amount', () => {
    const { getByText } = renderWithProviders(
      <WalletTransactionItem item={walletTransactionFixture} withFormatPrice />
    )
    expect(getByText('Top up')).toBeInTheDocument()
    expect(getByText(/\+/)).toBeInTheDocument()
  })
})
