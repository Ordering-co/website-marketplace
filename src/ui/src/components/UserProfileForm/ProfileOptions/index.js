import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import { FlexTabs } from './styles'
import { useEvent } from '~components/contexts/EventContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { Tabs, Tab } from '~ui/src/styles/Tabs'

import { Icon } from '~ui-icon'

export const ProfileOptions = ({ value }) => {
  const [tabValue] = useState(value)
  const [, t] = useLanguage()
  const [events] = useEvent()
  const theme = useTheme()

  const showAddressListTab = theme?.profile?.components?.address_list?.components?.layout?.position === 'new_page'

  const handleGoToPage = (data) => {
    events.emit('go_to_page', data)
  }

  return (
    <FlexTabs>
      <Tabs variant='primary'>
        <Tab active={tabValue === 'account'}>
          <a onClick={() => handleGoToPage({ page: 'profile' })}>
            <Icon name="person" /> {t('MY_ACCOUNT', 'My Account')}
          </a>
        </Tab>
        {showAddressListTab && (
          <Tab active={tabValue === 'addresses'}>
            <a onClick={() => handleGoToPage({ page: 'addresses' })}>
              <Icon name="addressBook" /> {t('MY_ADDRESSES', 'My Addresses')}
            </a>
          </Tab>
        )}
        <Tab active={tabValue === 'orders'}>
          <a onClick={() => handleGoToPage({ page: 'orders' })}>
            <Icon name="unorderedList" /> {t('MY_ORDERS', 'My orders')}
          </a>
        </Tab>
      </Tabs>
    </FlexTabs>
  )
}
