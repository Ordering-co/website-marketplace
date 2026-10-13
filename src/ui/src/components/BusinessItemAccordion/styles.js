import React from 'react'
import styled, { css } from 'styled-components'

export const AccordionSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  opacity: 1;

  ${({ isCartOnProductsList }) => isCartOnProductsList && css`
    position: sticky;
    top: 20px;
  `}

  /*
   * 3-zone sticky-footer cart layout.
   * When isStickyFooter is set (cart popover / sidebar drawer / inline cart),
   * the section becomes a bounded flex column so that only the middle product
   * zone (AccordionContent) scrolls, while the header (Accordion) and the
   * footer (PriceContainer with Total + Checkout + Add more) stay pinned.
   */
  ${({ isStickyFooter, isCartOnProductsList }) => isStickyFooter && css`
    max-height: ${isCartOnProductsList ? '70vh' : '80vh'};
    min-height: 0;
  `}

  &:last-child {
    border-bottom: 0;
    margin-bottom: 10px;
  }
`

export const Accordion = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: ${({ isClosed }) => isClosed ? 'not-allowed' : 'pointer'};
  transition: background-color 0.6s ease;
  position: relative;
  padding: 10px 0px;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }

  ${props => props.isClosed && css`
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
    padding: 10px 5px;
  `}

  .rotate {
    transform: rotate(180deg);
  }

  .accordion__icon {
    transition: transform 0.6s ease;
  }

  /* Fixed, non-scrolling HEADER zone (store name) for the sticky-footer layout. */
  ${({ isStickyFooter }) => isStickyFooter && css`
    flex-shrink: 0;
  `}
`

export const ContentInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  ${({ isLogo }) => isLogo && css`
    width: calc(100% - 80px);
  `}

  > div {
    display: flex;
    align-items: center;

    .go-store {
      user-select: none;
      color: ${props => props.theme.colors.primary};
      margin-right: 5px;
      transition: all 0.3s ease;

      &:hover {
        text-decoration: underline;
        transform: translateY(-1px);
      }

      ${props => props.theme?.rtl && css`
        margin-left: 5px;
        margin-right: 0;
      `}
    }
    .clear-cart {
      user-select: none;
      color: #d81212;
      margin-left: 5px;
      transition: all 0.3s ease;

      &:hover {
        text-decoration: underline;
        transform: translateY(-1px);
      }

      ${props => props.theme?.rtl && css`
        margin-right: 5px;
        margin-left: 0;
      `}
      &:first-letter {
        text-transform: uppercase;
      }
    }

    ${({ isStore }) => isStore && css`
      .clear-cart {
        margin: 0px;
      }
    `}
  }
  .change-store {
    cursor: pointer;
    color: ${props => props.theme.colors.primary};
    font-size: 12px;
    transition: all 0.3s ease;

    &:hover {
        text-decoration: underline;
        transform: translateY(-1px);
      }

    &:first-letter {
      text-transform: uppercase;
    }
  }
  ${props => props.theme?.rtl && css`
    margin-right: 10px;
    margin-left: 0;
  `}

  span {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }

  span.danger{
    color: ${({ theme }) => theme?.colors?.danger500};
  }

  h2, span {
    margin: 0px;
  }

  h2 {
    color: ${props => props.theme.colors.darkTextColor};
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }

  @media (min-width: 576px) {
    h2 {
      font-size: 20px;
      font-weight: 600;
    }
    span {
      font-size: 13px;
    }
  }
`

export const AccordionContent = styled.div`
  overflow: hidden;
  transition: min-height 0.6s ease;

  /*
   * Scrollable MIDDLE zone (the product list + bill + tips + comments).
   * Only enable internal scrolling once the accordion is open; while collapsed
   * the inline maxHeight:0 keeps it hidden and we must not show a scrollbar.
   */
  ${({ isStickyFooter, isOpen }) => isStickyFooter && isOpen && css`
    /*
     * Grow to fill the space between header and sticky footer (flex-grow: 1) and
     * allow shrinking (min-height: 0) so a TALL product list scrolls inside this
     * zone only, keeping the footer pinned. A short cart still hugs the footer
     * because the column's height is content-driven below its max-height cap.
     */
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
  `}
