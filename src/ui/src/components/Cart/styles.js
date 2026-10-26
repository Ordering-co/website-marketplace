import styled, { css } from 'styled-components'
import { lighten } from 'polished'

export const CartContainer = styled.div`
  width: 100%;
`

export const CartSticky = styled.div`
  /*
   * the scroll is now owned by the MIDDLE product zone inside the
   * BusinessItemAccordion (AccordionContent) so the store-name header and the
   * Total + Checkout + Add more footer stay pinned. CartSticky is therefore a
   * passthrough flex column that lets AccordionSection bound its own height,
   * instead of being a single scroll container that pushed the actions off-screen.
   */
  ${({ isCartOnProductsList }) => isCartOnProductsList && css`
    display: flex;
    flex-direction: column;
    min-height: 0;
    position: sticky;
    top: 20px;
  `}
  width: 100%;

  span.clear-cart {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  div.clear-cart {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 10px;

    button {
      height: 35px;
      border-radius: 15px;
      font-weight: 500;
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.10);
      }
    }
  }
`

export const TaxesFeesChevron = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  color: ${props => props.theme.colors.primary};
  transition: transform 0.2s ease;
  transform: rotate(${props => props.open ? '180deg' : '0deg'});
`

export const OrderBill = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px 0px;
  background-color: ${isCheckout => isCheckout ? 'transparent' : '#FFF'};
  table {
    font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
    width: 100%;
    font-size: 15px;

    td {
      padding-bottom: 10px;
    }

    td span {
      unicode-bidi: bidi-override;
    }

    tr td:nth-child(2) {
      text-align: right;
      ${props => props.theme?.rtl && css`
        text-align: left;
      `}
    }
    .subtotal {
      td {
        font-weight: 600;
      }
    }
    .icon {
      display: flex;
      align-items: center;
      max-height: 25px;
      overflow: visible;
    }
    .taxes-fees-summary {
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover td:first-child {
        color: ${props => props.theme.colors.primary};
      }
      &:focus-visible {
        outline: 2px solid ${props => props.theme.colors.primary};
        outline-offset: 2px;
      }
    }
    .taxes-fees-detail {
      td {
        color: #909090;
        font-size: 13px;
      }
      td.icon {
        padding-left: 16px;
      }
    }
  }
  table.total {
    border-top: 1px solid #EAEAEA;
    padding-top: 10px;
    tr {
      td {
        font-weight: bold;
        color: ${props => props.theme.colors.darkTextColor};
        font-size: 16px;

        &#loyalty {
          font-weight: normal;
          font-size: 14px;
        }
      }
    }
  }
  table.comments {
    margin-top: 20px;
    tr {
      td:nth-child(1) {
        font-weight: bold;
      }
    }
    textarea {
      width: 100%;
      box-sizing: border-box;
      border-radius: 7.6px;
      height: 80px;
      padding-right: 20px;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.01);
      }
    }
  }
  table.spot {
    tr {
      td:nth-child(1) {
        font-weight: bold;
      }
      td:nth-child(2) {
        font-weight: bold;
        color: ${({ theme }) => theme.colors.primary};
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          text-decoration: underline;
          transform: translateY(-1px);
        }
      }
    }
  }
`

export const CouponContainer = styled.div`
  width: 100%;
  margin: 10px 0;
`

