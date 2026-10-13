import React, { useState, useEffect, useCallback } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { useApi } from '~components/contexts/ApiContext'
import { useSession } from '~components/contexts/SessionContext'
import { useWebsocket } from '~components/contexts/WebsocketContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useToast, ToastType } from '~components/contexts/ToastContext'
import { Modal } from '~ui/src/components/Modal'
import { Confirm } from '~ui/src/components/Confirm'
import { Button } from '~ui/src/styles/Buttons'
import { StripeElementsForm } from '~ui/src/components/StripeElementsForm'
import { Icon } from '~ui/src/components/Icon'

import { useSavedCardsGateway } from './useSavedCardsGateway'
import {
  Container,
  Header,
  CardsList,
  CardItem,
  CardData,
  CardBrand,
  CardNumber,
  DeleteButton,
  EmptyState,
  IframeWrapper
} from './styles'

const DUMMY_BUSINESS_ID = -1
const BRAINTREE_PLUGIN_ORIGIN = 'https://paypal-braintree.plugins.orderingplus.com'

export const SavedCards = () => {
  const [, t] = useLanguage()
  const [ordering] = useApi()
  const [{ token, user }] = useSession()
  const socket = useWebsocket()
  const [, { showToast }] = useToast()
  const { gateway, paymethodId, isAvailable, loading: gatewayLoading } = useSavedCardsGateway()

  const [cardsState, setCardsState] = useState({ loading: true, cards: [], error: null })
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [publicKey, setPublicKey] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState({ open: false, card: null })

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-App-X': ordering.appId,
    'X-INTERNAL-PRODUCT-X': ordering.appInternalName,
    'X-Socket-Id-X': socket?.getId()
  }

  const loadCards = useCallback(async () => {
    if (!isAvailable) return
    setCardsState(prev => ({ ...prev, loading: true, error: null }))
    try {
      if (gateway === 'braintree') {
        const response = await fetch(`${ordering.root}/users/${user.id}/paymethods/${paymethodId}/paymethods`, { headers, method: 'GET' })
        const content = await response.json()
        if (content.error) throw new Error(Array.isArray(content.result) ? content.result[0] : content.result)
        const cards = content.result.map(card => ({ ...card, ...card.type_data, id: card.id, card_token: card.external_id }))
        setCardsState({ loading: false, cards, error: null })
      } else {
        const { content: { error, result } } = await ordering.setAccessToken(token).paymentCards(DUMMY_BUSINESS_ID, user.id).get()
        if (error) throw new Error(Array.isArray(result) ? result[0] : result)
        setCardsState({ loading: false, cards: result || [], error: null })
      }
    } catch (err) {
      setCardsState({ loading: false, cards: [], error: err.message })
    }
  }, [isAvailable, gateway, paymethodId, ordering, token, user])

  useEffect(() => {
    if (gatewayLoading) return
    if (isAvailable) loadCards()
    else setCardsState({ loading: false, cards: [], error: null })
  }, [gatewayLoading, isAvailable, loadCards])

  useEffect(() => {
    if (gateway !== 'stripe' || !addModalOpen || publicKey) return
    const getCredentials = async () => {
      try {
        const { content: { result } } = await ordering.setAccessToken(token).paymentCards().getCredentials()
        setPublicKey(result?.publishable)
      } catch (err) {
        showToast(ToastType.Error, err.message)
      }
    }
    getCredentials()
  }, [gateway, addModalOpen, publicKey, ordering, token])

  useEffect(() => {
    if (gateway !== 'braintree' || !addModalOpen) return
    const handleMessage = (event) => {
      if (event?.origin !== BRAINTREE_PLUGIN_ORIGIN) return
      let payment
      try {
        payment = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      } catch (parseError) {
        return
      }
      if (payment?.action === 'card' && !payment?.data?.transient_token) {
        setAddModalOpen(false)
        loadCards()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [gateway, addModalOpen, loadCards])

  const handleDeleteConfirmed = async () => {
    const card = confirmDelete.card
    setConfirmDelete({ open: false, card: null })
    if (!card) return
    try {
      if (gateway === 'braintree') {
        const response = await fetch(`${ordering.root}/users/${user.id}/paymethods/${paymethodId}/paymethods/${card.id}`, { method: 'DELETE', headers })
        const { error, result } = await response.json()
        if (error) {
          showToast(ToastType.Error, result)
          return
        }
      } else {
        const { content: { error, result } } = await ordering.paymentCards(DUMMY_BUSINESS_ID, user.id, card.id).delete()
        if (error) {
          showToast(ToastType.Error, result)
          return
        }
      }
      setCardsState(prev => ({ ...prev, cards: prev.cards.filter(c => c.id !== card.id) }))
    } catch (err) {
      showToast(ToastType.Error, err.message)
    }
  }

  const onNewStripeCard = () => {
    setAddModalOpen(false)
    loadCards()
  }

  const braintreeIframeUrl = `${BRAINTREE_PLUGIN_ORIGIN}/${ordering.project}/views/card_form/user/${user?.id}/business/${DUMMY_BUSINESS_ID}?access_token=${token}&language=${ordering.language}`
  const showLoading = gatewayLoading || cardsState.loading
  const showError = !showLoading && isAvailable && !!cardsState.error
  const showCards = !showLoading && isAvailable && !cardsState.error && cardsState.cards.length > 0
  const showEmpty = !showLoading && isAvailable && !cardsState.error && cardsState.cards.length === 0

  return (
    <Container>
      <Header>
        <h1>{t('MY_CARDS', 'My cards')}</h1>
        {isAvailable && !showLoading && (
          <Button color='primary' onClick={() => setAddModalOpen(true)}>
            {t('ADD_CARD', 'Add card')}
          </Button>
        )}
      </Header>

      {showLoading && (
        <CardsList>
          <Skeleton height={56} />
          <Skeleton height={56} />
        </CardsList>
      )}

      {!showLoading && !isAvailable && (
        <EmptyState>{t('SAVED_CARDS_NOT_AVAILABLE', 'Saved cards are not available for this store.')}</EmptyState>
      )}

      {showError && (
        <EmptyState>{t('SAVED_CARDS_LOAD_ERROR', 'We could not load your cards. Please try again later.')}</EmptyState>
      )}

      {showEmpty && (
        <EmptyState>{t('NO_SAVED_CARDS', 'You have no saved cards yet.')}</EmptyState>
      )}

      {showCards && (
        <CardsList>
          {cardsState.cards.map(card => (
            <CardItem key={card.id}>
              <CardData>
                <Icon name='creditCard' />
                <CardBrand>{card.brand}</CardBrand>
                <CardNumber>•••• {card.last4}</CardNumber>
              </CardData>
              <DeleteButton onClick={() => setConfirmDelete({ open: true, card })}>
                <Icon name='trashFilled' />
              </DeleteButton>
            </CardItem>
          ))}
        </CardsList>
      )}

      {addModalOpen && (
        <Modal
          open={addModalOpen}
          title={t('ADD_CARD', 'Add card')}
          onClose={() => setAddModalOpen(false)}
          width='600px'
        >
          {gateway === 'braintree'
            ? (
            <IframeWrapper>
              <iframe title='braintree-card-form' src={braintreeIframeUrl} />
            </IframeWrapper>
              )
            : publicKey
              ? (
              <StripeElementsForm
                publicKey={publicKey}
                businessId={DUMMY_BUSINESS_ID}
                toSave
                onNewCard={onNewStripeCard}
                onCancel={() => setAddModalOpen(false)}
              />
                )
              : (
              <Skeleton height={200} />
                )}
        </Modal>
      )}

      <Confirm
        open={confirmDelete.open}
        content={t('QUESTION_DELETE_CARD', 'Are you sure you want to delete this card?')}
        onClose={() => setConfirmDelete({ open: false, card: null })}
        onCancel={() => setConfirmDelete({ open: false, card: null })}
        onAccept={handleDeleteConfirmed}
        closeOnBackdrop={false}
      />
    </Container>
  )
}
