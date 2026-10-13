import React, { useState, useRef, useEffect } from 'react'
import {
  Container,
  WrapHeader,
  TitleContainer,
  Title,
  Flag,
  OptionThumbnail,
  CollapseButton,
  CollapsibleContent
} from './styles'

import { ProductOption as ProductOptionController } from '~components/components/ProductOption'
import { useLanguage } from '~components/contexts/LanguageContext'
import { Alert } from '~ui/src/components/Confirm'

import { Icon } from '~ui-icon'

const ProductOptionUI = (props) => {
  const { children, option, error } = props
  const containerRef = useRef(null)

  const [, t] = useLanguage()
  const [incrementPriceAlert, setIncrementPriceAlert] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(!(option?.min > 0))

  useEffect(() => {
    if (error && isCollapsed) setIsCollapsed(false)
  }, [error])

  const hideProductOptionImage = true

  const min = option.min ?? 0
  const max = option.max ?? 0
  let maxMin = ''
  if (min === 1 && max === 1) {
    maxMin = t('REQUIRED', 'Required')
  } else if (min > 0 && max > 0 && min === max) {
    maxMin = `${t('CHOOSE', 'Choose')}. ${min}`
  } else if (min === 0 && max > 0) {
    maxMin = `${t('MAX', 'Max')}. ${max}`
  } else if (min > 0 && max === 0) {
    maxMin = `${t('MIN', 'Min')}. ${min}`
  } else if (min > 0 && max > 0) {
    maxMin = `${t('MIN', 'Min')}. ${min} - ${t('MAX', 'Max')}. ${max}`
  }

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)

    if (!newCollapsedState) {
      setTimeout(() => {
        const element = document.getElementById(`id_${option?.id}`)
        const modalContainer = document.querySelector('.popup-dialog, .modal-dialog')
        if (element && modalContainer) {
          const yOffset = -75
          const elementTop = element.getBoundingClientRect().top
          const modalTop = modalContainer.getBoundingClientRect().top
          const scrollTop = elementTop - modalTop + yOffset

          modalContainer.scrollTo({
            top: modalContainer.scrollTop + scrollTop,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }

  return (
    <>
      <Container id={`id_${option?.id}`} ref={containerRef}>
        <WrapHeader onClick={handleToggleCollapse}>
          <TitleContainer>
            {!hideProductOptionImage && option.image && option.image !== '-' && (
              <OptionThumbnail src={option.image} />
            )}
            <div className='title-container'>
              <Title><span>{option.name}</span></Title>
              {maxMin ? <Flag required={option?.min > 0}>{maxMin}</Flag> : null}
            </div>
          </TitleContainer>
          <CollapseButton>
            {isCollapsed ? <Icon name="chevronRightBs" /> : <Icon name="chevronDown" />}
          </CollapseButton>
        </WrapHeader>
        <CollapsibleContent isCollapsed={isCollapsed}>
          {children}
        </CollapsibleContent>
      </Container>
      <Alert
        title={t('PRODUCT_FORM', 'Product form')}
        content={`${t('OPTIONS_PRICE_INCREMENT', 'The price of the product will increase because additional options have been selected')}`}
        open={incrementPriceAlert}
        acceptText={t('ACCEPT', 'Accept')}
        onClose={() => setIncrementPriceAlert(false)}
        onAccept={() => setIncrementPriceAlert(false)}
        closeOnBackdrop={false}
      />
    </>
  )
}

export const ProductOption = (props) => {
  const productOptionProps = {
    ...props,
    UIComponent: ProductOptionUI
  }

  return (
    <ProductOptionController {...productOptionProps} />
  )
}