export const CheckoutAction = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  p {
    margin: 0;
    font-weight: 600;
    font-size: 18px;
    color: ${props => props.theme.colors.darkTextColor};
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }

  button {
    padding: 10px 30px;
    /* no fixed floor — a 150px min-width forced horizontal overflow
       inside the cart modal on narrow (<=320px) screens */
    min-width: 0;
    width: 50%;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    &:disabled{
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`

export const Divider = styled.div`
  background: #F8F9FA;
  height: 8px;
  width: 100%;
  margin-left: 0;

  @media (min-width: 768px) {
    width: calc(100% + 60px);
    margin-left: -30px;
  }
`

export const Exclamation = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
  margin-left: 5px;
  top: 3px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`

export const Spinner = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-20%, 15%);
`

export const CommentContainer = styled.td`
  position: relative;
  .spinner-content > div{
    width: 50px;
    height: 50px;
  }
`

export const IconContainer = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
  margin-left: 5px;
  height: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg:nth-child(1){
    position: relative;
    top: -1px;
  }
  svg:nth-child(2){
    position: relative;
    top: -3px;
  }
`

/** Hover/focus tooltip for delivery fee (native title is unreliable inside nested layouts). */
export const DeliveryTooltipAnchor = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  outline: none;
  vertical-align: middle;
  flex-shrink: 0;

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  &:hover svg {
    transform: scale(1.08);
  }

  .delivery-tooltip-bubble {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    left: 0;
    bottom: calc(100% + 10px);
    padding: 8px 10px;
    background-color: ${props => props.theme.colors.darkTextColor || '#1a1a1a'};
    color: ${props => props.theme.colors.primaryContrast || '#ffffff'};
    font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'}, sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    text-align: left;
    white-space: normal;
    width: max-content;
    max-width: min(280px, 85vw);
    border-radius: 8px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
    z-index: 10050;
    pointer-events: none;
    transition: opacity 0.15s ease, visibility 0.15s ease;
    unicode-bidi: plaintext;

    ${props => props.theme?.rtl && css`
      left: auto;
      right: 0;
      text-align: right;
    `}
  }

  &:hover .delivery-tooltip-bubble,
  &:focus-visible .delivery-tooltip-bubble {
    visibility: visible;
    opacity: 1;
  }
`

export const DeliveryFeeStrikethrough = styled.span`
  text-decoration: line-through;
  color: ${props => props.theme?.colors?.disabled || '#9E9E9E'};
  margin-right: 6px;
  font-weight: 400;
`

export const DeliveryFeeFreeLabel = styled.span`
  color: ${props => props.theme?.colors?.primary};
  font-weight: 600;
`

export const SavedContainer = styled.span`
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme?.colors?.primaryContrast};
  background: ${props => lighten('0.2', props.theme?.colors?.primary)};
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`

export const SpotSelect = styled.select`
  ${({ isCheckout }) => isCheckout
    ? css`
    background: ${props => props.theme?.colors.backgroundPage};
  `
    : css`
    background: ${props => props.theme?.colors.grayDividerColor};
  `}
  border-radius: 7.6px;
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

export const NoValidProductMessage = styled.p`
  font-size: 14px;
`

export const InvalidCartMessage = styled.p`
  font-size: 14px;
  color: ${props => props.theme?.colors?.danger500};
`

export const DriverTipContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px 0px 0px;
  h1 {
    margin: 0px;
    font-weight: 500;
    font-size: 20px;
    color: ${props => props.theme.colors.darkTextColor};
  }
  > p {
    margin: 0;
    font-size: 16px;
    color: ${props => props.theme?.colors.darkGray};
  }
`

export const SpinnerCart = styled.div`
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ emptyCart }) => emptyCart && css`
    top: 0;
  `}
`

export const WarningText = styled.p`
  margin: 10px auto;
  text-align: center;
  color: ${props => props.theme.colors.primary};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`

export const ReservationAlert = styled.div`
  p{
    color: ${props => props.theme?.colors?.danger500};
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }
`

export const LoyaltyContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme?.colors?.white || '#FFFFFF'};
  margin: 24px 6px;
  padding: 20px;
  align-items: center;
  height: 73px;
  border-radius: ${props => props.theme?.utils?.radius?.m ?? 8}px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);

  .icon {
    color: ${props => props.theme?.colors?.yellow || '#FFC107'};
    font-size: 45px;
    margin-top: 20px;
    padding-right: 30px;
    transform: rotate(15deg);
  }

  span {
    font-size: 15px;
    font-weight: 700;
  }

  .red {
    color: ${props => props.theme?.colors?.primary};
  }
`
