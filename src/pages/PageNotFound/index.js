import React from 'react'
import { PageNotFound as PageNotFoundController } from '~ui/src/components/PageNotFound'
import { HelmetTags } from '../../components/HelmetTags'

export const PageNotFound = (props) => {
  return (
    <>
      <HelmetTags page='page_not_found' robots='noindex, nofollow' />
      <PageNotFoundController {...props} />
    </>
  )
}

export default PageNotFound
