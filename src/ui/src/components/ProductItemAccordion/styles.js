import React from 'react'
import styled, { css } from 'styled-components'

export const AccordionSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 0px;
  background: #FFF;
  border-bottom: 1px solid #D9D9D9;
  background: ${({ transBackground }) => transBackground ? 'transparent' : '#FFF'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }

  ${({ noBorder }) => noBorder && css`
    border-bottom: none;
  `}
`

const AccordionStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: initial;
  transition: background-color 0.6s ease;
  margin: 0px 10px;

  .rotate {
    transform: rotate(180deg);
  }

  .accordion__icon {
    margin-left: auto;
    transition: transform 0.6s ease;
    ${props => props.theme?.rtl && css`
      margin-right: auto;
      margin-left: initial;
    `}
  }

  .product-info {
    font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
    width: 100%;
    h3 {
      font-size: 16px;
      font-weight: 400;
      margin: 0;
      display: -webkit-box;
      align-items: center;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;

      p {
        margin: 0;
      }
    }
  }

  ${({ hideQuantitySelector }) => hideQuantitySelector && css`
    justify-content: flex-start;
    align-items: flex-start;
  `}

  ${({ noMargin }) => noMargin && css`
    margin: 0px;
  `}
`

export const Accordion = (props) => {
  const style = {}
  return (
    <AccordionStyled
      {...props}
      style={style}
    >
      {props.children}
    </AccordionStyled>
  )
}

export const WrapperProductImage = styled.div`
  max-width: 95px;
  max-height: 95px;
  height: 95px;
  width: 95px;
  margin-right: 20px;
  cursor: pointer;

  ${({ hideQuantitySelector }) => !hideQuantitySelector && css`
    margin-right: 0px;
    max-width: 50px;
    max-height: 50px;
    height: 50px;
    width: 50px;

    @media (min-width: 361px) {
      max-width: 55px;
      max-height: 55px;
      height: 55px;
      width: 55px;
    }

    @media (min-width: 411px) {
      max-width: 65px;
      max-height: 65px;
      height: 65px;
      width: 65px;
    }
  `}
`

export const IconContainer = styled.div`
  position: absolute;
  right: 37%;
  bottom: 33%;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    font-size: 22px;
    color: white;
  }
`

const ProductImageStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  border-radius: 7.6px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: inherit;
  }

  ${({ hideQuantitySelector }) => hideQuantitySelector && css`
    border-radius: 20px;
  `}
`

export const ProductImage = (props) => {
  return (
    <ProductImageStyled
      {...props}
      style={{ backgroundImage: `url(${props.bgimage})` }}
    >
      {props.children}
    </ProductImageStyled>
  )
}

export const ContentInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-transform: capitalize;
  width: 55%;

  ${props => props.theme?.rtl && css`
    margin-right: 10px;
    margin-left: 0px;
  `}

  h3 {
    font-size: 14px;
    margin: 0px;
    font-weight: 600;
  }

  > div {
    > p {
      font-size: 10px;
      color: ${props => props.theme?.colors.darkGray};
      overflow-wrap: break-word;
    }
  }

  span {
    display: flex;
    justify-content: space-between;
    margin: 0px;

    p {
      margin: 0px;
      font-size: 14px;
    }

    div {
      display: flex;

      span {
        height: 20px;
        svg {
          font-size: 20px;
          transition: all 0.3s ease;

          &:hover {
            transform: scale(1.1);
          }

          &:nth-child(1) {
            margin-right: 3px;
            ${props => props.theme?.rtl && css`
              margin-left: 3px;
              margin-right: 0px;
            `}
          }
        }
      }
    }
  }
  ${({ fullWidth }) => !fullWidth && css`
    @media (min-width: 411px) {
      width: calc(65% - 60px);
    }
  `}
  ${({ fullWidth }) => fullWidth && css`
    width: calc(100% - 10px);
    h3 {
      font-size: 16px;
    }
  `}
  ${({ fontSize }) => fontSize && css`
    h3 {
      font-size: ${({ fontSize }) => fontSize};
    }
  `}
`

export const AccordionContent = styled.div`
  overflow: hidden;
  transition: max-height 0.6s ease;
  width: 100%;
  margin: auto;

  @media (min-width: 481px) {
    width: 80%;
    ${({ fullWidth }) => fullWidth && css`
      width: 100%;
    `}
  }
`

export const AccordionText = styled.div`
  font-weight: 400;
  font-size: 14px;
  padding: 18px;
`

export const ProductComment = styled.div`
  padding-left: 0px;
  ${props => props.theme?.rtl && css`
    padding-right: 0px;
    padding-left: 0px;
  `}
  p {
    margin: 0px;
    font-weight: 400;
    font-size: ${({ fontSize }) => fontSize};
  }

  h3 {
    font-size: ${({ fontSize }) => fontSize};
    font-weight: 400;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-transform: capitalize;
    margin: 0px;
    text-overflow: ellipsis;
    white-space: break-spaces;
    overflow: hidden;
  }
`

