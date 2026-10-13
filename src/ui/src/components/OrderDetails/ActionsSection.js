import React from 'react'
import {
  MessagesIcon,
  ActionsBlock
} from './styles'

import { getUtils } from './utils'

import { Icon } from '~ui-icon'

export const ActionsSection = (props) => {
  const {
    actionType,
    order,
    handleBusinessRedirect,
    businessData,
    unreadAlert,
    setOpenMessages,
    readMessages,
    setUnreadAlert,
    showPhone,
    showMessages
  } = props

  const { phoneIcon, chatIcon } = getUtils()

  const phoneEntity = order?.[actionType] || (actionType === 'driver' ? order?.external_driver : null)
  const phoneNumber = phoneEntity?.phone || phoneEntity?.cellphone
  const showPhoneButton = !!(showPhone && phoneEntity && phoneNumber)

  const handleOpenMessages = (data) => {
    setOpenMessages(data)
    readMessages()
    if (order?.unread_count > 0) {
      data.business
        ? setUnreadAlert({ ...unreadAlert, business: false })
        : setUnreadAlert({ ...unreadAlert, driver: false })
    }
    window.scrollTo(0, 0)
  }

  return (
    <ActionsBlock actionType={actionType}>
      {actionType === 'business' && (
        <span className='business-icon'>
          <Icon name="store" onClick={() => handleBusinessRedirect(businessData?.slug)} />
        </span>
      )}
      {showMessages && (
        <MessagesIcon onClick={() => handleOpenMessages({ driver: actionType === 'driver', business: actionType === 'business' })}>
          {chatIcon()}
        </MessagesIcon>
      )}
      {showPhoneButton && (
        <span onClick={() => window.open(`tel:${phoneNumber}`)}>
          {phoneIcon()}
        </span>
      )}
    </ActionsBlock>
  )
}
