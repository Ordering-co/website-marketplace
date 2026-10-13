import React from 'react'
import { useLocation } from 'react-router-dom'
import { HelmetTags } from '../../components/HelmetTags'

import { UserProfileForm as UserProfileFormOriginal } from '~ui/src/components/UserProfileForm'
import { useWindowSize } from '~ui/hooks/useWindowSize'

export const Profile = (props) => {
  const windowSize = useWindowSize()
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const view = searchParams.get('view') || ''

  const profileProps = {
    ...props,
    view,
    refreshSessionUser: true,
    showLogout: true,
    hideOptions: windowSize.width < 576
  }

  return (
    <>
      <HelmetTags page='profile' />
      <UserProfileFormOriginal {...profileProps} />
    </>
  )
}

export default Profile
