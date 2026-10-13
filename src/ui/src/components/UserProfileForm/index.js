import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { StudentsList } from '../StudentsList'

import {
  Container,
  UserProfileContainer,
  UserImage,
  Image,
  SideForm,
  IconContainer,
  SavedPlaces,
  UploadImageIcon,
  SkeletonWrapper,
  WrapperForm
} from './styles'

import { UserFormDetails as UserProfileController } from '~components/components/UserFormDetails'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useSession } from '~components/contexts/SessionContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { DragAndDrop } from '~components/components/DragAndDrop'
import { ExamineClick } from '~components/components/ExamineClick'

import { bytesConverter } from '~ui/utils'
import { Alert } from '~ui/src/components/Confirm'
import { useCountdownTimer } from '~ui/hooks/useCountdownTimer'
import { Modal } from '~ui/src/components/Modal'
import { AddressList } from '~ui/src/components/AddressList'
import { VerifyCodeForm } from '~ui/src/components/VerifyCodeForm'
import { UserFormDetailsUI } from '~ui/src/components/UserFormDetails'

import { Icon } from '~ui-icon'

const UserProfileFormUI = (props) => {
  const {
    userData,
    handleButtonUpdateClick,
    handlechangeImage,
    formState,
    cleanFormState,
    toggleIsEdit,
    isHiddenAddress,
    handleSendVerifyCode,
    verifyPhoneState,
    setFormState,
    view
  } = props

  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ user }] = useSession()
  const theme = useTheme()
  const [willVerifyOtpState, setWillVerifyOtpState] = useState(false)
  const [otpLeftTime, , resetOtpLeftTime] = useCountdownTimer(
    600, willVerifyOtpState)
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const inputRef = useRef(null)

  const showCustomerPicture = view === 'account'
  const showAddressList = !theme?.profile?.components?.address_list?.hidden || view === 'savedPlaces'

  const handleFiles = (files) => {
    if (files.length === 1) {
      const type = files[0].type.split('/')[0]
      if (type !== 'image') {
        setAlertState({
          open: true,
          content: [t('ERROR_ONLY_IMAGES', 'Only images can be accepted')]
        })
        return
      }

      if (bytesConverter(files[0]?.size) > 2048) {
        setAlertState({
          open: true,
          content: [t('IMAGE_MAXIMUM_SIZE', 'The maximum image size is 2 megabytes')]
        })
        return
      }
      handlechangeImage(files[0])
    }
  }

  const toggleEditState = (val) => {
    toggleIsEdit()
    if (!val) {
      cleanFormState({ changes: {} })
    }
  }

  const handleClickImage = () => {
    inputRef.current.click()
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
  }

  const handleSendOtp = () => {
    if (willVerifyOtpState && formState?.changes?.cellphone && formState?.changes?.country_phone_code) {
      const { cellphone, country_phone_code: countryPhoneCode } = formState?.changes

      resetOtpLeftTime()

      handleSendVerifyCode({
        cellphone,
        country_phone_code: countryPhoneCode
      })
    }
  }

  useEffect(() => {
    if (formState.changes?.photo) {
      const isImage = true
      handleButtonUpdateClick(null, isImage)
    }
  }, [formState.changes?.photo])

  useEffect(() => {
    if (verifyPhoneState?.result?.error) {
      setAlertState({
        open: true,
        content: verifyPhoneState?.result?.result || [t('ERROR', 'Error')]
      })
    } else { resetOtpLeftTime() }
  }, [verifyPhoneState?.result?.result])

  useEffect(() => {
    toggleIsEdit()
  }, [])

  useEffect(() => {
    handleSendOtp()
  }, [willVerifyOtpState])

  useEffect(() => {
    if (otpLeftTime === 0) {
      setAlertState({
        open: true,
        content: t('TIME_IS_UP_PLEASE_RESEND_CODE', 'Time is up. Please resend code again')
      })
    }
  }, [otpLeftTime])

  const handleSendPhoneCode = (values) => {
    setWillVerifyOtpState(false)
    setFormState({
      ...formState,
      changes: {
        ...formState?.changes,
        verification_code: values?.code
      }
    })
  }

  return (
    <>
      <Container>
        {view !== 'savedPlaces' && view !== 'students' && (
          <>
            <h1>{view === 'account'
              ? t('MY_ACCOUNT', 'My Account')
              : view === 'notifications'
                ? t('NOTIFICATIONS', 'Notifications')
                : view === 'language'
                  ? t('LANGUAGES', 'Languages')
                  : ''}
            </h1>
            <p>
              {view === 'notifications' && (
                <>
                  {t('NOTIFICATIONS_DESCRIPTION_PART1', 'Set up')} <span className='bold'>{t('PROMOTIONAL', 'promotional')}</span> {t('NOTIFICATIONS_DESCRIPTION_PART2', 'notifications you would like to receive from Ordering')}
                </>
              )}
            </p>
            <UserProfileContainer mbottom={(isHiddenAddress || view !== 'savedPlaces') && 25}>
              {showCustomerPicture && (
                <UserImage className='user-image'>
                  <p>{t('UPDATE_INFORMATION', 'Update Information')}</p>
                  <Image onClick={() => handleClickImage()} isImage={user?.photo || (formState?.changes?.photo && !formState.result.error)}>
                    <ExamineClick onFiles={handleFiles} childRef={(e) => { inputRef.current = e }} accept='image/png, image/jpeg, image/jpg' disabled={formState.loading}>
                      <DragAndDrop onDrop={dataTransfer => handleFiles(dataTransfer.files)} accept='image/png, image/jpeg, image/jpg' disabled={formState.loading}>
                        {formState.changes?.photo && formState.loading
                          ? (<SkeletonWrapper><Skeleton /></SkeletonWrapper>)
                          : ((!formState.changes?.photo || formState.result?.result === 'Network Error' || formState.result.error)
                              ? user?.photo
                                ? (<img src={user?.photo} alt='user image' width='200px' height='200px' loading='lazy' />)
                                : (
                                <UploadImageIcon>
                                  <Icon name="image" />
                                  <span>{t('DRAG_DROP_IMAGE_HERE', 'Put your image here')}</span>
                                </UploadImageIcon>
                                  )
                              : formState?.changes?.photo && formState.result.error &&
                            (
                              <img
                                src={formState?.changes?.photo}
                                alt='user image'
                                loading='lazy'
                              />
                            )
                            )}
                      </DragAndDrop>
                    </ExamineClick>
                  </Image>
                  <IconContainer><Icon name="pencil" /></IconContainer>
                </UserImage>
              )}
              <SideForm className='user-form'>
                <WrapperForm>
                  <UserFormDetailsUI
                    {...props}
                    onCancel={toggleEditState}
                    isHiddenAddress={isHiddenAddress}
                    setWillVerifyOtpState={setWillVerifyOtpState}
                  />
                </WrapperForm>
              </SideForm>
            </UserProfileContainer>
          </>
        )}
        {(userData?.addresses || user?.addresses) && !isHiddenAddress && showAddressList && view === 'savedPlaces' && (
          <SavedPlaces>
            <AddressList isModal addressList={user?.addresses} isProfile title={t('PROFILE_ADDRESSES', 'Addresses')} />
          </SavedPlaces>
        )}
        {view === 'students' && configs?.school_module_enabled?.value === '1' && (
          <StudentsList />
        )}
      </Container>
      <Alert
        title={t('PROFILE', 'Profile')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
      {willVerifyOtpState && (
        <Modal
          title={t('ENTER_VERIFICATION_CODE', 'Enter verification code')}
          open={willVerifyOtpState}
          width='700px'
          height='420px'
          onClose={() => setWillVerifyOtpState(false)}
        >
          <VerifyCodeForm
            otpLeftTime={otpLeftTime}
            credentials={formState?.changes}
            handleSendOtp={handleSendOtp}
            handleCheckPhoneCode={handleSendPhoneCode}
            email={(userData?.email || user?.email)}
            isPhone
          />
        </Modal>
      )}
    </>
  )
}

export const UserProfileForm = (props) => {
  const UserProfileProps = {
    ...props,
    UIComponent: UserProfileFormUI
  }

  return (
    <UserProfileController {...UserProfileProps} />
  )
}
