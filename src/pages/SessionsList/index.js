import React from 'react'
import { HelmetTags } from '../../components/HelmetTags'
import { SessionsList as SessionsListController } from '~ui/src/components/SessionsList'

export const SessionsList = (props) => {
  return (
    <>
      <HelmetTags page='sessions' />
      <SessionsListController {...props} />
    </>
  )
}

export default SessionsList
