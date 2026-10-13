import React from 'react'

import { useLanguage } from '~components/contexts/LanguageContext'
import { Container, Title, Message } from './styles'

export const TrackingHome = () => {
  const [, t] = useLanguage()

  return (
    <Container data-doc-section='tracking-home'>
      <Title>{t('TRACKING_HOME_TITLE', 'Follow your order')}</Title>
      <Message>{t('TRACKING_HOME_MESSAGE', 'To see the status of your order, open the link we sent you.')}</Message>
    </Container>
  )
}
