import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { CmsContainer, SkeletonContainer, SkeletonHeader, SkeletonContent, SkeletonInformation, SkeletonSide } from './styles'

import { CmsContent } from '~components/components/CmsContent'
import { useLanguage } from '~components/contexts/LanguageContext'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'

const CmsUI = (props) => {
  const {
    cmsState,
    handleCmsRedirect
  } = props
  const [, t] = useLanguage()

  return (
    <CmsContainer id='cms'>
      {
        cmsState.loading && !cmsState.error && (
          <SkeletonContainer>
            <SkeletonHeader>
              <Skeleton width='100%' height='100%' />
            </SkeletonHeader>
            <SkeletonContent>
              <SkeletonInformation>
                <Skeleton width='100%' height='100px' />
                <Skeleton width='100%' height='100px' />
                <Skeleton width='100%' height='100px' />
                <Skeleton width='100%' height='100px' />
              </SkeletonInformation>
              <SkeletonSide>
                <Skeleton width='100%' height='100%' />
              </SkeletonSide>
            </SkeletonContent>
          </SkeletonContainer>
        )
      }
      {
        cmsState.body && (
          <div dangerouslySetInnerHTML={{
            __html: cmsState.body
          }}
          />
        )
      }
      {
        cmsState.error &&
          <NotFoundSource
            content={t('ERROR_PAGE_SELECTED', 'Sorry, the selected page was not found.')}
            btnTitle={t('PAGE_REDIRECT', 'Go to pages list')}
            onClickButton={() => handleCmsRedirect()}
          />
      }
    </CmsContainer>
  )
}

export const Cms = (props) => {
  const CmsProps = {
    ...props,
    UIComponent: CmsUI
  }
  return <CmsContent {...CmsProps} />
}
