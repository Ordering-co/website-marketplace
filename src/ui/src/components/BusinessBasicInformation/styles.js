import React from 'react'
import styled, { css } from 'styled-components'

export const BusinessContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  max-height: 360px;
  height: 150px;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  min-height: 150px;
  justify-content: start;
  align-items: flex-end;

  ${props => props.isSkeleton && css`
    background-color: #cccccc;
  `}

  ${props => props.bgimage && !props.isClosed && css`
    background-image: url(${props.bgimage});
  `}

  ${props => props.bgimage && props.isClosed && css`
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${props.bgimage});
  `}

  h1 {
    color: #FFF;
    opacity: 0.5;
    position: absolute;
    top: 0;
    right: 0;
    margin: 0 10px;
    padding: 0;
  }

  @media (min-width: 576px) {
    border-radius: ${props => props.theme?.utils?.radius?.m}px;
    height: 324px;
    min-height: 200px;
  }


`

export const BusinessContent = styled.div`
  margin: 0 25px 0 0;
  max-height: 70px;
  width: 70px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  border-radius: 20px;

  @media (min-width: 576px) {
    max-height: 124px;
    width: 124px;
  }
`

export const WrapperBusinessLogo = styled.div`
  max-width: 70px;
  max-height: 70px;
  width: 70px;
  height: 70px;

  @media (min-width: 576px) {
    max-width: 120px;
    max-height: 120px;
    height: 120px;
    width: 120px;
  }
`

const BusinessLogoStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  min-height: 70px;
  border-radius: 20px;

  @media (min-width: 576px) {
    min-height: 120px;
  }
`
export const BusinessLogo = (props) => {
  const style = {}
  if (props.bgimage) {
    style.backgroundImage = `url(${props.bgimage})`
  }
  return (
    <BusinessLogoStyled {...props} style={style}>
      {props.children}
    </BusinessLogoStyled>
  )
}

export const BusinessInfo = styled.div`
  display: flex;
`

export const BusinessInfoItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right:5px;
  ${props => props.theme?.rtl && css`
    padding-left: 5px;
    padding-right: 0;
  `}

  .type {
    font-size: 14px;
    color: ${props => props.theme.colors.darkTextColor};
    margin: 0 0 5px 0;
  }

  ${({ isInfoShrunken }) => isInfoShrunken && css`
    color: #FFFFFF;
    span, p, h5, svg {
      color: #FFFFFF !important;
    }
  `}
  .address {
    font-size: 20px;
  }
  .description {
    font-size: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
`

export const BusinessInfoContainer = styled.div`
  padding-top: 40px;
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  justify-content: ${props => props.isFlexEnd ? 'flex-end' : 'space-between'};
  flex-direction: column;
  box-sizing: border-box;
  align-items: ${props => props.isFlexEnd ? 'flex-end' : 'space-between'};

  ${({ $hideHeaderBanner }) => $hideHeaderBanner && css`
    padding-top: 0;
  `}

  @media (min-width: 576px) {
    padding-top: 0px;
    padding-left: 0px;
    padding-right: 0px;
    margin-top: 20px;

    ${({ $hideHeaderBanner }) => $hideHeaderBanner && css`
      margin-top: 0;
    `}
  }

  @media (min-width: 768px) {
    flex-direction: row;
    margin-bottom: 25px;
  }
`

export const BusinessInfoContent = styled.div`
  width: 100%;
`

export const SearchWrapper = styled.div`
  display: flex;
  z-index: 1000;
`

export const WrapperSearch = styled.div`
  margin: 15px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  z-index: 1002;

  .search-bar {
    margin-right: 10px;
    ${props => props.theme?.rtl && css`
      margin-left: 10px;
      margin-right: 0;
    `}
    input {
      width: 100%;

      @media (min-width: 500px) {
        width: 250px;
      }
    }
  }

  div:last-child {
    text-align: right;

    ${props => props.theme?.rtl && css`
      text-align: left;
    `}
  }

  #select-input {
    background-color: ${props => props.theme.colors.gray300} !important;
    border: none;
    color: #748194 !important;
    transition: all 0.3s ease;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    }

    #list {
      border-radius: 8px;
      background-color: ${props => props.theme.colors.gray300} !important;
    }
  }
  &.fixed-search {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10001;
    width: fit-content;
    margin-top: 0px;
    background-color: ${props => props.theme.colors.backgroundPage};
    padding: 10px;
  }

  @media (min-width: 993px) {
    position: absolute;
    right: 35px;
    ${props => props.theme?.rtl && css`
      right: auto;
      left: 35px;
    `}
    &.fixed-search {
      left: 0;
      width: 100vw;
      z-index: 10000;
    }
  }
