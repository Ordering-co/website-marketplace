import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { HelmetTags } from '../../components/HelmetTags'

import { Cms as CmsController } from '~ui/src/components/Cms'

export const Cms = (props) => {
  const { pageSlug } = useParams()
  const history = useHistory()
  const [helmetMetaTags, setHelmetMetaTags] = useState(null)

  const cmsProps = {
    ...props,
    pageSlug,
    onChangeMetaTag: (title, description) => {
      setHelmetMetaTags({ title, description })
    },
    handleCmsRedirect: () => {
      history.push('/pages')
    }
  }

  return (
    <>
      <HelmetTags page='pages' helmetMetaTags={helmetMetaTags} />
      <CmsController {...cmsProps} />
    </>
  )
}

export default Cms
