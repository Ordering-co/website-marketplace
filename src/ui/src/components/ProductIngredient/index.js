import React from 'react'
import { Container } from './styles'
import { ProductIngredient as ProductIngredientController } from '~components/components/ProductIngredient'

import { Icon } from '~ui-icon'

const ProductIngredientUI = (props) => {
  const {
    state,
    ingredient,
    toggleSelect,
    isSoldOut
  } = props

  return (
    <Container isSoldOut={isSoldOut} onClick={() => toggleSelect()}>
      <span>
        {state?.selected && !isSoldOut
          ? (
          <Icon name="checkSquare" className='green-icon' />
            )
          : (
          <Icon name="checkboxBlank" disabled />
            )}
      </span>
      <span>
        {ingredient.name}
      </span>
    </Container>
  )
}

export const ProductIngredient = (props) => {
  const productIngredientProps = {
    ...props,
    UIComponent: ProductIngredientUI
  }

  return (
    <ProductIngredientController {...productIngredientProps} />
  )
}
