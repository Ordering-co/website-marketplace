import React from 'react'
import { useLocation } from 'react-router-dom'
import { HelmetTags } from '../../components/HelmetTags'

import { Wallets as WalletsController } from '~ui/src/components/Wallets'
import { GiftCardUI } from '~ui/src/components/GiftCard/GiftCardUI'

export const Wallets = (props) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const walletType = searchParams.get('wallet')

  const WalletComponent = walletType === 'gift_card' ? GiftCardUI : WalletsController
  return (
    <>
      <HelmetTags page='wallets' />
      <WalletComponent {...props} walletType={walletType} />
    </>
  )
}

export default Wallets
