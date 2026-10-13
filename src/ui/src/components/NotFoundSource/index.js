import React from 'react'
import {
  NotFound,
  NotFoundImage,
  EmptyIcon,
  EmptySubtitle,
  ButtonWrapper
} from './styles'

import { Button } from '~ui/src/styles/Buttons'

import { Icon } from '~ui-icon'

/**
 * Empty / not-found placeholder.
 * - variant `empty`: valid empty lists (no items yet, no matches) — neutral inbox icon
 * - variant `notFound` (default): errors, missing resources, expired items — search icon
 */
export const NotFoundSource = (props) => {
  const {
    content,
    subtitle,
    variant = 'notFound',
    btnTitle,
    conditioned,
    onClickButton
  } = props

  const isEmpty = variant === 'empty'

  return (
    <NotFound $variant={variant} id='not-found-source'>
      {isEmpty
        ? (
          <EmptyIcon>
            <Icon name="inbox" />
          </EmptyIcon>
          )
        : (
          <NotFoundImage>
            <Icon name="pageSearch" />
          </NotFoundImage>
          )}
      {content && conditioned && <h1>{content}</h1>}
      {content && !conditioned && <h1>{content}</h1>}
      {subtitle && isEmpty && <EmptySubtitle>{subtitle}</EmptySubtitle>}
      {!onClickButton && props.children && (
        <ButtonWrapper>
          {props.children}
        </ButtonWrapper>
      )}
      {onClickButton && (
        <ButtonWrapper>
          <Button
            outline
            color='primary'
            onClick={() => onClickButton()}
          >
            {btnTitle}
          </Button>
        </ButtonWrapper>
      )}
    </NotFound>
  )
}