`

export const BusinessDetail = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  border-radius: 20px;
  border: 1px solid ${props => props.theme?.colors.gray200};

  h5 {
    font-size: 14px;
    color: ${props => props.theme?.colors.darkGray};
    margin: 0 5px 0 0;
    font-weight: normal;
    ${props => props.theme?.rtl && css`
      margin-left: 5px;
      margin-right: 0px;
    `}
  }

  span {
    margin-right: 5px;
    ${props => props.theme?.rtl && css`
      margin-left: 5px;
      margin-right: 0px;
    `}
  }

  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    position: relative;
    font-size: 14px;
    font-weight: 600;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      height: 60%;
      width: 1px;
      background-color: ${props => props.theme?.colors.gray200};
    }

    span {
      font-weight: 400;
    }

    @media (min-width: 950px) {
      padding: 10px 50px;
    }
  }

  ${({ isSkeleton }) => isSkeleton && css`
    > span {
      display: flex;
      margin-right: 5px;
      ${props => props.theme?.rtl && css`
        margin-left: 5px;
        margin-right: 0px;
      `}
    }
  `}

  @media (min-width: 768px) {
    margin-top: 0px;
  }
`

export const BusinessMoreDetail = styled.div`
  ${({ position }) => position
    ? css`
    width: 100% !important;
    justify-content: flex-end !important;
    top: 0px;
    right: 0px;
  `
    : css`
    top: 30px;
    right: 30px;
  `}
  position: ${props => props.position ?? 'absolute'};
  min-width: 24px;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  svg {
    font-size: 24px;
    color: ${props => props.position ? 'black' : 'white'};
  }
`

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
  span {
    display: none;
  }
  h2 {
    font-size: 24px;
    line-height: 36px;
    margin: 0 0 0 0;
    font-weight: 600;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background: ${({ theme }) => theme?.colors?.backgroundPage};
    &.fixed-name {
      z-index: 10001;
      position: fixed;
      top: 0;
      padding: 10px 10px;
      font-size: 18px;
      ${({ isCustomLayout }) => !isCustomLayout
    ? css`
        width: calc(99vw);
        ${props => props.theme?.rtl
        ? css`
        right: 0px;
        `
        : css`
        left: 0px;
        `}
      `
    : css`
      ${props => props.theme?.rtl
        ? css`
          right: 10px;
          `
        : css`
          left: 10px;
        `}
      `}
      ${({ disableLeftSpace }) => disableLeftSpace && css`
      ${props => props.theme?.rtl
      ? css`
          right: 48px;
          `
      : css`
          left: 48px;
        `}
      `}
    }
    @media (min-width: 768px) {
      font-size: 32px;
      padding-bottom: 2px;
    }
  }
  .title-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
    }
  }
  .title-wrapper-left {
    display: flex;
  }
`

export const RibbonBox = styled.div`
  padding: 2px 8px;
  box-sizing: border-box;
  z-index: 10;
  color: ${props => props.theme.colors.colorTextSignForm};
  font-weight: 400;
  font-size: 10px;
  line-height: 13px;
  background-color: ${props => props.theme.colors.primary};
  max-width: 200px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-left: 5px;
  margin-bottom: 10px;

  ${props => props.theme.rtl && css`
    margin-left: 0px;
    margin-right: 5px;
  `}

  ${({ bgColor }) => bgColor && css`
    background-color: ${bgColor};
  `}

  ${({ isRoundRect }) => isRoundRect && css`
    border-radius: 7.6px;
  `}

  ${({ isCapsule }) => isCapsule && css`
    border-radius: 50px;
  `}

  ${({ colorText }) => colorText && css`
    color: ${colorText ? 'black' : 'white'};
  `}

  ${({ borderRibbon }) => borderRibbon && css`
    border: 1px solid ${borderRibbon ? 'black' : 'white'};
  `}
