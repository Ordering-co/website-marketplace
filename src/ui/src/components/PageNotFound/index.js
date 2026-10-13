import React from 'react'

import { PageNotFoundContainer } from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'

export const PageNotFound = (props) => {
  const [, t] = useLanguage()
  const { width } = useWindowSize()
  return (
    <PageNotFoundContainer width={width}>
      <NotFoundSource
        variant='notFound'
        content={t('PAGE_NOT_FOUND', 'PAGE NOT FOUND')}
      />
    </PageNotFoundContainer>
  )
}