export const ProductInfo = styled.div`
  display: flex;
  align-items: flex-start;

  h1,
  h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  p {
    font-size: 20px;
    margin: 0px 5px;
  }

  ${({ isValid }) => !isValid && css`
    opacity: 0.5;
  `}

  ${({ hideQuantitySelector }) => !hideQuantitySelector && css`
    align-items: center;
    width: 100%;

    ${({ midWidth, fullWidth }) => !midWidth && !fullWidth && css`
      @media (min-width: 411px) {
        width: 80%;
      }

      @media (min-width: 481px) {
        width: 70%;
      }
    `}
    ${({ midWidth, fullWidth }) => midWidth && !fullWidth && css`
      width: 80%;
    `}
  `}
`

export const ProductError = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    font-size: 18px;
    text-align: center;
  }

  @media (min-width: 411px){
    width: 35%;

    span{
      text-align: right;
    }
  }
`

export const ProductActions = styled.div`
  display: flex;
  justify-content: flex-end;

  p.quantity-item {
    margin: 0px 20px 0px 15px;
    font-size: 24px;
  }

  ${({ hideQuantitySelector }) => hideQuantitySelector && css`
    align-items: center;
  `}
`

export const ProductActionsEdit = styled.span`

  ${({ disabled }) => disabled && css`
    opacity: 0.7;
    cursor: not-allowed;
  `}

  svg {
    font-size: 16px;
    margin-right: 5px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }

    ${props => props.theme?.rtl && css`
      margin-left: 5px;
      margin-right: 0px;
    `}
  }
`

export const ProductActionsDelete = styled(ProductActionsEdit)`
  svg {
    font-size: 24px;
    fill: ${props => props.theme?.colors.danger500};
  }
  ${({ hideQuantitySelector }) => !hideQuantitySelector && css`
    display: none;
    svg {
      font-size: 16px;
      margin-right: 0px;
    }

    @media (min-width: 411px){
      display: block;
    }
  `}
`

export const ProductActionsIncrement = styled(ProductActionsEdit)`
  svg {
    font-size: 24px;
  }
`
export const ProductActionsDecrement = styled(ProductActionsEdit)`
  svg {
    font-size: 24px;
  }
`

export const ProductPriceSection = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  span {
    white-space: nowrap;
  }
`

export const ProductPrice = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  p,
  span {
    font-size: 14px;
  }

  span {
    font-weight: 500;
  }

  p {
    margin: 0px 5px;
  }

  svg {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  ${({ hideQuantitySelector }) => hideQuantitySelector && css`
    justify-content: flex-start;

    p, span {
      font-size: 16px;
      font-weight: 600;
    }
  `}
`

export const ProductSelectWrapper = styled.div`
  position: relative;

  > svg {
    font-size: 10px;
    position: absolute;
    top: 9px;
    right: 10px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }

    ${props => props.theme?.rtl && css`
      left: 10px;
      right: initial;
    `}
  }
`

export const ProductSelect = styled.select`
  ${({ grayBackground }) => grayBackground
? css`
    background: ${props => props.theme?.colors.backgroundPage};
  `
: css`
    background: ${props => props.theme?.colors.grayDividerColor};
  `}
  border-radius: 7.6px;
  max-width: 35px;
  height: 25px;
  border: none;
  font-size: 12px;
  outline: none;
  margin: 0 5px 0 15px;
  padding: 0 3px;
  cursor: pointer;
  -moz-appearance: none;
  -webkit-appearance: none;
  -ms-progress-appearance: none;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  ${props => props.theme.rtl && css`
    margin: 0 15px 0 5px;
  `}
`

export const ProductNotAvailable = styled.span`
  color: #D81212;
`

export const ProductOptionsListUl = styled.ul`
  list-style-type: none;

  .suboption {
    margin-left: -25px;
    ${props => props.theme?.rtl && css`
      margin-right: -25px;
      margin-left: 0px;
  `}
  }

  p:nth-child(1) {
    margin-bottom: 0;
  }

  p {
    font-weight: 400;
    margin: 0px;
  }

  li span {
    font-weight: 300;
  }

  li.ingredient {
    padding-left: 15px;
    ${props => props.theme?.rtl && css`
      padding-right: 15px;
      padding-left: 0px;
    `}
  }
`

export const ProductOptionsListDiv = styled.div`
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  padding: 0px;
  margin: 0px;

  p:nth-child(1) {
    margin-bottom: 0;
  }

  p {
    font-size: ${({ fontSize }) => fontSize};
    font-weight: 400;
    margin: 0px;
  }

  li span {
    font-weight: 300;
  }

  li.ingredient {
    padding-left: 0px;
    padding-right: 0px;
  }
`

export const ProductQuantity = styled.span`
  margin: 0 5px;
  font-size: ${({ fontSize }) => fontSize};

  ${({ marginRight }) => marginRight && css`
    margin: 0px 8px 0px 0px;
  `}
`

export const ScheduleInfoWrapper = styled.div`
  width: calc(100% - 65px);
  box-sizing: border-box;
  h3 {
    margin: 0px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  padding-left: 10px;
  ${props => props.theme?.rtl && css`
    padding-left: 0px;
    padding-right: 10px;
  `}
`

export const ScheduleInfo = styled.div`
  span {
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    color: ${props => props.theme.colors.darkGray};
  }
`
