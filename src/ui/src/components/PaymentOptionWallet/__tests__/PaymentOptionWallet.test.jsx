import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { walletFixture } from '../../__tests__/helpers/checkoutTestMocks'
import { PaymentOptionWallet } from '../index'

vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{
    configs: {
      wallet_cash_enabled: { value: '1' },
      wallet_credit_point_enabled: { value: '1' }
    }
  }]
}))
vi.mock('~ui/src/components/Confirm', () => ({
  Alert: () => null
}))

vi.mock('~components/components/PaymentOptionWallet', () => ({
  PaymentOptionWallet: ({ UIComponent, ...rest }) => (
    <UIComponent
      cart={{ wallets: [] }}
      walletsState={{ loading: false, error: null, result: [{ ...walletFixture, valid: true, balance: 25 }] }}
      businessConfigs={[
        { key: 'wallet_cash_enabled', value: '1' },
        { key: 'wallet_credit_point_enabled', value: '1' }
      ]}
      selectWallet={vi.fn()}
      deletetWalletSelected={vi.fn()}
      setErrorState={vi.fn()}
      errorState={null}
      {...rest}
    />
  )
}))

describe('PaymentOptionWallet', () => {
  it('renders wallet payment option', () => {
    const { getByText } = renderWithProviders(<PaymentOptionWallet />)
    expect(getByText('Pay with Wallet credits')).toBeInTheDocument()
  })
})
