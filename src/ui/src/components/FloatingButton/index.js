import React from 'react'

import {
  Container,
  BtnValue
} from './styles'

import { FloatingButton as FloatingButtonController } from '~components/components/FloatingButton'
import { Button } from '~ui/src/styles/Buttons'

const FloatingButtonUI = (props) => {
  const {
    btnText,
    btnValue,
    handleButtonClick,
    disabled,
    isSecondaryBtn
  } = props

  return (
    <Container>
      <Button
        color={isSecondaryBtn ? 'secundary' : 'primary'}
        onClick={handleButtonClick}
        disabled={disabled}
      >
        {btnText}
        <BtnValue>
          {btnValue}
        </BtnValue>
      </Button>
    </Container>
  )
}

export const FloatingButton = (props) => {
  const floatingButtonProps = {
    ...props,
    UIComponent: FloatingButtonUI
  }

  return (
    <FloatingButtonController {...floatingButtonProps} />
  )
}