`

export const AccordionText = styled.div`
  font-weight: 400;
  font-size: 14px;
  padding: 18px;
`

export const BusinessInfo = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 30px);
  ${({ isOtherInfo }) => isOtherInfo && css`
    width: calc(100% - 100px);
  `}

  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const BusinessTotal = styled.div`
  width: ${({ isCartOnProductsList }) => isCartOnProductsList ? '30%' : '25%'};
  display: none;
  flex-direction: column;
  align-items: center;

  p {
    font-size: 13px;
    margin: 0px 5px;
    font-weight: 300;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
    }

    &:nth-child(1) {
      font-weight: 500;
    }
  }

  &.closed {
    flex: 1;
    p {
      text-align: center;
      margin: 0px 20px;
      font-size: 13px;
    }

    &.has-clear {
      flex: 0 0 auto;
      width: auto;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 6px;

      p {
        margin: 0px;
        white-space: nowrap;
      }

      .clear-cart {
        display: inline-block;
        margin: 0;
        padding: 6px 14px;
        border-radius: 15px;
        user-select: none;
        cursor: pointer;
        background: ${props => props.theme.colors.danger200};
        color: ${props => props.theme.colors.danger500};
        white-space: nowrap;
        font-size: 13px;
        font-weight: 500;
        line-height: 1;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
        }

        &:first-letter {
          text-transform: uppercase;
        }
      }
    }
  }

  @media (min-width: 481px) {
    display: flex;
  }
`

export const BusinessActions = styled.div`
  max-width: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  span {
    height: 22px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }

    svg {
      font-size: 22px;
    }

    &:not(:last-child) {
      margin-right: 5px;
      ${props => props.theme?.rtl && css`
        margin-left: 5px;
        margin-right: 0;
    `}
    }
  }

  @media (min-width: 768px) {
    span {
      height: 27px;
      svg {
        font-size: 27px;
      }
    }
  }
`

export const PriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h4 {
    font-size: 16px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }

  button {
    padding: 10px 15px;
    min-width: 150px;
    max-width: 70%;
    min-height: 50px;
    height: auto;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    text-align: center;
    line-height: 1.3;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      white-space: nowrap;
    }
    &:hover {
      transform: scale(1.05);
    }
  }

  ${({ showUpsellingInBusinessInfo }) => showUpsellingInBusinessInfo && css`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 10px;
    margin-top: 16px;

    button {
      min-width: 0;
      max-width: none;
      width: auto;
      flex: 1 1 0;
      min-height: 54px;
      height: auto;
      border-radius: 20px;
      padding: 10px 12px;
      font-size: 14px;
      font-weight: 600;
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
      overflow: visible;
      text-overflow: clip;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.25;
      text-align: center;
    }

    /* Primary Checkout button (rendered last) is the larger one */
    button:last-child {
      flex: 2 1 0;
    }
  `}

  /*
   * Always-visible sticky FOOTER zone (Total + Checkout + Add more) for the
   * 3-zone cart layout. It never shrinks, sits at the bottom of the
   * bounded flex column, and gets a divider + page background so it visually
   * detaches from the scrolling product list above it.
   */
  ${({ isStickyFooter }) => isStickyFooter && css`
    flex-shrink: 0;
    position: sticky;
    bottom: 0;
    z-index: 2;
    margin-top: 0;
    padding-top: 6px;
    padding-bottom: 4px;
    background: ${props => props.theme?.colors?.backgroundPage || '#FFF'};
  `}
`

const BusinessLogoStyled = styled.div`
  display: flex;
  width: 75px;
  height: 75px;
  min-height: 75px;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: contain;
  object-fit: contain;
  background-position: center;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`

export const BusinessLogo = (props) => {
  return (
    <BusinessLogoStyled
      {...props}
      style={{ backgroundImage: `url(${props.bgimage})` }}
    >
      {props.children}
    </BusinessLogoStyled>
  )
}

export const WrapperBusinessLogo = styled.div`
  max-width: 75px;
  max-height: 75px;
  height: 75px;
  width: 75px;
  margin-right: 10px;
`

export const TimeContainer = styled.div`
  svg{
    position: relative;
    top: 1px;
    margin-right: 5px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`
