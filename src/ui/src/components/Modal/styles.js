import styled, { css } from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  border-radius: ${props => props.theme?.utils?.radius?.m}px;
  background-color: transparent;
  height: 100%;

  ${({ zx }) => zx && css`
    .popup {
      z-index: ${zx} !important;
    }
  `}

  ${({ isProductForm }) => !isProductForm && css`
    padding: 12px 5px 12px 0px;
    background-color: ${({ isTransparent, theme }) => isTransparent ? 'transparent' : theme?.colors?.backgroundPage};
  `}

  ${({ fullModalScreen }) => fullModalScreen && css`
    padding: 0px;
  `}

  @media (max-width: 768px) {
    border-radius: 0px;
    /* below 769px the width/maxWidth props never apply, so without an
       explicit width the modal shrink-wraps to its content inside the centering
       .popup-component flexbox (gray side bars / horizontal overflow). Force
       full-bleed on mobile. */
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  @media (min-width: 769px) {
    width: ${({ width }) => width || '100%'};
    max-width: ${({ maxWidth }) => maxWidth || '50vw'};
    border-radius: ${props => props.theme?.utils?.radius?.m}px;
    height: auto;

    ${({ isSlideBar, slideBarPosition, open, avoidFixed }) => isSlideBar && css`
      ${!avoidFixed && css`
        position: fixed;
      `}
      border-radius: 0px;
      max-height: 100vh;
      max-height: 100dvh; /* dvh = visible viewport under mobile URL bars (vh fallback above) */
      height: 100%;
      min-width: 0px;
      width: 0%;
      right: ${slideBarPosition === 'right' ? 0 : 'initial'};
      left: ${slideBarPosition !== 'right' ? 0 : 'initial'};

      ${open
      ? css`
              animation: slide-in 0.25s forwards;
              -webkit-animation: slide-in 0.25s forwards;
            `
      : css`
        animation: slide-out 0.25s forwards;
        -webkit-animation: slide-out 0.25s forwards;
      `}


      @-webkit-keyframes slide-in {
       100% { width: 35%; min-width: 450px; }
      }

      @keyframes slide-in {
        100% { width: 35%; min-width: 450px; }
      }

      @keyframes slide-out {
        0% { width: 35%; min-width: 400px; }
        100% { width: 0%; min-width: 0px; }
      }

      @-webkit-keyframes slide-out {
        0% { width: 35%; min-width: 400px; }
        100% { width: 0%; min-width: 0px; }
      }
    `}
  }
`

export const ModalDialog = styled.div`
  position: relative;
  background-color: ${({ isTransparent, theme }) => isTransparent ? 'transparent' : theme?.colors?.backgroundPage};
  padding: ${({ padding }) => padding || '30px 20px 10px'};
  width: 100%;
  border-radius: 0px;
  box-sizing: border-box;
  margin-top: auto;
  margin-bottom: auto;
  height: ${({ height }) => height || '100%'};
  max-height: 100vh;
  max-height: 100dvh;
  overflow: auto;
  overflow-x: ${({ disableOverflowX }) => disableOverflowX ? 'hidden' : 'auto'};
  z-index: 10001;
  @media (min-width: 769px) {
    width: 100%;
    max-height: 85vh;
    border-radius: ${props => props.theme?.utils?.radius?.m}px;
    height: auto;
    ${({ isSlideBar }) => isSlideBar && css`
      max-height: 100%;
    `}

    ${({ minHeight }) => minHeight && css`
      min-height: ${minHeight};
    `}

    ${({ hideScrollbar }) => hideScrollbar && css`
      scrollbar-width: none !important;
    `}
  }
  @media (max-width: 360px) {
      h1 {
        z-index: 1000;
      }
    }
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 30px 0px 0px;
  button {
    width: 100%;
    border-radius: 32px;
    opacity: 1;
    height: 45px;
    &:nth-child(1) {
      margin-right: 25px;
      ${props => props.theme?.rtl && css`
        margin-left: 25px;
        margin-right: 0px;
      `}
    }
  }
`
export const ModalHeader = styled.div`
  display: flex;
  margin-top: 40px;

  @media(min-width: 450px){
    margin-top: 0;
  }

`

export const ModalTitle = styled.h2`
  font-weight: 600;
  font-size: 24px;
  text-align: left;
  letter-spacing: 0px;
  color: #010300;
  opacity: 1;
  margin: 0px 0px;
  margin-bottom: 20px;
  padding-left: 10px;
  flex: 1;

  ${props => props.theme?.rtl && css`
    text-align: left;
    padding-right: 10px;
    padding-left: 0px;
  `}
  &::first-letter {
    text-transform: capitalize;
  }
`

export const ModalOrderTypes = styled.div`
  margin-right: 15px;
  ${props => props.theme?.rtl && css`
    padding-left: 15px;
    padding-right: 0px;
  `}
`
export const ModalIcon = styled.span`
  cursor: pointer;
  position: fixed;
  right: 33px;
  top: 30px;
  font-size: 30px;
  z-index: 2;
  transition: all 0.2s ease;

  ${props => props.theme?.rtl && css`
    left: 25px;
    right: initial;
  `}
  ${({ isProductForm }) => isProductForm && css`
    top: 17px;
    left: 15px;
    svg {
      cursor: pointer;
      background-color: ${props => props?.theme?.colors.white};
    }
  `}
  svg {
    background-color: ${props => props?.theme?.colors.white};
    transition: all 0.2s ease;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.12);
    padding: 2px;

    &:hover {
      transform: scale(1.02);
      background-color: ${props => props?.theme?.colors.white};

      > svg {
        color:  #151b26;
      }
    }

    &:active {
      transform: scale(0.98);
      background-color: ${() => darken(0.07, '#CCC')};
    }

    border-radius: 10px;
  }
  @media(min-width: 769px){
    position: absolute;
  }
`

export const ModalBackHeader = styled.div`
  height: 70px;
  background-color: white;
  width: 100%;
  position: fixed;
  z-index: 2;

  @media (min-width: 769px) {
    display: none;
  }
`
export const ModalIconWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${props => props.theme.colors.backgroundPage};
  z-index: 100;
  height: 70px;

  @media (min-width: 450px) {
    position: initial;
    height: initial;
  }
`
