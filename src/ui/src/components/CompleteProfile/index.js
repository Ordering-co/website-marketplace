import React, { useEffect, useRef, useState } from 'react'

import {
  Container,
  HeaderWrapper,
  ActionsWrapper,
  SkipButton
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useSession } from '~components/contexts/SessionContext'

import { UserDetails } from '~ui/src/components/UserDetails'
import { LogoutButton } from '~ui/src/components/LogoutButton'

export const CompleteProfile = (props) => {
  const { missingFields, checkoutFields, canSkip, onSkip } = props
  const [, t] = useLanguage()
  const [{ user }, { refreshUserInfo }] = useSession()

  // The cached session user can be stale (e.g. the field was saved from another session),
  // so pull the server truth once on mount; if it already satisfies the gate, it clears.
  const didRefresh = useRef(false)
  useEffect(() => {
    if (didRefresh.current) return
    didRefresh.current = true
    refreshUserInfo?.()
  }, [refreshUserInfo])

  // UserFormDetails leaves edit mode after any successful save and offers no way back in,
  // so remount it whenever the user changes to keep the form editable until the gate clears.
  const [remountCount, setRemountCount] = useState(0)
  useEffect(() => {
    setRemountCount(count => count + 1)
  }, [user])
  const userDetailsKey = `${remountCount}-${missingFields.join('|')}`

  return (
    <Container>
      <HeaderWrapper>
        <h1>{t('COMPLETE_YOUR_PROFILE', 'Complete your profile')}</h1>
        <p>
          {t(
            'COMPLETE_YOUR_PROFILE_MESSAGE',
            'In order to continue using our platform please complete your profile information'
          )}
        </p>
      </HeaderWrapper>

      <UserDetails
        key={userDetailsKey}
        isUserDetailsEdit
        useDefualtSessionManager
        useSessionUser
        requiredFields={missingFields}
        checkoutFields={checkoutFields}
        isOrderTypeValidationField
        isCheckoutPlace
        isEdit
        onClose={() => {}}
      />

      <ActionsWrapper>
        <LogoutButton />
        {canSkip && (
          <SkipButton onClick={onSkip}>
            {t('SKIP_FOR_NOW', 'Skip for now')}
          </SkipButton>
        )}
      </ActionsWrapper>
    </Container>
  )
}
