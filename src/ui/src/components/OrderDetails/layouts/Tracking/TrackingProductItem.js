import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from 'styled-components'

import { ProductItemAccordion as ProductItemAccordionController } from '~components/components/ProductItemAccordion'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { Icon } from '~ui-icon'
import {
  ProductSection,
  ProductAccordion,
  ProductInfo,
  ProductImageWrapper,
  ProductImage,
  ProductQuantity,
  ProductContentInfo,
  ProductAccordionContent,
  ProductOptionsList
} from './styles'

const TrackingProductItemUI = (props) => {
  const { product, toppingsRemoved, productInfo, hidePrice } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const [isOpen, setIsOpen] = useState(false)
  const [height, setHeight] = useState('0px')
  const content = useRef(null)

  const showProductImage = !theme?.confirmation?.components?.cart?.components?.products?.components?.image?.hidden
  const unselectedIngredients = (productInfo?.ingredients || []).filter(ingredient => !ingredient.selected)
  const options = productInfo?.options || []
  const removedToppings = toppingsRemoved?.removed || []
  const hasAccordionContent = unselectedIngredients.length > 0 || options.length > 0 || removedToppings.length > 0
  const hasDiscount = product?.total != null && product?.price != null && product.total < product.price

  const toggleAccordion = () => {
    if (!hasAccordionContent) return
    setIsOpen(open => !open)
  }

  useEffect(() => {
    setHeight(isOpen && content.current ? `${content.current.scrollHeight}px` : '0px')
  }, [isOpen, product])

  const getFormattedSubOptionName = ({ quantity, name, position, price }) => {
    const pos = position ? `(${position})` : ''
    return `${quantity} x ${name} ${pos} +${price}`
  }

  return (
    <ProductSection data-doc-section='order-tracking-product'>
      <ProductAccordion
        className={`product accordion ${isOpen ? 'active' : ''}`}
        clickable={hasAccordionContent}
        onClick={toggleAccordion}
      >
        <ProductInfo className='info'>
          <ProductQuantity>{product?.quantity}</ProductQuantity>
          {product?.images && showProductImage && (
            <ProductImageWrapper>
              <ProductImage style={{ backgroundImage: `url(${product.images})` }} />
            </ProductImageWrapper>
          )}
          <ProductContentInfo>
            <div>
              <h3>{product?.name}</h3>
              {product?.comment && <p>{product.comment}</p>}
              {!hidePrice && (
                <span className='price-inline'>
                  {hasDiscount && <s>{parsePrice(product.price)}</s>}
                  {parsePrice(product?.total ?? product?.price)}
                </span>
              )}
            </div>
          </ProductContentInfo>
        </ProductInfo>
        {hasAccordionContent && (
          <Icon name='arrowDownIos' className={isOpen ? 'accordion__icon rotate' : 'accordion__icon'} />
        )}
      </ProductAccordion>

      <ProductAccordionContent ref={content} style={{ maxHeight: height }}>
        {unselectedIngredients.length > 0 && (
          <ProductOptionsList>
            <p>{t('INGREDIENTS', 'Ingredients')}</p>
            {unselectedIngredients.map(ingredient => (
              <li className='ingredient' key={ingredient.id}>
                <span>{t('NO', 'No')} {ingredient.name}</span>
              </li>
            ))}
          </ProductOptionsList>
        )}
        {options.length > 0 && (
          <ProductOptionsList>
            {options.map(option => (
              <li key={option.id}>
                <p>{option.name}</p>
                <ProductOptionsList className='suboption'>
                  {Object.values(option.suboptions ?? {}).sort((a, b) => a.rank - b.rank).map(suboption => (
                    <li key={suboption.id}>
                      <span>
                        {getFormattedSubOptionName({
                          quantity: suboption.quantity,
                          name: suboption.name,
                          position: (suboption?.position && suboption.position !== 'whole') ? t(suboption.position.toUpperCase(), suboption.position) : '',
                          price: (['left', 'right'].includes(suboption?.position)) ? parsePrice(suboption.half_price ?? suboption.price) : parsePrice(suboption.price)
                        })}
                      </span>
                    </li>
                  ))}
                </ProductOptionsList>
              </li>
            ))}
          </ProductOptionsList>
        )}
        {removedToppings.length > 0 && (
          <ProductOptionsList>
            <li>
              <p>{t('TOPPINGS_REMOVED', 'Toppings removed')}</p>
              <ProductOptionsList className='suboption'>
                {removedToppings.map(topping => (
                  <li key={topping.code}>
                    <span>{topping.name}</span>
                  </li>
                ))}
              </ProductOptionsList>
            </li>
          </ProductOptionsList>
        )}
      </ProductAccordionContent>
    </ProductSection>
  )
}

export const TrackingProductItem = (props) => {
  return <ProductItemAccordionController {...props} UIComponent={TrackingProductItemUI} />
}
