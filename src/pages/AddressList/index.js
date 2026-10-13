import React from 'react'
import { useTheme } from 'styled-components'

import { HelmetTags } from '../../components/HelmetTags'
import { SavedPlaces } from './styles'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useSession } from '~components/contexts/SessionContext'
import { AddressList as AddressListController } from '~ui/src/components/AddressList'
import { ProfileOptions } from '~ui/src/components/UserProfileForm/ProfileOptions'

export const AddressList = (props) => {
  const [{ user }] = useSession()
  const [, t] = useLanguage()
  const theme = useTheme()
  const addressListParams = {
    ...props,
    addressList: user?.addresses,
    isProfile: true,
    isModal: true
  }
  const showProfileOptions = theme?.profile?.components?.address_list?.components?.layout?.position === 'new_page'

  return (
    <>
      <HelmetTags page='addresses' />
      {showProfileOptions && (
        <ProfileOptions value='addresses' />
      )}
      <SavedPlaces>
        <h1>
          {t('SAVED_PLACES', 'Saved places')}
        </h1>
        <AddressListController {...addressListParams} />
      </SavedPlaces>
    </>
  )
}

export default AddressList
