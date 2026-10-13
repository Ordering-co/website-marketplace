import React, { useState } from 'react'
import {
  HelpContainer,
  BreadCrumbContainer,
  Title,
  HelpContentWrapper,
  SubPageList,
  SubPage,
  SubTitle,
  LastOrdersListWrapper
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { LastOrders } from '~ui/src/components/LastOrders'
import { HelpStaticPage } from '~ui/src/components/HelpStaticPage'

import { Icon } from '~ui-icon'

export const Help = (props) => {
  const [, t] = useLanguage()
  const [selectedPage, setSelectedPage] = useState(null)

  const menuList = [
    { id: 1, title: t('HELP_WITH_AN_ORDER', 'Help with an order') },
    { id: 2, title: t('ACCOUNT_AND_PAYMENT_OPTIONS', 'Account and Payment Options') },
    { id: 3, title: t('GUIDE_TO_ORDERING', 'Guide to Ordering') }
  ]

  return (
    <HelpContainer>
      {selectedPage && (
        <>
          <BreadCrumbContainer>
            <span
              className='deactive'
              onClick={() => setSelectedPage(null)}
            >
              {t('HELP', 'Help')}
            </span>
            <Icon name="chevronRight" />
            <span>{selectedPage?.title}</span>
          </BreadCrumbContainer>
          <SubTitle>{selectedPage?.title}</SubTitle>
        </>
      )}
      {
        !selectedPage && (
          <>
            <Title>{t('HELP', 'Help')}</Title>
            <HelpContentWrapper>
              <SubPageList>
                {
                  menuList && menuList.map((page, i) => (
                    <SubPage key={i} onClick={() => setSelectedPage(page)}>
                      <span>{page?.title}</span>
                      <div className='icon'>
                        <Icon name="chevronRight" />
                      </div>
                    </SubPage>
                  ))
                }
              </SubPageList>
              <LastOrdersListWrapper>
                <LastOrders {...props} />
              </LastOrdersListWrapper>
            </HelpContentWrapper>
          </>
        )
      }
      {selectedPage?.id === 1 && <HelpStaticPage slug='helpOrder' />}
      {selectedPage?.id === 2 && <HelpStaticPage slug='helpAccountAndPayment' />}
      {selectedPage?.id === 3 && <HelpStaticPage slug='helpOrderingGuide' />}
    </HelpContainer>
  )
}
