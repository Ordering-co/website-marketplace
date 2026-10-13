import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  overflow: hidden;
  box-shadow: 0px 1px 4px 0px #0000001A;
  border-radius: 10px;
  transition: all 0.3s ease;

  ${({ open }) => !open && css`
    &:not(:has(#cart-header-item.cart-header-fixed)):hover {
      transform: scale(1.1);
    }
    &:has(#cart-header-item.cart-header-fixed) {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  `}

  ${({ open, isSlideBar }) => open && !isSlideBar && css`
    background-color: ${props => props.theme.colors.lightGreen};
  `}
`

export const HeaderItem = styled.div`
  cursor: pointer;
  &.cart-header-fixed {
    position: fixed;
    top: 6px;
    /* Anchor to the viewport's right edge — without this the fixed icon keeps a
       stale static left offset and overflows off the right edge. */
    right: 10px;
    left: auto;
    /* stay above page content but BELOW the modal backdrop so an open
       modal covers the icon instead of the icon covering the modal's close "X".
       Overlay ladder: page bars ~1000-1006 < ModalDialog 10001 < this 20000
       < Popup portal 20001 < .popup-backdrop 20002 < SidebarMenu 20500. */
    z-index: 20000;
    box-shadow: rgb(0 0 0 / 25%) 0px 1px 4px 0px;
    border-radius: 10px;
    ${props => props.theme?.rtl && css`
      right: auto;
      left: 10px;
    `}
  }

  > span {

    color: ${props => props.theme.colors.black};
    padding: 12px;
    display: flex;
    align-items: center;
    border-radius: 10px;

    span {
      margin: 0;
      font-size: 14px;
      ${props => props.theme?.rtl
? css`
        margin-right: 10px;
      `
: css`
        margin-left: 10px;
      `}
    }
    svg {
      ${({ open, isSlideBar }) => open && !isSlideBar && css`
        fill: ${props => props.theme.colors.darkGreen};
      `}
      font-size: 20px;
    }
  }
`

export const PopoverBody = styled.div`
  background-color: ${(props) => props.theme?.colors?.backgroundPage};
  color: #333;
  padding: 15px 5px;
  border-radius: 10px;
  max-width: 500px;
  z-index: 10002;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;
`

export const PopoverArrow = styled.div`
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 8px solid #FFF;
  top: -8px;
`

export const Title = styled.h1`
  font-weight: 600;
  font-size: 20px;
  color: ${props => props.theme.colors.darkTextColor};
  margin-bottom: 8px;
  line-height: 30px;
  margin-top: 0;
  text-align: center;

  @media (min-width: 576px) {
    text-align: left;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    display: flex;
    align-items: center;
    border-radius: 16px;
    svg{
      margin-right: 5px;
    }
  }
`
