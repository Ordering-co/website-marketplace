import React, { useState } from 'react'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import {
  ModalBody,
  StepSubtitle,
  FormGroup,
  Label,
  TextAreaInput,
  NumberInput,
  MinMaxRow,
  StepActions,
  BackButton,
  ContinueButton,
  ItemList,
  ItemRow,
  AddProductLink,
  PaymentOptions,
  PaymentOption,
  DeliveryFeeDisplay
} from './styles'

import { Icon } from '~ui-icon'

export const Step2 = ({ distanceKm, pluginConfig, actionState, initialData, onPlaceOrder, onBack }) => {
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()

  const [items, setItems] = useState(initialData?.items?.length > 0 ? initialData.items : [{ name: '', quantity: 1 }])
  const [paymethod, setPaymethod] = useState(initialData?.paymethod || 'cash')
  const [instructions, setInstructions] = useState(initialData?.instructions || '')
  const minDeclaredValue = 30
  const maxDeclaredValue = 5500
  const [declaredValue, setDeclaredValue] = useState(initialData?.declaredValue || String(minDeclaredValue))

  const multiplier = pluginConfig?.delivery_fee_multiplier || 0
  const deliveryFee = distanceKm && multiplier ? Math.round(distanceKm * multiplier * 100) / 100 : 0

  const validItems = items.filter(item => item.name.trim())
  const canPlaceOrder = validItems.length > 0 && !actionState?.loading

  const handleAddItem = () => {
    setItems(prev => [...prev, { name: '', quantity: 1 }])
  }

  const handleUpdateQty = (index, increment) => {
    if (!increment && items[index]?.quantity <= 1) {
      setItems(prev => prev.filter((_, i) => i !== index))
      return
    }
    setItems(prev => prev.map((item, i) => {
      if (i !== index) return item
      return { ...item, quantity: increment ? item.quantity + 1 : item.quantity - 1 }
    }))
  }

  const handlePlaceOrder = () => {
    if (!canPlaceOrder) return
    onPlaceOrder({ items: validItems, paymethod, instructions, declaredValue })
  }

  const maxWeight = pluginConfig?.max_weight || 0

  return (
    <ModalBody>
      {maxWeight > 0 && (
        <StepSubtitle>
          {t('CUSTOM_ORDER_MAX_WEIGHT_HINT', 'Your order must not exceed _MAX_ kg in weight').replace('_MAX_', maxWeight)}
        </StepSubtitle>
      )}

      <ItemList>
        {items.map((item, index) => (
          <ItemRow key={index}>
            <input
              className='item-name-input'
              placeholder={t('CUSTOM_ORDER_ITEM_NAME_PLACEHOLDER', 'Describe the product')}
              value={item.name}
              onChange={e => {
                const value = e.target.value
                setItems(prev => prev.map((it, i) => i === index ? { ...it, name: value } : it))
              }}
            />
            <div className='item-qty-controls'>
              <button className='qty-btn' onClick={() => handleUpdateQty(index, false)}>
                <Icon name="dashCircle" />
              </button>
              <span className='qty-value'>{item.quantity}</span>
              <button className='qty-btn' onClick={() => handleUpdateQty(index, true)}>
                <Icon name="plusCircle" />
              </button>
            </div>
          </ItemRow>
        ))}
        <AddProductLink onClick={handleAddItem}>
          {t('ADD_ANOTHER_PRODUCT', 'Add another product')}
        </AddProductLink>
      </ItemList>

      <FormGroup>
        <Label>{t('CUSTOM_ORDER_PAYMENT_METHOD', 'Payment method')}</Label>
        <PaymentOptions>
          <PaymentOption
            selected={paymethod === 'cash'}
            onClick={() => setPaymethod('cash')}
          >
            {t('CASH', 'Cash')}
          </PaymentOption>
          <PaymentOption
            selected={paymethod === 'card_delivery'}
            onClick={() => setPaymethod('card_delivery')}
          >
            {t('CARD_ON_DELIVERY', 'Card on delivery')}
          </PaymentOption>
        </PaymentOptions>
      </FormGroup>

      {deliveryFee > 0 && (
        <DeliveryFeeDisplay>
          <span className='fee-label'>{t('DELIVERY_FEE', 'Delivery fee')}</span>
          <span className='fee-value'>{parsePrice(deliveryFee)}</span>
        </DeliveryFeeDisplay>
      )}

      <FormGroup>
        <Label>{t('CUSTOM_ORDER_INSTRUCTIONS', 'Additional instructions')}</Label>
        <TextAreaInput
          placeholder={t('CUSTOM_ORDER_INSTRUCTIONS_PLACEHOLDER', 'Write any additional instructions...')}
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label>{t('CUSTOM_ORDER_DECLARED_VALUE', 'Select declared value')}</Label>
        <NumberInput
          type='number'
          min={minDeclaredValue}
          max={maxDeclaredValue}
          step='0.01'
          placeholder={parsePrice(minDeclaredValue)}
          value={declaredValue}
          onChange={e => setDeclaredValue(e.target.value)}
        />
        <MinMaxRow>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => setDeclaredValue(String(minDeclaredValue))}
          >
            <strong>MIN</strong><br />{parsePrice(minDeclaredValue)}
          </span>
          <span
            style={{ textAlign: 'right', cursor: 'pointer' }}
            onClick={() => setDeclaredValue(String(maxDeclaredValue))}
          >
            <strong>MAX</strong><br />{parsePrice(maxDeclaredValue)}
          </span>
        </MinMaxRow>
      </FormGroup>

      {actionState?.error && (
        <p style={{ color: '#e53935', fontSize: '13px', marginBottom: '12px' }}>{actionState.error}</p>
      )}

      <StepActions>
        <BackButton onClick={() => onBack({ items, paymethod, instructions, declaredValue })} disabled={actionState?.loading}>
          {t('BACK', 'Back')}
        </BackButton>
        <ContinueButton
          onClick={handlePlaceOrder}
          disabled={!canPlaceOrder}
        >
          <span>
            {actionState?.loading
              ? t('PROCESSING', 'Processing...')
              : t('PLACE_ORDER', 'Place order')
            }
          </span>
          <Icon name="arrowRight" />
        </ContinueButton>
      </StepActions>
    </ModalBody>
  )
}

export default Step2
