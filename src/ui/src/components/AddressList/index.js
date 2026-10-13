import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import {
  AddressListContainer,
  AddressListUl,
  AddressItem,
  AddressItemActions,
  WrappNotAddresses,
  ContinueButton,
  AddressTitle,
  AddressHalfContainer,
  List,
  AddressFormContainer,
  TitleFormContainer,
  AddressSubTitle
} from './styles'

import { AddressList as AddressListController } from '~components/components/AddressList'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useCustomer } from '~components/contexts/CustomerContext'
import { useEvent } from '~components/contexts/EventContext'

import { Button } from '~ui/src/styles/Buttons'
import { Modal } from '~ui/src/components/Modal'
import { Confirm } from '~ui/src/components/Confirm'
import { scrollTo, capitalize } from '~ui/utils'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'
import { AddressForm } from '~ui/src/components/AddressForm'

import { Icon } from '~ui-icon'

const AddressListUI = (props) => {
  const {
    actionStatus,
    addressList,
    handleDelete,
    setAddressList,
    handleSetDefault,
    isModal,
    isPopover,
    isProductForm,
    userId,
    userCustomerSetup,
    isEnableContinueButton,
    setCustomerModalOpen,
    isCustomerMode,
    isFromCheckout,
    setIsAddressFormOpen,
    isProfile,
    onCancel,
    isOpenUserData,
    setExtraModalWidth,
    title
  } = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [events] = useEvent()
  const [curAddress, setCurAddress] = useState(false)
  const [addressOpen, setAddressOpen] = useState(false)
  const [confirm, setConfirm] = useState({ open: false, content: null, handleOnAccept: null })
  const theme = useTheme()
  const [{ user }] = useCustomer()
  const { width } = useWindowSize()
  const isCompletedLayout = width < 769 || isProfile
  const uniqueAddressesList = (addressList.addresses && addressList.addresses.filter(
    (address, i, self) => address.address &&
      i === self.findIndex(obj => (
        address.address === obj.address &&
        address.address_notes === obj.address_notes &&
        address.zipcode === obj.zipcode &&
        address.internal_number === obj.internal_number
      )))) || []

  const showAddress = true
  const showIcons = isProfile
  const showZipcode = false
  const showInternalNumber = false
  const notFoundImage = theme?.profile?.components?.address_list?.components?.image
  const openAddress = (address) => {
    setCurAddress(address)
    setAddressOpen(true)
    setIsAddressFormOpen && setIsAddressFormOpen(true)
    const container = window.document.getElementsByClassName('form_edit')[0]
    container && scrollTo(container, 0, 500)
  }

  const closeAddressForm = () => {
    setAddressOpen(false)
    setIsAddressFormOpen && setIsAddressFormOpen(false)
  }

  const handleSaveAddress = (address) => {
    let found = false
    const addresses = addressList.addresses.map(_address => {
      if (_address?.id === address?.id) {
        Object.assign(_address, address)
        found = true
      } else if (address.default) {
        _address.default = false
      }
      return _address
    })
    if (!found) {
      addresses.push(address)
    }
    setAddressList({
      ...addressList,
      addresses
    })
    if (userCustomerSetup) {
      handleSetAddress(address)
      return
    }
    closeAddressForm()
    onCancel && onCancel()
  }

  const handleSetAddress = async (address) => {
    if (
      checkAddress(address) &&
      isCustomerMode &&
      userCustomerSetup?.id === user?.id &&
      !isFromCheckout
    ) {
      events.emit('go_to_page', { page: 'search' })
      handleSetDefault(address, userCustomerSetup, true)
      setCustomerModalOpen && setCustomerModalOpen(false)
      return
    }

    closeAddressForm()
    await handleSetDefault(address, userCustomerSetup)
    onCancel && onCancel()
  }

  const handleDeleteClick = (address) => {
    setConfirm({
      open: true,
      content: t('QUESTION_DELETE_ADDRESS', 'Are you sure that you want to delete the address?'),
      handleOnAccept: () => {
        handleDelete(address)
        setConfirm({ ...confirm, open: false })
      }
    })
  }

  const checkAddress = (address) => {
    const props = ['address', 'address_notes', 'zipcode', 'location', 'internal_number']
    const values = []
    if (userCustomerSetup) {
      return address.default
    }
    props.forEach(prop => {
      if (address?.[prop]) {
        if (prop === 'location') {
          values.push(address?.[prop].lat === orderState?.options?.address?.[prop]?.lat &&
            address?.[prop].lng === orderState?.options?.address?.[prop]?.lng)
        } else {
          values.push(address?.[prop] === orderState?.options?.address?.[prop])
        }
      } else {
        values.push(orderState?.options?.address?.[prop] === null || orderState?.options?.address?.[prop] === '')
      }
    })
    return values.every(value => value)
  }

  /**
   * Close modals and alerts
   */
  useEffect(() => {
    return () => {
      setConfirm({ ...confirm, open: false })
    }
  }, [])

  useEffect(() => {
    if (addressList?.addresses?.length === 0 && !addressList.loading && isCustomerMode) {
      openAddress({})
    }
  }, [addressList.loading, addressList?.addresses?.length])

  useEffect(() => {
    setExtraModalWidth && setExtraModalWidth(addressOpen)
  }, [addressOpen])

  useEffect(() => {
    if (orderState.loading || addressList.loading) return
    const defaultAddress = uniqueAddressesList.filter(address => address.default)
    const addressId = orderState?.options?.address_id
    const addressOrderOptions = uniqueAddressesList.find(address => address.id === addressId)
    if (isProfile && defaultAddress.length === 0 && addressOrderOptions) {
      handleSetDefault(addressOrderOptions, userCustomerSetup)
    }
  }, [addressList.loading, isProfile, orderState.loading])

  // these are render helpers (called as functions below), NOT components
  // rendered as JSX. Defining a component inside the render body creates a new
  // component type on every re-render, which unmounts/remounts the whole subtree
  // — wiping the open <AddressForm> mid-typing. Calling them inline keeps the
  // element tree stable so form state survives parent re-renders.
  const renderCallcenterLayout = (content) => {
    return (
      <AddressHalfContainer>
        {(!addressOpen || isProfile) && (
          <List halfWidth={addressOpen} id='address_list'>
            {content}
          </List>
        )}
        {addressOpen && (
          <AddressFormContainer isCustomerMode={isCustomerMode} isOpenUserData={isOpenUserData} addressOpen>
            <TitleFormContainer>
              <h1>{curAddress?.id ? title ? t('EDIT_DELIVERY_ADDRESS', 'Edit delivery address') : t('EDIT_ADDRESS_TITLE', 'Edit address') : t('ADD_ADDRESS_TITLE', 'Add address')}</h1>
            </TitleFormContainer>
            <AddressForm
              userId={userId}
              addressesList={addressList?.addresses}
              useValidationFileds
              address={curAddress}
              onCancel={() => closeAddressForm()}
              onSaveAddress={handleSaveAddress}
              userCustomerSetup={userCustomerSetup}
            />
          </AddressFormContainer>
        )}
      </AddressHalfContainer>
    )
  }

  const renderAddressListContent = () => {
    return (
      <>
        {
          isPopover && addressOpen && (
            <AddressForm
              userId={userId}
              addressesList={addressList?.addresses}
              useValidationFileds
              address={curAddress}
              onCancel={() => closeAddressForm()}
              onSaveAddress={handleSaveAddress}
              userCustomerSetup={userCustomerSetup}
            />
          )
        }

        {
          (!addressOpen || isProfile) &&
          !addressList.loading &&
          !actionStatus.loading &&
          !orderState.loading &&
          !addressList.error &&
          addressList?.addresses?.length > 0 &&
          typeof orderState.options?.address === 'object' &&
          ((!addressOpen && isPopover) || isModal) && (
            <AddressListUl id='list'>
              <AddressTitle isProfile={isProfile}>{title || t('SAVED_ADDRESSES', 'Saved addresses')}</AddressTitle>
              {isProfile && (
                <>
                  <Button
                    className='search-address-button'
                    color='primary'
                    onClick={() => openAddress({})}
                    disabled={orderState?.loading || actionStatus.loading}
                  >
                    {(orderState?.loading || actionStatus.loading) ? t('LOADING', 'Loading') : t('SEARCH_FOR_AN_ADDRESS', 'Search for an address')}
                  </Button>
                  <div className='explore-nearby'>
                    {uniqueAddressesList.filter(address => address.default).map(address => (
                      <>
                        <h2>{t('EXPLORE_NEARBY', 'Explore nearby')}</h2>
                        <AddressItem key={address?.id} active={checkAddress(address)} isProfile={isProfile}>
                          <div className='wrapAddress'>
                            {showIcons && (
                              <span className={checkAddress(address) ? 'selected-tag tag' : 'tag'}>
                                {address?.tag === 'home' && <Icon name="house" />}
                                {address?.tag === 'office' && <Icon name="building" />}
                                {address?.tag === 'favorite' && <Icon name="heartOutline" />}
                                {address?.tag === 'other' && <Icon name="plusLg" />}
                              </span>
                            )}
                            {(showAddress || showInternalNumber || showZipcode) && (
                              <div className='address'>
                                <span>{t('CURRENT_LOCATION', 'Current location')}</span>
                                {showAddress && (<span>{address.address}</span>)}
                                <span>{showInternalNumber && address.internal_number} {showZipcode && address.zipcode}</span>
                              </div>
                            )}
                          </div>
                          <AddressItemActions className='form' isProfile={isProfile}>
                            <a className={actionStatus.loading ? 'disabled' : ''} onClick={(e) => {
                              e.stopPropagation()
                              openAddress(address)
                            }}>
                              <Icon name="pencil" />
                            </a>
                          </AddressItemActions>
                        </AddressItem>
                      </>
                    ))}
                  </div>
                  {
                    uniqueAddressesList.filter(address => !address.default).length > 0 && (
                      <>
                        <div className='divider' />
                        <AddressSubTitle>{t('SAVED_ADDRESSES', 'Saved addresses')}</AddressSubTitle>
                      </>
                    )
                  }
                </>
              )}
              {uniqueAddressesList.filter(address => isProfile ? !address.default : true).map(address => (
                <AddressItem key={address?.id} active={checkAddress(address)} isProfile={isProfile} onClick={() => handleSetAddress(address)}>
                  <div className='wrapAddress'>
                    {showIcons && (
                      <span className={checkAddress(address) ? 'selected-tag tag' : 'tag'}>
                        {address?.tag === 'home' && <Icon name="house" />}
                        {address?.tag === 'office' && <Icon name="building" />}
                        {address?.tag === 'favorite' && <Icon name="heartOutline" />}
                        {address?.tag === 'other' && <Icon name="plusLg" />}
                      </span>
                    )}
                    {(showAddress || showInternalNumber || showZipcode) && (
                      <div className='address'>
                        <span>{address?.tag === 'home'
                          ? t('ADDRESS_HOME', 'Home')
                          : t(address?.tag?.toUpperCase() ?? 'OTHER', capitalize(address?.tag || 'Other'))}</span>
                        {showAddress && (<span>{address.address}</span>)}
                        <span>{showInternalNumber && address.internal_number} {showZipcode && address.zipcode}</span>
                      </div>
                    )}
                  </div>
                  <AddressItemActions className='form' isProfile={isProfile}>
                    <a className={actionStatus.loading ? 'disabled' : ''} onClick={(e) => {
                      e.stopPropagation()
                      openAddress(address)
                    }}>
                      <Icon name="pencil" />
                    </a>
                    <a className={actionStatus.loading || address.default ? 'disabled' : '' + 'red'} onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(address)
                    }}>
                      <Icon name="trashFilled" />
                    </a>
                  </AddressItemActions>
                </AddressItem>
              ))}
              {isEnableContinueButton && uniqueAddressesList.map(address => address.default && (
                <ContinueButton key={address.id}>
                  <Button color='primary' onClick={() => handleSetAddress(address)}>
                    {t('CONTINUE_WITH', 'Continue with')}: {address.address}
                  </Button>
                </ContinueButton>
              ))}
              {!isProfile && (
                <div className='add-address-button'>
                  <Button
                    className='add'
                    outline
                    color={isEnableContinueButton && addressList?.addresses?.length > 0 ? 'secondary' : 'primary'}
                    onClick={() => openAddress({})}
                    disabled={orderState?.loading || actionStatus.loading}
                  >
                  {(orderState?.loading || actionStatus.loading) ? t('LOADING', 'Loading') : t('ADD_NEW_ADDRESS', 'Add New Address')}
                  </Button>
                </div>
              )}
            </AddressListUl>
          )
        }

        {!(addressList.loading || actionStatus.loading || orderState.loading) &&
          !addressList.error &&
          addressList?.addresses?.length === 0 &&
          (
            isProductForm
              ? (
                <div className='add-address-button'>
                  <Button
                    className='add'
                    color='primary'
                    onClick={() => openAddress({})}
                    disabled={orderState?.loading || actionStatus.loading}
                  >
                    {(orderState?.loading || actionStatus.loading) ? t('LOADING', 'Loading') : t('ADD_NEW_ADDRESS', 'Add New Address')}
                  </Button>
                </div>
                )
              : (
                <WrappNotAddresses isCustomerMode={isCustomerMode}>
                  {!isCustomerMode && (
                    <NotFoundSource
                      variant='empty'
                      content={t('NOT_FOUND_ADDRESS', 'Sorry, You don\'t seem to have any addresses.')}
                    />
                  )}
                </WrappNotAddresses>
                )
          )}

        {!(addressList.loading || actionStatus.loading || orderState.loading) && addressList.error && (
          addressList.error.length > 0 && (
            <NotFoundSource
              image={notFoundImage}
              content={addressList.error[0]?.message || addressList.error[0]}
            />
          )
        )}

        {!(addressList.loading || actionStatus.loading || orderState.loading) && (typeof orderState.options?.address !== 'object') && !addressList.error && (
          <NotFoundSource
            content={t('NETWORK_ERROR', 'Network error, please reload the page')}
          />
        )}

        {(addressList.loading || actionStatus.loading || orderState.loading) && !isProductForm && (
          <AddressListUl>
            <Skeleton height={50} count={3} style={{ marginBottom: '10px' }} />
          </AddressListUl>
        )}
      </>
    )
  }

  return (
    <AddressListContainer id='address_control' isLoading={actionStatus?.loading || orderState?.loading} isCompletedLayout={isCompletedLayout}>
      {!isCompletedLayout
        ? renderCallcenterLayout(renderAddressListContent())
        : renderAddressListContent()}
      {
        !isPopover && addressOpen && isCompletedLayout && (
          <Modal
            title={t('WHAT_IS_YOUR_ADDRESS', 'What\'s your address?')}
            open={!isPopover && addressOpen && isCompletedLayout}
            onClose={() => closeAddressForm()}
          >
            <AddressForm
              userId={userId}
              addressesList={addressList?.addresses}
              useValidationFileds
              address={curAddress}
              onSaveAddress={handleSaveAddress}
              userCustomerSetup={userCustomerSetup}
              onCancel={() => closeAddressForm()}
            />
          </Modal>
        )
      }
      <Confirm
        title={t('SEARCH', 'Search')}
        content={confirm.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={confirm.open}
        onClose={() => setConfirm({ ...confirm, open: false })}
        onCancel={() => setConfirm({ ...confirm, open: false })}
        onAccept={confirm.handleOnAccept}
        closeOnBackdrop={false}
      />
    </AddressListContainer>
  )
}

export const AddressList = React.memo((props) => {
  const addressListProps = {
    ...props,
    UIComponent: AddressListUI
  }

  return <AddressListController {...addressListProps} />
})
