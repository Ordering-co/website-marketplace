import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from 'styled-components'
import {
  AccordionSection,
  Accordion,
  AccordionContent,
  WrapperProductImage,
  ProductImage,
  ContentInfo,
  ProductComment,
  ProductInfo,
  ProductError,
  ProductActions,
  ProductActionsEdit,
  ProductActionsDelete,
  ProductPriceSection,
  ProductPrice,
  ProductNotAvailable,
  ProductSelect,
  ProductQuantity,
  ProductSelectWrapper,
  ScheduleInfoWrapper,
  ScheduleInfo,
  ProductActionsIncrement,
  ProductActionsDecrement,
  ProductOptionsListUl,
  ProductOptionsListDiv,
  IconContainer
} from './styles'

import { ProductItemAccordion as ProductItemAccordionController } from '~components/components/ProductItemAccordion'
import { useUtils } from '~components/contexts/UtilsContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'

import { useWindowSize } from '~ui/hooks/useWindowSize'

import { Icon } from '~ui-icon'

const ProductItemAccordionUI = (props) => {
  const {
    isDisabledEdit,
    isCartPending,
    isCartProduct,
    product,
    changeQuantity,
    getProductMax,
    offsetDisabled,
    onDeleteProduct,
    onEditProduct,
    isCheckout,
    isOrderDetails,
    isStore,
    isConfirmationPage,
    toppingsRemoved,
    productInfo,
    hideQuantitySelector = true
  } = props
  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ parsePrice, parseDate, timeFormat }] = useUtils()
  const windowSize = useWindowSize()
  const [setActive, setActiveState] = useState(isCheckout || isOrderDetails ? 'active' : '')
  const [setHeight, setHeightState] = useState(isCheckout || isOrderDetails ? 'auto' : '0px')
  const [setRotate, setRotateState] = useState(isCheckout || isOrderDetails ? 'accordion__icon rotate' : 'accordion__icon')

  const content = useRef(null)
  const productSelect = useRef(null)
  const productActionsEdit = useRef(null)
  const productActionsDelete = useRef(null)
  const productActionsIncrement = useRef(null)
  const productActionsDecrement = useRef(null)

  const viewString = isConfirmationPage ? 'confirmation' : isStore ? 'business_view' : 'header'
  const showProductImage = !theme?.[viewString]?.components?.cart?.components?.products?.components?.image?.hidden
  const fromWorker = typeof window !== 'undefined' && (window.__FIRST_LOAD__ || window.__CONFIG__)
  const hideProductDummyLogo = theme?.business_view?.components?.products?.components?.product?.components?.dummy?.hidden || fromWorker

  const showArrowIcon = props.showArrowIcon && (productInfo?.ingredients?.length > 0 || productInfo?.options?.length > 0 || product?.comment)

  const toggleAccordion = (e) => {
    const isActionsClick = productSelect.current?.contains(e.target) || productActionsEdit.current?.contains(e.target) || productActionsDelete.current?.contains(e.target) || productActionsIncrement.current?.contains(e.target) || productActionsDecrement.current?.contains(e.target)
    if ((!product?.valid_menu && isCartProduct) || isActionsClick) return
    setActiveState(setActive === '' ? 'active' : '')
    setHeightState(
      setActive === 'active' ? '0px' : `${content.current.scrollHeight}px`
    )
    setRotateState(
      setActive === 'active' ? 'accordion__icon' : 'accordion__icon rotate'
    )
  }

  const handleChangeQuantity = (value) => {
    if (parseInt(value) === 0) {
      onDeleteProduct(product)
    } else {
      changeQuantity(product, parseInt(value))
    }
  }

  const otherLinesQuantity = (product?.balance ?? product?.quantity ?? 0) - (product?.quantity ?? 0)
  const exceedsMaximum = (quantity) => !!product?.maximum_per_order && otherLinesQuantity + quantity > product?.maximum_per_order
  const isMaximumReached = exceedsMaximum(product?.quantity + 1)

  const handleIncrement = () => {
    if (isMaximumReached) return
    changeQuantity(product, product?.quantity + 1)
  }

  const handleDecrement = () => {
    changeQuantity(product, product?.quantity - 1)
  }

  const getFormattedSubOptionName = ({ quantity, name, position, price }) => {
    const pos = position ? `(${position})` : ''
    return `${quantity} x ${name} ${pos} +${price}`
  }

  useEffect(() => {
    if (setActive === 'active') {
      setHeightState(
        `${content.current.scrollHeight + 40}px`
      )
    }
  }, [product, setActive])

  useEffect(() => {
    if ((isCheckout || isOrderDetails) && content.current) {
      setHeightState(`${content.current.scrollHeight + 1}px`)
    }
  }, [isCheckout, isOrderDetails])

  const ProductOptionsList = (isCheckout || isOrderDetails) ? ProductOptionsListDiv : ProductOptionsListUl

  return (
    <>
      <AccordionSection
        data-doc-section='cart-product-row'
        data-doc-product-id={product?.id}
        transBackground={isCheckout || isOrderDetails}
        noBorder={isOrderDetails}
      >
        <Accordion
          data-doc-section='cart-product'
          data-doc-product-id={product?.id}
          data-doc-state={product?.valid === false ? 'invalid' : 'valid'}
          hideQuantitySelector={hideQuantitySelector}
          noMargin={isCheckout || isOrderDetails || (!isStore && !isCheckout && !isOrderDetails && !isConfirmationPage)}
          className={`product accordion ${setActive}`}
          onClick={(e) => toggleAccordion(e)}
        >
          <ProductInfo className='info' isValid={product?.valid ?? true} hideQuantitySelector={hideQuantitySelector} midWidth={isCheckout || isOrderDetails} fullWidth={isOrderDetails}>
            {(!isCheckout && !isOrderDetails) && (product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product)) && showProductImage && (
              <WrapperProductImage data-doc-control='cart-product-edit-image' hideQuantitySelector={hideQuantitySelector} onClick={() => onEditProduct && !isDisabledEdit && onEditProduct(product)}>
                <ProductImage hideQuantitySelector={hideQuantitySelector} bgimage={product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product)}>
                {onEditProduct && !isDisabledEdit && <IconContainer><Icon name="pencil" /></IconContainer>}
                </ProductImage>
              </WrapperProductImage>
            )}
            {product?.calendar_event
              ? (
              <ScheduleInfoWrapper>
                <h3>{product.name}</h3>
                <ScheduleInfo>
                  <span>
                    {parseDate(product?.calendar_event?.start, { outputFormat: timeFormat || 'HH:mm' })}
                    {' '}-{' '}
                    {parseDate(product?.calendar_event?.end, { outputFormat: timeFormat || 'HH:mm' })}
                  </span>
                </ScheduleInfo>
              </ScheduleInfoWrapper>
                )
              : (
                <>
                  {!hideQuantitySelector && (
                    <>
                      {(!isCheckout && !isOrderDetails) && !isDisabledEdit && isCartProduct && !isCartPending && getProductMax
                        ? (
                        <ProductSelectWrapper>
                          <Icon name="arrowDownIos" />
                          <ProductSelect
                            ref={productSelect}
                            value={product.quantity}
                            grayBackground={isCheckout || isOrderDetails}
                            onChange={(e) => handleChangeQuantity(Number(e.target.value))}
                          >
                            {[...Array(getProductMax(product) + 1)].map((v, i) => (
                              <option
                                key={i}
                                value={i}
                                disabled={(offsetDisabled(product) < i || exceedsMaximum(i)) && i !== 0}
                              >
                                {i === 0 ? t('REMOVE', 'Remove') : i}
                              </option>
                            ))}
                          </ProductSelect>
                        </ProductSelectWrapper>
                          )
                        : (
                        <ProductQuantity className='quantity-item' marginRight={isCheckout || isOrderDetails} fontSize={isOrderDetails ? '24px' : '16px'}>
                          {product?.quantity}
                        </ProductQuantity>
                          )}
                    </>
                  )}
                  {!hideQuantitySelector && (
                    <ContentInfo fullWidth={isCheckout || isOrderDetails} fontSize={isOrderDetails ? '20px' : '16px'}>
                      <div className='product-name'>
                        <h3>{product.name}</h3>
                      </div>
                      {(!isCheckout && !isOrderDetails) && windowSize.width <= 410 && (
                        <span>
                          <p>{parsePrice(product.total || product.price)}</p>
                          {isCartProduct && !isCartPending && (
                            <div>
                              {onEditProduct && !isDisabledEdit && (
                                <span data-doc-control='cart-product-edit' ref={productActionsEdit}>
                                  <Icon name="pencil" color='#B1BCCC' onClick={() => onEditProduct(product)} />
                                </span>
                              )}
                              {onDeleteProduct && (
                                <span ref={productActionsDelete}>
                                  <Icon name="trashFilled" color='#B1BCCC' onClick={() => onDeleteProduct(product)} />
                                </span>
                              )}
                            </div>
                          )}
                        </span>
                      )}
                    </ContentInfo>
                  )}
                </>
                )}
          </ProductInfo>
          {hideQuantitySelector && (
            <div className='product-info'>
              <h3>
                {!product?.calendar_event && product.name}
              </h3>
              <ProductPrice className='prod-price' hideQuantitySelector={hideQuantitySelector}>
                <span>
                  {parsePrice(product.total || product.price)}
                </span>
              </ProductPrice>
              <ProductActions hideQuantitySelector={hideQuantitySelector}>
                {onDeleteProduct && !isCartPending && product?.valid_quantity && product?.valid_menu && (
                  <>
                  {product?.quantity > 1
                    ? (
                        <ProductActionsDecrement
                          data-doc-control='cart-product-decrement'
                          ref={productActionsDecrement}
                          onClick={handleDecrement}
                          disabled={orderState.loading}
                        >
                          <Icon name="dashSquareFill" />
                        </ProductActionsDecrement>
                      )
                    : (
                        <ProductActionsDelete
                          data-doc-control='cart-product-delete'
                          ref={productActionsDelete}
                          onClick={() => onDeleteProduct(product)}
                          disabled={orderState.loading}
                          hideQuantitySelector
                        >
                          <Icon name="trashFilled" color='#B1BCCC' />
                        </ProductActionsDelete>
                      )}
                  </>
                )}
                {product?.quantity > 0 && (
                  <p className='quantity-item'>{product?.quantity}</p>
                )}
                {!isDisabledEdit && !isCartPending && product?.valid_quantity && product?.valid_menu && (
                  <ProductActionsIncrement
                    data-doc-control='cart-product-increment'
                    ref={productActionsIncrement}
                    onClick={handleIncrement}
                    disabled={orderState.loading || isMaximumReached}
                  >
                    <Icon name="plusSquareFill" />
                  </ProductActionsIncrement>
                )}
              </ProductActions>
            </div>
          )}
          {!hideQuantitySelector && showArrowIcon && <Icon name="arrowDownIos" className={`${setRotate}`} />}

          {!hideQuantitySelector && product.valid && (
            <>
              {(product?.valid || !isCartProduct) && windowSize.width > 410 && (
                <ProductPriceSection>
                  <ProductPrice className='prod-price'>
                    <span>
                      {parsePrice(product.total || product.price)}
                    </span>
                    {(!isCheckout && !isOrderDetails) && (productInfo.ingredients.length > 0 || productInfo.options.length > 0 || product.comment) && (
                      <p>
                        <Icon name="arrowDownIos" className={`${setRotate}`} />
                      </p>
                    )}
                  </ProductPrice>
                  {(!isCheckout && !isOrderDetails) && isCartProduct && !isCartPending && (
                    <ProductActions>
                      {!isDisabledEdit && (
                        <ProductActionsEdit
                          data-doc-control='cart-product-edit'
                          ref={productActionsEdit}
                          onClick={() => onEditProduct(product)}
                          disabled={orderState.loading}
                        >
                          <Icon name="pencil" color='#B1BCCC' />
                        </ProductActionsEdit>
                      )}
                      {onDeleteProduct && (
                        <ProductActionsDelete
                          data-doc-control='cart-product-delete'
                          ref={productActionsDelete}
                          onClick={() => onDeleteProduct(product)}
                          disabled={orderState.loading}
                        >
                          <Icon name="trashFilled" color='#B1BCCC' />
                        </ProductActionsDelete>
                      )}
                    </ProductActions>
                  )}
                </ProductPriceSection>
              )}
            </>
          )}

          {isCartProduct && !isCartPending && product?.valid_menu && !product?.valid_quantity && (
            <ProductError>
                <ProductActions>
                  {!hideQuantitySelector && !isDisabledEdit && (
                    <ProductActionsEdit
                      data-doc-control='cart-product-edit'
                      ref={productActionsEdit}
                      onClick={() => onEditProduct(product)}
                      disabled={orderState.loading}
                    >
                      <Icon name="pencil" color='#B1BCCC' />
                    </ProductActionsEdit>
                  )}
                  {onDeleteProduct && (
                    <ProductActionsDelete
                      data-doc-control='cart-product-delete'
                      ref={productActionsDelete}
                      onClick={() => onDeleteProduct(product)}
                      disabled={orderState.loading}
                    >
                      <Icon name="trashFilled" color='#B1BCCC' />
                    </ProductActionsDelete>
                  )}
                </ProductActions>
              <ProductNotAvailable>
                {t('NOT_AVAILABLE', 'Not available')}
              </ProductNotAvailable>
            </ProductError>
          )}

          {!product?.valid_menu && isCartProduct && !isCartPending && (
            <ProductError>
              <ProductActions>
                {onDeleteProduct && (
                  <ProductActionsDelete
                    data-doc-control='cart-product-delete'
                    ref={productActionsDelete}
                    onClick={() => onDeleteProduct(product)}
                    disabled={orderState.loading}
                  >
                    <Icon name="trashFilled" color='#D81212' />
                  </ProductActionsDelete>
                )}
              </ProductActions>
              <ProductNotAvailable>
                {t('NOT_AVAILABLE', 'Not available')}
              </ProductNotAvailable>
            </ProductError>
          )}
        </Accordion>

        <AccordionContent
          className='accordion-product-options'
          ref={content}
          style={{ maxHeight: `${setHeight}` }}
          fullWidth={isCheckout || isOrderDetails}
        >
          {productInfo.ingredients.length > 0 && productInfo.ingredients.some(ingredient => !ingredient.selected) && (
            <ProductOptionsList>
              <p>{t('INGREDIENTS', 'Ingredients')}</p>
              {productInfo.ingredients.map(ingredient => !ingredient.selected && (
                <li className='ingredient' key={ingredient.id}>
                  <span>{t('NO', 'No')} {ingredient.name}</span>
                </li>
              ))}
            </ProductOptionsList>
          )}
          {productInfo.options.length > 0 && (
            <ProductOptionsList fontSize={isOrderDetails ? '16px' : '14px'}>
              {(isCheckout || isOrderDetails)
                ? (
                  <p>
                    {productInfo.options.map((option, index) => (
                      <>
                        {option?.suboptions?.sort((a, b) => a.rank - b.rank).map((suboption) => (
                            <>
                              {option.name} {suboption.name}
                              {index < productInfo.options.length - 1 && ', '}
                            </>
                        ))}
                      </>
                    ))}
                  </p>
                  )
                : (
                <>
                  {productInfo.options.map(option => (
                    <li key={option.id}>
                      <p>{option.name}</p>
                      <ProductOptionsList className='suboption'>
                        {option?.suboptions?.sort((a, b) => a.rank - b.rank).map(suboption => (
                          <li key={suboption.id}>
                            <span>
                              {getFormattedSubOptionName({
                                quantity: suboption.quantity,
                                name: suboption.name,
                                position: (suboption?.position !== 'whole') ? t(suboption.position.toUpperCase(), suboption.position) : '',
                                price: (['left', 'right'].includes(suboption.position)) ? parsePrice(suboption.half_price ?? suboption.price) : parsePrice(suboption.price)
                              })}
                            </span>
                          </li>
                        ))}
                      </ProductOptionsList>
                    </li>
                  ))}
                </>
                  )}
            </ProductOptionsList>
          )}
          {toppingsRemoved?.removed?.length > 0 && (
            <ProductOptionsList>
              <li>
                <p>{t('TOPPINGS_REMOVED', 'Toppings removed')}</p>
                <ProductOptionsList className='suboption'>
                  {toppingsRemoved?.removed.map(topping => (
                    <li key={topping.code}>
                      <span>{topping.name}</span>
                    </li>
                  ))}
                </ProductOptionsList>
              </li>
            </ProductOptionsList>
          )}
          {product.comment && (
            <ProductComment fontSize={isCheckout ? '14px' : '16px'}>
              <p>{t('SPECIAL_COMMENT', 'Special Comment')}</p>
              <h3>{product.comment}</h3>
            </ProductComment>
          )}
        </AccordionContent>
      </AccordionSection>
    </>
  )
}

export const ProductItemAccordion = (props) => {
  const productItemAccordion = {
    ...props,
    UIComponent: ProductItemAccordionUI
  }
  return (
    <ProductItemAccordionController {...productItemAccordion} />
  )
}
