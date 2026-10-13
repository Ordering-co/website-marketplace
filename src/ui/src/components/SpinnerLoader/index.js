import React, { useState, useEffect } from 'react'
import {
  Container,
  Logo,
  Content,
  Spinner
} from './styles'

export const SpinnerLoader = (props) => {
  const {
    logotype,
    content,
    style,
    iconStyle,
    delayMs
  } = props

  // With delayMs the spinner only appears if loading genuinely takes longer
  // than the delay — fast loads render nothing instead of a spinner flash.
  const [visible, setVisible] = useState(!delayMs)

  useEffect(() => {
    if (!delayMs) return
    const timer = setTimeout(() => setVisible(true), delayMs)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <Container style={style}>
      {logotype && (
        <Logo>
          <img src={logotype} alt='logo' width='266px' height='150px' loading='lazy' />
        </Logo>
      )}
      {content && (
        <Content>
          {content}
        </Content>
      )}
      <Spinner className='spinner' style={iconStyle} {...props}>
        <div className='spinner-content'>
          <div />
        </div>
      </Spinner>
    </Container>
  )
}
