import styled, { css } from 'styled-components'

export const IconShare = styled.div`
  position: relative;
  margin: 10px 0px 0px;
  font-size: 22px;
  z-index: 9999999;
  background: ${props => props.theme.colors.white};
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  svg {
    font-size: 20px;
    position: relative;
    cursor: pointer;
    color: #333;
  }


  @media(min-width: 769px){
    position: relative;
  }
`

export const ShareButtons = styled.div`
  visibility: ${({ showShareButton }) => showShareButton ? 'visible' : 'hidden'};
  top: 35px;
  width: 40px;
  position: absolute !important;

  ${props => props.theme?.rtl
? css`
    right: -4px;
  `
: css`
    left: -4px;
  `}

  @media (min-width: 1201px) {
    top: 35px;
    left: -4px;
  }
`
export const CopyButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    > span {
      opacity: 0.7;
    }
  }
  > span {
    background-color: #0166ff;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;

    svg {
      font-size: 24px;
      color: #FFF;
    }
  }
`
export const ProductCopyURLContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;

  p {
    text-align: center;
    &.name {
      font-size: 20px;
      font-weight: 600;
      line-height: 30px;
      margin-bottom: 0;
      margin-top: 15px;
    }

    &.description {
      font-size: 14px;
      line-height: 24px;
      margin: 0;
    }
  }

  button {
    margin-top: 50px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;

    svg {
      font-size: 24px;
    }
  }

  @media (min-width: 768px) {
    button {
      width: 100%;
      margin-top: 115px;
    }
  }
`
export const ProductImageWrapper = styled.div`
  width: 95px;
  height: 95px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
  }
`
