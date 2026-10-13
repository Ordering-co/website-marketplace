import React, { useEffect, useState } from 'react'

import { AddNewCard } from '../PaymentOptionStripe/styles'

import { PaymentOptionStripe } from '~components/components/PaymentOptionStripe'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useSession } from '~components/contexts/SessionContext'
import { Modal } from '~ui/src/components/Modal'
import { CardFormCustom } from '~ui/src/components/CardFormCustom'
import { PaymentOptionStripeUI } from '~ui/src/components/PaymentOptionStripe'

const iframeCardForm = ['globalpay', 'braintree', 'cybersource']

const PaymentOptionCardUI = (props) => {
  const {
    deleteCard,
    cardsList,
    handleCardClick,
    handleNewCard,
    paymethodSelected,
    cardSelected,
    gateway,
    paymethodsWithoutSaveCards,
    onSelectCard,
    paymethodSelectedInfo,
    paymethodV2Featured,
    deleteUserCard,
    setOpenModal,
    deleteBusinessUserPaymethod
  } = props

  const [, t] = useLanguage()
  const [{ token }] = useSession()

  const [addCardOpen, setAddCardOpen] = useState(false)

  useEffect(() => {
    if (!cardsList?.loading && cardsList?.cards?.length === 0 && !paymethodV2Featured) {
      setAddCardOpen(true)
    }
  }, [cardsList?.loading, cardsList?.cards?.length, paymethodSelectedInfo?.paymethod?.gateway])

  return (
    <>
      <PaymentOptionStripeUI
        deleteCard={deleteCard}
        cardsList={cardsList}
        handleCardClick={handleCardClick}
        handleNewCard={handleNewCard}
        paymethodSelected={paymethodSelected}
        cardSelected={cardSelected}
        gateway={gateway}
        onSelectCard={onSelectCard}
        paymethodV2Featured={paymethodV2Featured}
        deleteUserCard={deleteUserCard}
        deleteBusinessUserPaymethod={deleteBusinessUserPaymethod}
      />

      {token &&
        !cardsList.loading &&
        (!cardSelected || !paymethodsWithoutSaveCards.includes(gateway)) &&
        ((!paymethodV2Featured || (paymethodV2Featured.includes('get_cards') && paymethodV2Featured.includes('register_cards')))) && (
          <AddNewCard>
            <span onClick={() => {
              iframeCardForm.includes(gateway) ? setOpenModal((prev) => ({ ...prev, iframe: true })) : setAddCardOpen(true)
            }}>{t('ADD_NEW_CARD', 'Add new card')}</span>
          </AddNewCard>
      )}
      {addCardOpen && (
        <Modal
          open={addCardOpen}
          onClose={() => setAddCardOpen(false)}
          title={t('ADD_NEW_CARD', 'Add new card')}
        >
          <CardFormCustom handleNewCard={handleNewCard} setAddCardOpen={setAddCardOpen} />
        </Modal>
      )}
    </>
  )
}

export const PaymentOptionCard = (props) => {
  const paymentOptionStripeProps = {
    ...props,
    UIComponent: PaymentOptionCardUI
  }
  return (
    <PaymentOptionStripe {...paymentOptionStripeProps} />
  )
}
