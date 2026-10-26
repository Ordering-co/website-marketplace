import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from 'styled-components'
import {
  OrderTypeSelectorContainer,
  OrderTypesContainer,
  AddressMenu,
  AddressOrderTypeWrapper,
  AddressContainer
} from './styles'

import { useConfig } from '~components/contexts/ConfigContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { OrderTypeControl } from '~components/components/OrderTypeControl'
import { useSession } from '~components/contexts/SessionContext'

import loadable from '@loadable/component'
import { Modal } from '~ui/src/components/Modal'
import { Alert } from '~ui/src/components/Confirm'
import { capitalize } from '~ui/utils'

import Button from '../../styles/Buttons'

import { Icon } from '~ui-icon'

// Modal contents open on interaction — lazy keeps maps/phone-metadata vendors
// out of the entry chunk (this component renders in the always-visible header).
const AddressForm = loadable(() => import('~ui/src/components/AddressForm').then((m) => m.AddressForm))
const AddressList = loadable(() => import('~ui/src/components/AddressList').then((m) => m.AddressList))

export const AddressOrderTypeUI = (props) => {
  const {
    handleChangeOrderType,
    orderTypes,
    configTypes,
    typeSelected,
    setOrderTypeValue,
    hideOrderTypes
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [orderState] = useOrder()
  const [{ auth }] = useSession()
  const [modals, setModals] = useState({ listOpen: false, formOpen: false, citiesOpen: false })
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dropDown = useRef(null)
  const hideAddress = true
  const selectAsPickup = [2, 3, 4, 5, 9]
  const orderTypesAllowed = orderTypes && (configTypes ? orderTypes.filter(type => configTypes?.includes(type.value)) : orderTypes)
  const fromWorker = typeof window !== 'undefined' && (window.__FIRST_LOAD__ || window.__CONFIG__)

  const handleChangeOrderTypeCallback = async (orderType) => {
    if (!orderState.loading) {
      setOrderTypeValue && setOrderTypeValue(orderType)
      await handleChangeOrderType(orderType)
      if (fromWorker && !selectAsPickup.includes(orderType) && !orderState?.options?.address?.location) {
        setModals({ ...modals, formOpen: true })
      }
    }
  }

  const handleFindBusinesses = () => {
    if (!orderState?.options?.address?.location) {
      setAlertState({ open: true, content: [t('SELECT_AN_ADDRESS_TO_SEARCH', 'Select or add an address to search')] })
      return
    }
    setModals({ listOpen: false, formOpen: false })
  }

  const handleCloseAlerts = () => {
    setAlertState({ open: false, content: [] })
  }

  const handleClickAddress = (e) => {
    if (auth) {
      setModals({ ...modals, listOpen: true })
    } else {
      setModals({ ...modals, formOpen: true })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDown?.current && !dropDown?.current?.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <AddressOrderTypeWrapper hideOrderTypes={hideOrderTypes}>
      {!hideAddress && (
        <AddressContainer onClick={() => handleClickAddress()} hideOrderTypes={hideOrderTypes}>
          <AddressMenu>
            {orderState?.options?.address?.tag && (
              <span>{t(orderState?.options?.address?.tag?.toUpperCase(), capitalize(orderState?.options?.address?.tag))}</span>
            )}
            <div>
              <span>
                {orderState.options?.address?.address || t('WHERE_DO_WE_DELIVERY', 'Where do we deliver?')}
              </span>
            </div>
          </AddressMenu>
          <Icon name="pencil" />
        </AddressContainer>
      )}
      {!hideOrderTypes && (
        <OrderTypesContainer className='order-type'>
          {orderTypesAllowed && orderTypesAllowed.length > 2
            ? (
            <div>
              <OrderTypeSelectorContainer>
                {orderTypesAllowed.some(type => type.value === 1) && (
                  <Button
                    avoidOpacity
                    disabled={orderState?.loading}
                    initialIcon
                    onClick={() => handleChangeOrderTypeCallback(1)}
                    className={typeSelected === 1 ? 'selected' : ''}
                  >
                    <p><span className='ot-label'>{orderTypesAllowed.find(type => type.value === 1).text}</span></p>
                  </Button>
                )}

                {orderTypesAllowed.filter(type => type.value !== 1).length > 0 && (
                  <>
                    <Button
                      avoidOpacity
                      disabled={orderState?.loading}
                      initialIcon
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={selectAsPickup.includes(typeSelected) ? 'selected' : ''}
                    >
                      <p>
                        <span className='ot-label'>
                          {orderTypesAllowed
                            .filter(type => type.value !== 1)
                            .find(type => type.value === typeSelected)?.text ||
                            orderTypesAllowed.find(type => type.value !== 1)?.text}
                        </span>
                        <Icon name="chevronDown" className='dropdown-arrow' />
                      </p>
                    </Button>
                    {isDropdownOpen && (
                      <div className='pickup-dropdown-container' ref={dropDown}>
                        {orderTypesAllowed
                          .filter(type => type.value !== 1)
                          .map((orderType, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                handleChangeOrderTypeCallback(orderType.value)
                                setIsDropdownOpen(false)
                              }}
                              className={`dropdown-item ${typeSelected === orderType.value ? 'selected' : ''}`}
                            >
                              {orderType.text}
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </OrderTypeSelectorContainer>
            </div>
              )
            : (
            <OrderTypeSelectorContainer>
              {orderTypesAllowed.map((orderType, i) => (
                <Button
                  key={i}
                  disabled={orderState?.loading}
                  initialIcon
                  onClick={() => handleChangeOrderTypeCallback(orderType.value)}
                  className={typeSelected === orderType.value ? 'selected' : ''}
                >
                  <p><span className='ot-label'>{orderType.text}</span></p>
                </Button>
              ))}
            </OrderTypeSelectorContainer>
              )}
        </OrderTypesContainer>
      )}
      {modals.formOpen && (
        <Modal
          title={t('ADDRESS_FORM', 'Address Form')}
          open={modals.formOpen}
          onClose={() => setModals({ ...modals, formOpen: false })}
        >
          <AddressForm
            useValidationFileds
            address={orderState?.options?.address || {}}
            onClose={() => setModals({ ...modals, formOpen: false })}
            onCancel={() => setModals({ ...modals, formOpen: false })}
            onSaveAddress={() => setModals({ ...modals, formOpen: false })}
          />
        </Modal>
      )}
      {modals.listOpen && (
        <Modal
          open={modals.listOpen}
          width='40%'
          minHeight='90vh'
          onClose={() => setModals({ ...modals, listOpen: false })}
          closeIconRight
          closeIconColor='#fff'
          bgImage={theme?.images?.general?.homeHeroWithBanner}
        >
          <AddressList
            isHideTitle
            isModal
            changeOrderAddressWithDefault
            onCancel={() => setModals({ ...modals, listOpen: false })}
            onAccept={() => handleFindBusinesses()}
            isMobile
          />
        </Modal>
      )}
      <Alert
        title={t('ORDERING', 'Ordering')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => handleCloseAlerts()}
        onAccept={() => handleCloseAlerts()}
        closeOnBackdrop={false}
      />
    </AddressOrderTypeWrapper>
  )
}

export const AddressOrderType = (props) => {
  const [, t] = useLanguage()
  const [configState] = useConfig()

  const orderTypeProps = {
    ...props,
    UIComponent: AddressOrderTypeUI,
    configTypes: configState?.configs?.order_types_allowed?.value?.split('|').map(value => Number(value)) || [],
    orderTypes: props.orderTypes || [
      {
        value: 1,
        text: t('DELIVERY', 'Delivery'),
        description: t('ORDERTYPE_DESCRIPTION_DELIVERY', 'We bring your order to your door')
      },
      {
        value: 2,
        text: t('PICKUP', 'Pickup'),
        description: t('ORDERTYPE_DESCRIPTION_PICKUP', 'Order ahead and pick it up at the store')
      },
      {
        value: 3,
        text: t('EAT_IN', 'Eat in'),
        description: t('ORDERTYPE_DESCRIPTION_EATIN', 'Order ahead and enjoy it at the restaurant')
      },
      {
        value: 4,
        text: t('CURBSIDE', 'Curbside'),
        description: t('ORDERTYPE_DESCRIPTION_CURBSIDE', 'We bring your order out to your car')
      },
      {
        value: 5,
        text: t('DRIVE_THRU', 'Drive thru'),
        description: t('ORDERTYPE_DESCRIPTION_DRIVETHRU', 'Pick up your order without leaving your car')
      },
      {
        value: 9,
        text: t('RESERVATION', 'Reservation'),
        description: t('ORDERTYPE_DESCRIPTION_RESERVATION', 'Book a table in advance')
      }
    ]
  }

  return <OrderTypeControl {...orderTypeProps} />
}
