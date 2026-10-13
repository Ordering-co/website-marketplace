import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { Wallets } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui/src/components/Wallets', () => ({
  Wallets: ({ walletType }) => <div data-testid='wallets-ui' data-wallet-type={walletType || ''} />
}))
vi.mock('~ui/src/components/GiftCard/GiftCardUI', () => ({
  GiftCardUI: ({ walletType }) => <div data-testid='gift-card-ui' data-wallet-type={walletType || ''} />
}))

describe('Wallets page', () => {
  it('renders default wallets controller', () => {
    const { getByTestId } = renderWithProviders(<Wallets />, {
      initialEntries: ['/profile/wallets'],
      routePath: '/profile/wallets'
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'wallets')
    expect(getByTestId('wallets-ui')).toBeInTheDocument()
  })

  it('renders gift card UI when wallet query is gift_card', () => {
    const { getByTestId } = renderWithProviders(<Wallets />, {
      initialEntries: ['/profile/wallets?wallet=gift_card'],
      routePath: '/profile/wallets'
    })

    expect(getByTestId('gift-card-ui')).toHaveAttribute('data-wallet-type', 'gift_card')
  })
})
