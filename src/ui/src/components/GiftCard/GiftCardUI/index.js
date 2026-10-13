import React, { useState } from 'react'
import { PurchaseGiftCard } from '../PurchaseGiftCard'
import { RedeemGiftCard } from '../RedeemGiftCard'

import {
  Container,
  TitleWrapper,
  ActionWrapper,
  Title,
  GiftCardContainer,
  Hero,
  HeroCard,
  HeroCopy,
  Divider
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { Modal } from '~ui/src/components/Modal'
import { Button } from '~ui/src/styles/Buttons'

import { Icon } from '~ui-icon'

export const GiftCardUI = (props) => {
  const [, t] = useLanguage()
  const [openModal, setOpenModal] = useState(null)

  return (
    <GiftCardContainer>
      <Title>
        {t('GIFT_CARD_WALLET', 'Gift Card Wallet')}
      </Title>
      <Hero>
        <HeroCard>
          <div className='card-top'>
            <span className='brand'>{t('GIFT_CARD', 'Gift Card')}</span>
            <Icon name="gift" />
          </div>
          <span className='card-label'>{t('GIFT_CARD_WALLET', 'Gift Card Wallet')}</span>
        </HeroCard>
        <HeroCopy>
          <h2>{t('GIFT_CARD_WALLET_TITLE', 'Give the gift of special moments with our Gift Cards')}</h2>
          <p>{t('GIFT_CARD_WALLET_DESCRIPTION', 'Our Gift Cards are the perfect way to surprise someone special. Whether it’s for a birthday, a celebration, or just to brighten their day, they offer flexibility and the freedom to choose what they love most. The perfect gift for any occasion!')}</p>
        </HeroCopy>
      </Hero>
      <Divider />
      <PurchaseGiftCard isPage />
      <Container>
        <TitleWrapper>
          <h1>{t('GIFT_CARD', 'Gift card')}</h1>
        <Icon name="gift" />
      </TitleWrapper>
      <ActionWrapper>
        <div className='gift-card-text'>
          <h2>{t('GOT_GIFT_CARD', 'Got a Gift Card?')}</h2>
          <p>{t('REDEEM_IT_HERE', 'Redeem it here!')}</p>
        </div>
        <Button
          color='lightGray'
          className='light'
          onClick={() => setOpenModal('redeem')}
        >
          {t('REDEEM', 'Redeem')}
        </Button>
      </ActionWrapper>
      {openModal === 'purchase' && (
        <Modal
          width='700px'
          padding='0px'
          open={openModal === 'purchase'}
          onClose={() => setOpenModal(null)}
        >
          <PurchaseGiftCard />
        </Modal>
      )}
      {openModal === 'redeem' && (
        <Modal
          width='700px'
          open={openModal === 'redeem'}
          onClose={() => setOpenModal(null)}
          padding='30px'
        >
          <RedeemGiftCard
            hideTopPlaceholders
            onClose={() => setOpenModal(null)}
          />
          </Modal>
      )}
      </Container>
    </GiftCardContainer>
  )
}