`
export const SearchIconWrapper = styled.div`
  cursor: pointer;
  background-color: ${props => props.theme.colors.gray300};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);
  margin-right: 10px;
  ${props => props.theme?.rtl && css`
    margin-right: 0;
    margin-left: 10px;
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
  svg {
    font-size: 18px;
    margin-right: 2px;
    margin-top: 2px;
  }
`

export const SearchComponentContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 60px;
  color: ${({ theme }) => theme.colors.white};
  ${props => props.theme?.rtl && css`
    right: auto;
    left: 60px;
  `}
  #select-input {
    color: #FFFFFF !important;
  }
  svg {
    color: #FFFFFF;
  }
`

export const SocialList = styled.div`
  display: flex;
  align-items: center;
`

export const CategorySelectedContainer = styled.div`
  display: inline;
  margin-left: 10px;
  color: ${({ theme }) => theme?.colors?.primary};
  padding-right: 5px;
  cursor: pointer;
  p{
    margin: 0;
  }
  svg {
    position: relative;
    top: 2px;
    margin-right: 3px;
    width: 14px;
    height: 14px;
  }
`

export const IconWrapper = styled.a`
  margin: 0px 0px 10px 10px;
  border-radius: 3px;
  width: 27px;
  height: 27px;
  min-width: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s linear;

  ${({ isSkeleton }) => isSkeleton && css`
    border: none;
  `}

  svg {
    font-size: 27px;
    transition: all 0.2s ease-in;
    color: ${props => props.theme.colors.headingColor};
  }
  &:hover {
    svg {
      transform: scale(1.07);
    }
  }
  @media (min-width: 768px) {
    margin: -15px 0px 10px 10px;
  }
`

export const BusinessInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const WrapperFloatingSearch = styled.div`
  position: absolute;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  background: rgba(0,0,0,0.2);
  top: 80px;
  right: 10px;
  width: 80%;
  border-bottom: 1px solid #FFFFFF;
  #select-input {
    color: #FFFFFF !important;
    background: transparent;
  }
  svg, span {
    color: #FFFFFF !important;
  }
  @media (min-width: 681px){
    top: 23px;
    right: 60px;
    width: 300px;
    input {
      width: 80%;
    }
  }
`

export const BackButton = styled.div`
  button {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
    svg {
      margin-right: 10px;
    }
  }
`

export const SearchContainer = styled.div`
  ${({ mobile }) => mobile && css`
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
    margin-top: 10px;
    > div {
      margin-top: 0px;
    }
  `}
  > button {
    margin-top: 10px;
    color: ${({ theme }) => theme?.colors?.primary};
    background: ${({ theme }) => theme?.colors?.backgroundInfo};
    min-width: 200px;
  }
`
export const BusinessDeliveryDetail = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: space-between;

  .preorder-reviews-container {
    display: flex;
    gap: 16px;

    button {
      border-radius: ${props => props.theme?.utils?.radius?.s}px;
      font-weight: 600;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px 15px;

      p {
        margin: 2px 0 0 0;
      }
    }
    @media (min-width: 480px) {
      gap: 16px;
    }
  }


  @media (min-width: 768px) {
    flex-direction: row;
    padding-left: 145px;
    margin-top: 40px;
    margin-bottom: 0px;

    ${({ $hideHeaderBanner }) => $hideHeaderBanner && css`
      padding-left: 0;
      margin-top: 10px;
    `}
  }
`

export const FavoriteWrapper = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin-left: 15px;
  ${props => props.theme.rtl && css`
    margin-right: 15px;
    margin-left: 0px;
  `}
  svg {
    position: relative;
    top: 6px;
    font-size: 20px;
    color: ${props => props.theme.colors.danger500};
  }
`
