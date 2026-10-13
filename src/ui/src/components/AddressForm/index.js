import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useForm } from 'react-hook-form'

import {
  AddressFormContainer,
  FormControl,
  FormFields,
  FormActions,
  AddressWrap,
  WrapAddressInput,
  AddressTagSection,
  WrapperMap,
  WrapperSkeleton,
  AddressTagsDivider
} from './styles'

import { AddressForm as AddressFormController } from '~components/components/AddressForm'
import { AutocompleteInput as GoogleAutocompleteInput } from '~components/components/GoogleAutocompleteInput'
import { useLanguage } from '~components/contexts/LanguageContext'
import { GoogleMaps as GoogleMapsMap } from '~components/components/GoogleMaps'
import { useSession } from '~components/contexts/SessionContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useConfig } from '~components/contexts/ConfigContext'

import { Alert } from '~ui/src/components/Confirm'
import { Button } from '~ui/src/styles/Buttons'
import { Input, TextArea } from '~ui/src/styles/Inputs'
import { GoogleGpsButton } from '~ui/src/components/GoogleGpsButton'
import { Icon } from '~ui-icon'

import { AddressMapBoxList } from './AddressMapBoxList'

const inputNames = [
  { name: 'address', code: 'Address' },
  { name: 'internal_number', code: 'APT / Suite' },
  { name: 'zipcode', code: 'Postal Code' },
  { name: 'address_notes', code: 'Address notes' }
]

