import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { walletListFixture } from '../../__tests__/helpers/profileWalletTestMocks'
import { Wallets } from '../index'

vi.mock('~components/components/WalletList', () => ({
  WalletList: ({ UIComponent, ...rest }) => (
    <UIComponent
      walletList={walletListFixture}
      userLoyaltyLevel={{}}
      transactionsList={{ loading: false, transactions: [] }}
      setWalletSelected={vi.fn()}
      isWalletCashEnabled
      isWalletPointsEnabled
      walletType='cash'
      {...rest}
    />
  )
}))

describe('Wallets', () => {
  it('renders cash wallet tab by default', () => {
    const { getByText } = renderWithProviders(<Wallets />)
    expect(getByText(/Cash Wallet/i)).toBeInTheDocument()
  })
})
