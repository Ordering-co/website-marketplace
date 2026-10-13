import styled, { css } from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
`

export const IconContent = styled.button`
  position: relative;
  max-width: 100%;
  margin: 0px;
  display: inline-flex;
  min-height: 35px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  text-decoration: none;
  text-align: center;
  background-color: ${({ theme }) => theme?.colors?.white};
  box-shadow: 0px 4px 10px 0px #0000001F;
  width: 35px;
  height: 35px;
  padding: 0px;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(10px);

  &:hover {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px) scale(1.05);
    border-color: rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
  }

  svg {
    flex-shrink: 0;
    font-size: 30px;
    color: #333;
    transition: all 0.3s ease;
  }

  &:hover svg {
    color: ${({ theme }) => theme?.colors?.primary || '#000'};
    transform: scale(1.1);
  }
`

export const SidebarContent = styled.div`
  box-sizing: border-box;
  /* Fill the full viewport height and let the menu scroll, so the lower items
     (down to Sessions / Logout) stay reachable instead of being clipped.
     dvh accounts for mobile browser chrome; vh/% are fallbacks. */
  height: 100vh;
  height: 100dvh;
  width: 0;
  position: fixed;
  z-index: 20500;
  top: 0;
  background-color: ${({ theme }) => theme.colors.backgroundPage};
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  transition: 0.5s;
  padding-top: 60px;
  padding-bottom: 24px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;

  > h2 {
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.primary};
    margin: 10px 20px;
  }

  ${props => props.theme?.rtl
  ? css`
      right: 0;
  `
: css`
      left: 0;
  `}

  @media (max-height: 450px) {
    padding-top: 15px;
  }
`

export const MenuClose = styled.button`
  position: absolute;
  top: 7px;
  left: 82vw;
  max-width: 100%;
  margin: 10px;
  display: inline-flex;
  min-height: 35px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  text-decoration: none;
  text-align: center;
  background-color: ${({ theme }) => theme?.colors?.white};
  box-shadow: 0px 4px 10px 0px #0000001F;
  width: 35px;
  height: 35px;
  padding: 0px;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px) scale(1.05);
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
  }

  svg {
    flex-shrink: 0;
    font-size: 30px;
    color: #333;
    transition: all 0.3s ease;
  }

  &:hover svg {
    color: ${({ theme }) => theme?.colors?.primary || '#000'};
    transform: scale(1.1);
  }

  @media (min-width: 489px) {
    left: 280px;
  }
`

export const CustomerInfo = styled.div`
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  position: absolute;
  top: 7px;
  left: 0px;
  color: ${({ theme }) => theme.colors.primary};
  margin: 20px 20px 10px 20px;
  width: 60vw;

  p {
    display: flex;
    font-size: 24px;
    margin: 0px;
    font-weight: 400;
  }

  .customer-name {
    padding-left: 6px;
    font-weight: 700;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 28px;
  }

  @media (min-width: 489px) {
    width: 250px;
  }
`

export const MenuLink = styled.a`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  text-decoration: none;
  appearance: none;
  border: none;
  padding: 0px;
  margin: 0px;
  text-align: inherit;
  display: block;
  width: 100%;
  background: ${({ theme }) => theme.colors.backgroundPage};
  outline: none !important;
  transition: all 0.3s ease;
  border-radius: 8px;

  &:hover {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  }

  ${({ isCustomer }) => isCustomer && css`
    border-bottom: 1px solid black;

    @media (min-width: 451px) {
      display: none;
    }
  `};

  @media (max-height: 450px) {
    font-size: 18px;
  }
`

export const WrappContent = styled.div`
  box-sizing: border-box;
  max-width: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: auto 1fr;
  column-gap: 20px;
  padding: 15px 20px;

  @media (min-width: 489px) {
    max-width: 340px;
  }
`

export const MenuLinkIcon = styled.div`
  grid-area: 2 / 1 / auto / auto;
  flex-shrink: 0;
  line-height: 0;
  display: flex;
  align-items: center;
  margin: 0px;
  transition: all 0.3s ease;

  svg {
    flex-shrink: 0;
    color: #000;
    width: 20px;
    height: 20px;
    color: ${({ active, theme }) => active ? theme.colors.primary : '#000'};
    transition: all 0.3s ease;
  }

  ${({ parent }) => parent && css`
    &:hover svg {
      transform: scale(1.1);
      color: ${({ theme }) => theme?.colors?.primary || '#000'};
    }
  `}
`

export const MenuLinkText = styled.div`
  max-width: 100%;
  flex-grow: 1;
  overflow: hidden;
  flex-basis: 100%;
  grid-area: 2 / 2 / auto / auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: 489px) {
    flex-direction: row;
  }
`

export const TextInfo = styled.span`
  font-size: 16px;
  font-weight: ${({ bold }) => bold ? '600' : '400'};
  line-height: 24px;
  letter-spacing: -0.04ch;
  text-transform: capitalize;
  text-align: left;
  margin: 0px;
  padding: 0px;
  display: block;
  font-variant-ligatures: no-common-ligatures;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ active, theme }) => active ? theme.colors.primary : '#000'};
  transition: all 0.3s ease;

  ${props => props.theme?.rtl && css`
    text-align: right;
    display: inline-block;
    color: #000;
  `}

  ${({ hideIcon }) => hideIcon && css`
    color: ${({ theme }) => theme?.colors?.danger500};
  `}
`
export const MenuLinkSeparator = styled.div`
  grid-area: -1 / 1 / auto / -1;
  margin: 15px -16px -16px 0px;

  div {
    width: 100%;
    padding-left: 0px;
    margin-top: 0px;
    margin-bottom: 0px;

    ${props => props.theme?.rtl
? css`
      padding-right: 0px;
      margin: 15px 0px -16px -16px;
    `
: css`
      padding-left: 0px;
      margin: 15px -16px -16px 0px;
    `}

    hr {
      display: block;
      width: 100%;
      margin: 0px;
      border: none;
      height: 1px;
      background: rgb(231, 231, 231);
    }
  }
`