const AddressFormUI = (props) => {
  const {
    addressesList,
    googleMapsControls,
    formState,
    addressState,
    isRequiredField,
    showField,
    updateChanges,
    onCancel,
    handleChangeInput,
    saveAddress,
    setIsEdit,
    userCustomerSetup,
    getSuggestedResult,
    mapBoxSuggests,
    retrieveSuggestResult
  } = props

  const [configState] = useConfig()
  const [orderState] = useOrder()
  const [, t] = useLanguage()
  const formMethods = useForm()
  const [{ auth }] = useSession()
  const theme = useTheme()
  const [state, setState] = useState({ selectedFromAutocomplete: true })
  const [addressTag, setAddressTag] = useState(addressState?.address?.tag)
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [addressValue, setAddressValue] = useState(formState.changes?.address ?? addressState.address?.address ?? '')
  const [inputFocused, setInputFocused] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const googleInputRef = useRef()
  const mapBoxContainerRef = useRef()
  const [firstLocationNoEdit, setFirstLocationNoEdit] = useState({ value: null })
  const isEditing = !!addressState.address?.id

  const [locationChange, setLocationChange] = useState(
    isEditing
      ? addressState?.address?.location
      : formState.changes?.location ?? null
  )

  const isHideMap = theme?.address?.components?.map?.hidden
  const isHideIcons = theme?.address?.components?.icons?.hidden

  const maxLimitLocation = configState?.configs?.meters_to_change_address?.value
  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value
  const isLocationRequired = configState.configs?.google_autocomplete_selection_required?.value === '1' ||
    configState.configs?.google_autocomplete_selection_required?.value === 'true'
  const useAlternativeMap = configState?.configs?.use_alternative_to_google_maps?.value === '1'
  const mapErrors = {
    ERROR_NOT_FOUND_ADDRESS: 'Sorry, we couldn\'t find an address',
    ERROR_MAX_LIMIT_LOCATION: `Sorry, You can only set the position to ${maxLimitLocation}m`,
    ERROR_GPS_BUTTON: 'Error to get result with gps button'
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
  }

  /**
   * Returns true when the user made no changes
   * @param {object} address
   */
  const checkAddress = (address, addressToCompare) => {
    const props = ['address', 'address_notes', 'zipcode', 'location', 'internal_number']
    const values = []
    props.forEach(prop => {
      if (addressToCompare[prop]) {
        if (prop === 'location') {
          values.push(address[prop]?.lat === addressToCompare[prop]?.lat &&
            address[prop]?.lng === addressToCompare[prop]?.lng)
        } else {
          values.push(address[prop] === addressToCompare[prop])
        }
      } else {
        values.push(!address[prop])
      }
    })
    return values.every(value => value)
  }

  const getAddressFormatted = (addressChange) => {
    const geocoder = window.google && new window.google.maps.Geocoder()
    if (!geocoder) {
      setAlertState({
        open: true,
        content: [t('ERROR_FAILED_LOAD_GEOCODER', 'Failed to load geocoder, please try again.')]
      })
      return
    }
    // lock the form while the async geocode is in flight so a second
    // submit can't fire another saveAddress and create a duplicate address.
    setIsGeocoding(true)
    const data = { address: null, error: null }
    geocoder.geocode({ address: addressChange }, async (results, status) => {
      let postalCode = null
      try {
        if (status === 'OK' && results && results.length > 0) {
          for (const component of results?.[0].address_components) {
            const addressType = component.types?.[0]
            if (addressType === 'postal_code') {
              postalCode = component.short_name
              break
            }
          }
          data.address = {
            address: addressChange,
            location: { lat: results?.[0].geometry.location.lat(), lng: results?.[0].geometry.location.lng() },
            utc_offset: results?.[0].utc_offset_minutes ?? 0,
            map_data: {
              library: 'google',
              place_id: results?.[0].place_id
            }
          }
          if (postalCode) {
            data.address.zipcode = postalCode
          }
          const arrayList = isEditing
            ? addressesList.filter(address => address.id !== addressState.address?.id) || []
            : addressesList || []
          const addressToCompare = isEditing
            ? { ...addressState.address, ...data.address, ...formState?.changes }
            : { ...data.address, ...formState?.changes }

          const isAddressAlreadyExist = arrayList.map(address => checkAddress(address, addressToCompare)).some(value => value) ?? false
          if (!isAddressAlreadyExist) {
            await saveAddress(data.address, userCustomerSetup)
            return
          }

          setAlertState({
            open: true,
            content: [t('ADDRESS_ALREADY_EXIST', 'The address already exists')]
          })
        } else {
          setAlertState({
            open: true,
            content: [t('ERROR_NOT_FOUND_ADDRESS', 'Error, address not found')]
          })
        }
      } finally {
        setIsGeocoding(false)
      }
    })
  }

  const checkKeyDown = (e) => {
    const keyCode = e.keyCode ? e.keyCode : e.which
    if (keyCode === 13) { e.preventDefault() }
  }

  const onSubmit = async () => {
    if (formState.loading || isGeocoding) return

    if (!auth && formState?.changes?.address === '' && addressState?.address?.address) {
      setAlertState({
        open: true,
        content: [t('VALIDATION_ERROR_ADDRESS_REQUIRED', 'The field Address is required')]
      })
      setLocationChange(null)
      return
    }

    if (formState?.changes?.address && !formState?.changes?.location) {
      if (isLocationRequired) {
        setAlertState({
          open: true,
          content: [t('ADDRESS_REQUIRE_LOCATION', 'The address needs a location, please select one of the suggested')]
        })
        return
      }
      getAddressFormatted(formState?.changes?.address)
      return
    }

    const arrayList = isEditing
      ? addressesList?.filter(address => address?.id !== addressState?.address?.id) || []
      : addressesList || []
    const addressToCompare = isEditing
      ? { ...addressState.address, ...formState.changes }
      : formState?.changes

    const isAddressAlreadyExist = arrayList.map(address => checkAddress(address, addressToCompare)).some(value => value) ?? false

    if (!isAddressAlreadyExist) {
      await saveAddress({}, userCustomerSetup)
      return
    }

    setAlertState({
      open: true,
      content: [t('ADDRESS_ALREADY_EXIST', 'The address already exists')]
    })
  }

  const handleAddressTag = (tag) => {
    setAddressTag(tag)
    handleChangeInput({
      target: {
        name: 'tag',
        value: tag
      }
    })
  }

  const handleChangeAddress = (address, forceUpdate) => {
    setState({
      ...state,
      selectedFromAutocomplete: true
    })
    updateChanges({
      ...address,
      address: forceUpdate ? address?.address : (googleInputRef?.current?.value || address?.address)
    })
    if (forceUpdate && googleInputRef.current) {
      googleInputRef.current.value = address?.address
    }
  }

  const setMapErrors = (errKey) => {
    setAlertState({
      open: true,
      content: !(errKey === 'ERROR_MAX_LIMIT_LOCATION')
        ? [t(errKey, mapErrors[errKey])]
        : `${[t(errKey, mapErrors[errKey])]} ${maxLimitLocation} ${[t('METTERS', 'meters')]}`
    })
  }

  const showFieldWithTheme = (name) => {
    return !theme?.address?.components?.[name]?.hidden
  }

  useEffect(() => {
    if (!auth) {
      setLocationChange(formState?.changes?.location ?? orderState?.options?.address?.location ?? '')
      setAddressValue(formState?.changes?.address ?? orderState?.options?.address?.address ?? '')
      inputNames.forEach(field =>
        formMethods.setValue(
          field.name,
          formState?.changes[field.name] ||
          (orderState?.options?.address && orderState?.options?.address[field.name]) ||
          ''
        )
      )
      return
    }

    if (!formState.loading && formState.result?.error) {
      setAlertState({
        open: true,
        content: formState.result?.result || [t('ERROR', 'Error')]
      })
    }

    setAddressValue(formState?.changes?.address ?? addressState.address?.address ?? '')
    formMethods.setValue('address', formState?.changes?.address ?? addressState.address?.address ?? '')
    if (!isEditing) {
      inputNames.forEach(field => formMethods.setValue(field.name, formState?.changes[field.name] || ''))
      formState?.changes?.address && setLocationChange(formState?.changes?.location)
      if (
        formState?.changes?.address &&
        formState?.changes?.address !== firstLocationNoEdit?.address &&
        formState?.changes?.location &&
        formState?.changes?.location?.lat !== firstLocationNoEdit.value?.lat &&
        formState?.changes?.location?.lng !== firstLocationNoEdit.value?.lng
      ) {
        setFirstLocationNoEdit({
          value: formState?.changes?.location,
          address: formState?.changes?.address
        })
      }
    }

    if (isEditing) {
      if (formState?.changes?.location) {
        const prevLocation = {
          lat: locationChange?.lat?.toFixed(5),
          lng: locationChange?.lng?.toFixed(5)
        }
        const newLocation = {
          lat: formState?.changes?.location?.lat?.toFixed(5),
          lng: formState?.changes?.location?.lng?.toFixed(5)
        }
        // persist the pin move when EITHER coordinate differs. With &&
        // a single-axis change (only lat or only lng) was ignored, so the moved
        // marker never updated locationChange.
        if (
          prevLocation?.lat !== newLocation?.lat ||
          prevLocation?.lng !== newLocation?.lng
        ) {
          setLocationChange(formState?.changes?.location)
        }
      }
    }
  }, [formState])

  useEffect(() => {
    if (isEditing) {
      setIsEdit && setIsEdit(true)
      setAddressValue(addressState.address?.address)
    } else {
      setIsEdit && setIsEdit(false)
    }
  }, [addressState])

  useEffect(() => {
    if (!auth) {
      setLocationChange(formState?.changes?.location ?? orderState?.options?.address?.location ?? '')
    }

    return () => {
      setFirstLocationNoEdit({ value: null })
    }
  }, [])

  /** Form events control */

  useEffect(() => {
    if (Object.keys(formMethods.errors).length > 0) {
      setAlertState({
        open: true,
        content: Object.values(formMethods.errors).map(error => error.message)
      })
    }
  }, [formMethods.errors])

  useEffect(() => {
    inputNames.forEach(field => {
      formMethods.register(field.name, {
        required: isRequiredField(field.name) && showField(field.name)
          ? t(`VALIDATION_ERROR_${field.name}_REQUIRED`, `The field ${field.code} is required`)
          : null
      })
      formMethods.setValue(field.name, formState.changes?.[field.name] ?? addressState.address?.[field.name] ?? '')
    })
  }, [formMethods])

  const handleClickOutside = (e) => {
    const outsideContainer = !mapBoxContainerRef.current?.contains(e.target)
    if (outsideContainer) {
      setInputFocused(false)
    }
  }

  useEffect(() => {
    if (!useAlternativeMap) return
    window.addEventListener('mouseup', handleClickOutside)
    return () => window.removeEventListener('mouseup', handleClickOutside)
  }, [useAlternativeMap])

  const isSaving = formState.loading
  const isSubmitting = isSaving || isGeocoding
  const isLoadingExistingAddress = isEditing && addressState.loading
  const showBootstrapSkeleton = configState.loading || isLoadingExistingAddress
  const isFormLocked = isSubmitting || showBootstrapSkeleton
  const mapControls = {
    ...googleMapsControls,
    isMarkerDraggable: !isFormLocked
  }

  return (
    <AddressFormContainer className='address-form'>
      {showBootstrapSkeleton && (
        <WrapperSkeleton>
          <Skeleton height={50} count={5} style={{ marginBottom: '10px' }} />
        </WrapperSkeleton>
      )}

      {!showBootstrapSkeleton && (
        <FormControl
          onSubmit={formMethods.handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
          autoComplete='off'
          aria-busy={isSaving}
        >
          <FormFields disabled={isFormLocked}>
          {inputNames.map(field => showField && showField(field.name) && (
            field.name === 'address'
              ? (
                <React.Fragment key={field.name}>
                  <AddressWrap className='google-control'>
                    {!useAlternativeMap && (
                      <>
                        <WrapAddressInput>
                          <GoogleAutocompleteInput
                            className='input-autocomplete'
                            apiKey={googleMapsApiKey}
                            placeholder={t('ADDRESS', 'Address')}
                            onChangeAddress={(e) => {
                              formMethods.setValue('address', e.address)
                              handleChangeAddress(e)
                            }}
                            onChange={(e) => {
                              handleChangeInput({ target: { name: 'address', value: e.target.value } })
                              setAddressValue(e.target.value)
                            }}
                            childRef={(ref) => {
                              googleInputRef.current = ref
                            }}
                            defaultValue={
                              formState?.result?.result
                                ? formState?.result?.result?.address
                                : formState?.changes?.address ?? addressValue
                            }
                            autoComplete='new-password'
                            countryCode={configState?.configs?.country_autocomplete?.value || '*'}
                            disabled={isFormLocked}
                          />
                        </WrapAddressInput>
                        <GoogleGpsButton
                          className='gps-button'
                          apiKey={googleMapsApiKey}
                          onAddress={(e) => {
                            formMethods.setValue('address', e.address)
                            handleChangeAddress(e, true)
                          }}
                          onError={setMapErrors}
                          IconButton={() => <Icon name="mapMarker" />}
                          IconLoadingButton={() => <Icon name="searchLoading" />}
                          disabled={isFormLocked}
                        />
                      </>
                    )}
                    {useAlternativeMap && (
                      <WrapAddressInput ref={mapBoxContainerRef}>
                        <input
                          className='input-autocomplete'
                          placeholder={t('ADDRESS', 'Address')}
                          onChange={(e) => {
                            handleChangeInput({ target: { name: 'address', value: e.target.value } })
                            setAddressValue(e.target.value)
                            getSuggestedResult(e.target.value)
                          }}
                          onFocus={() => setInputFocused(true)}
                          defaultValue={
                            formState?.result?.result
                              ? formState?.result?.result?.address
                              : formState?.changes?.address ?? addressValue
                          }
                          autoComplete='new-field'
                          disabled={isFormLocked}
                          ref={googleInputRef}
                        />
                        {inputFocused && googleInputRef?.current?.value?.length > 0 && (
                          <AddressMapBoxList
                            mapBoxSuggests={mapBoxSuggests}
                            retrieveSuggestResult={retrieveSuggestResult}
                            handleChangeAddress={handleChangeAddress}
                            onBlurInput={() => setInputFocused(false)}
                            setAddressValue={setAddressValue}
                            handleChangeInput={handleChangeInput}
                            forwardRef={googleInputRef}
                          />
                        )}
                      </WrapAddressInput>
                    )}
                  </AddressWrap>

                  {!useAlternativeMap && !isHideMap && locationChange && (addressState?.address?.location || formState?.changes?.location) && (
                    <WrapperMap>
                      <GoogleMapsMap
                        apiKey={googleMapsApiKey}
                        location={locationChange}
                        fixedLocation={!isEditing ? firstLocationNoEdit.value : null}
                        mapControls={mapControls}
                        handleChangeAddressMap={handleChangeAddress}
                        setErrors={setMapErrors}
                        maxLimitLocation={parseInt(maxLimitLocation, 10)}
                      />
                    </WrapperMap>
                  )}
                </React.Fragment>
                )
              : (
                <React.Fragment key={field.name}>
                  {(isRequiredField(field.name) || showFieldWithTheme(field.name)) && (
                    <>
                      {field.name !== 'address_notes'
                        ? (
                          <Input
                            className={field.name}
                            placeholder={t(field.name.toUpperCase(), field.code)}
                            value={formState.changes?.[field.name] ?? addressState.address?.[field.name] ?? ''}
                            onChange={(e) => {
                              formMethods.setValue(field.name, e.target.value)
                              handleChangeInput({ target: { name: field.name, value: e.target.value } })
                            }}
                            autoComplete='new-field'
                            maxLength={30}
                            disabled={isFormLocked}
                          />
                          )
                        : (
                          <TextArea
                            rows={3}
                            placeholder={t('ADDRESS_NOTES', 'Address Notes')}
                            value={formState.changes?.address_notes ?? addressState.address.address_notes ?? ''}
                            onChange={(e) => {
                              formMethods.setValue('address_notes', e.target.value)
                              handleChangeInput({ target: { name: 'address_notes', value: e.target.value } })
                            }}
                            autoComplete='new-field'
                            maxLength={250}
                            disabled={isFormLocked}
                          />
                          )}
                    </>
                  )}
                </React.Fragment>
                )
          ))}

          {formState.error && <p style={{ color: '#c10000' }}>{formState.error}</p>}
          {!isHideIcons && (
            <>
              <AddressTagsDivider>
                <p>{t('ADDRESS_LABELS', 'Address labels')}</p>
              </AddressTagsDivider>
              <AddressTagSection>
                <Button className={addressTag === 'home' ? 'active' : ''} type='button' onClick={() => handleAddressTag('home')}>
                  <Icon name="home" />
                  <span>{t('ADDRESS_HOME', 'Home')}</span>
                </Button>
                <Button className={addressTag === 'office' ? 'active' : ''} type='button' onClick={() => handleAddressTag('office')}>
                  <Icon name="briefcase" />
                  <span>{t('OFFICE', 'Office')}</span>
                </Button>
                <Button className={addressTag === 'favorite' ? 'active' : ''} type='button' onClick={() => handleAddressTag('favorite')}>
                  <Icon name="heartOutline" />
                  <span>{t('FAVORITE', 'Favorite')}</span>
                </Button>
                <Button className={addressTag === 'other' ? 'active' : ''} type='button' onClick={() => handleAddressTag('other')}>
                  <Icon name="tag" />
                  <span>{t('OTHER', 'Other')}</span>
                </Button>
              </AddressTagSection>
            </>
          )}
          <FormActions>
            {
              Object.keys(formState?.changes).length === 0 && (
                <Button
                  outline
                  type='button'
                  disabled={isFormLocked}
                  onClick={() => onCancel()}
                >
                  {t('CANCEL', 'Cancel')}
                </Button>
              )
            }

            {Object.keys(formState?.changes).length > 0 && (
              <Button
                id='submit-btn'
                type='submit'
                disabled={isFormLocked}
                color='primary'
              >
                {!isSubmitting
                  ? (
                    <>
                      {
                        isEditing || (!auth && orderState.options?.address?.address)
                          ? t('UPDATE', 'Update')
                          : t('ADD_ADDRESS', 'Add address')
                      }
                    </>
                    )
                  : (
                      t('LOADING', 'Loading')
                    )}
              </Button>
            )}
          </FormActions>
          </FormFields>
        </FormControl>
      )}

      <Alert
        title={t('ADDRESS', 'Address')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
    </AddressFormContainer>
  )
}

export const AddressForm = (props) => {
  const googleMapsControls = {
    defaultZoom: 17,
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: 'roadmap', // 'roadmap', 'satellite', 'hybrid', 'terrain'
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite']
    },
    isMarkerDraggable: true
  }
  const addressFormProps = {
    ...props,
    UIComponent: AddressFormUI,
    googleMapsControls,
    isSelectedAfterAdd: true
  }

  return <AddressFormController {...addressFormProps} />
}
