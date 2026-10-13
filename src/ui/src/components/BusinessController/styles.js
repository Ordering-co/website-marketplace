import React from 'react'
import styled, { css } from 'styled-components'

export const ContainerCard = styled.div`
  font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
  box-sizing: border-box;
  max-height: 320px;
  height: auto;
  border-radius: 10px;
  margin: ${({ m }) => m ?? '10px 20px'};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: ${props => props.theme?.colors?.white};
  padding: 10px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.12);
  }

  ${({ isCustomerMode }) => isCustomerMode && css`
    max-height: 420px;
    height: ${({ isSkeleton }) => isSkeleton ? 'auto' : '420px'};
  `}

  ${({ minWidthEnabled }) => minWidthEnabled && css`
    min-width: calc(65% - 40px);
  `}

  ${({ hideProductList, fromBusinessListingSearch }) => !hideProductList && fromBusinessListingSearch && css`
    min-width: 350px;
  `}

  ${({ typeButton }) => typeButton && css`
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: none;
    min-width: 280px !important;

    &:hover {
      transform: translateY(-4px);
      box-shadow: none;
    }
    button {
      padding: 10px 30px;
      font-weight: 600;
    }
  `}

  ${({ firstCard }) => firstCard && css`
    margin-left: 0;
  `}

  ${({ disabled }) => disabled && css`
    cursor: not-allowed;
  `}

  ${({ businessRows, isShowMap, fromFavoriteList, fromMyOrders }) => !isShowMap && !fromFavoriteList && !fromMyOrders && css`
    width: calc(100% - 40px);

    @media (min-width: 481px) {
      max-height: ${({ isCustomerMode }) => isCustomerMode ? '380px' : '340px'};
    }

    @media (min-width: 681px) {
      width: calc(50% - 40px);
    }

    @media (min-width: 993px) {
      width: calc(33% - 37px);
    }

    @media (min-width: 1400px) {
      width: ${() => businessRows === 4 ? 'calc(25% - 40px)' : businessRows === 3 ? 'calc(33% - 40px)' : 'calc(25% - 40px)'};
    }
  `}

  ${({ isShowMap }) => isShowMap && css`
    width: calc(100% - 40px);
    margin: 20px;
  `}

  ${({ fromFavoriteList, fromMyOrders }) => (fromFavoriteList || fromMyOrders) && css`
    width: 100%;
    border: 1px solid #E9ECEF;
    margin: 0px 0 20px;
    padding: 5px 20px 20px;
  `}
`

export const WrapperBusinessCard = styled.a`
  height: 100%;
  position: relative;
  text-decoration: none;
  cursor: ${({ isSkeleton }) => isSkeleton ? 'default' : 'pointer'};
  ${({ disabled }) => disabled && css`
    pointer-events: none;
    cursor: not-allowed;
  `}
`

export const BusinessHero = styled.div`
  border-radius: 10px;

  > span {
    display: flex;
  }
`

const BusinessHeaderStyled = styled.div`
  display: flex;
  width: calc(100% + 20px);
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  min-height: 145px;
  justify-content: center;
  align-items: center;
  border-radius: 20px 20px 0 0;
  margin: -10px -10px 0 -10px;

  ${({ isShowMap }) => isShowMap && css`
    min-height: unset;
  `}

  h1, h2 {
    color: #FFF;
    opacity: 0.7;
  }

  .closed, .disabled {
    text-transform: uppercase;
    font-weight: 600;
    font-size: 22px;
    line-height: 35px;
    opacity: 1;
    position: relative;
    z-index: 2;
  }

  .disabled {
    font-size: 16px;
    text-align: center;

  }

  @media (min-width: 481px) {
    ${({ isShowMap }) => !isShowMap && css`
      min-height: 140px;
    `}
    ${({ fromBusinessListing, isShowMap }) => fromBusinessListing && !isShowMap && css`
      min-height: 200px;
    `}
  }

  ${({ $noImage, theme }) => $noImage && css`
    background-color: ${theme?.colors?.secundary || '#EFEFEF'};

    h1, h2 {
      color: ${theme?.colors?.darkGray || '#616161'};
    }
    .closed, .disabled {
      color: ${theme?.colors?.darkTextColor || '#000'};
    }
  `}
`

export const BusinessHeaderPlaceholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  pointer-events: none;
`

export const PlaceholderLogo = styled.img`
  max-width: 55%;
  max-height: 60%;
  object-fit: contain;
  border-radius: 8px;
`

export const PlaceholderInitial = styled.span`
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  color: ${props => props.theme?.colors?.darkGray || '#616161'};
`

export const BusinessHeader = (props) => {
  const { bgimage, isShowMap, isClosed, logo, name, children, ...rest } = props
  const hasImage = !!bgimage
  const showPlaceholder = !hasImage && !isShowMap
  const style = {}
  if (!isShowMap && hasImage) {
    style.backgroundImage = isClosed
      ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgimage})`
      : `url(${bgimage})`
  }

  return (
    <BusinessHeaderStyled {...rest} isShowMap={isShowMap} isClosed={isClosed} $noImage={showPlaceholder} style={style}>
      {showPlaceholder && (
        <BusinessHeaderPlaceholder aria-hidden='true'>
          {logo
            ? <PlaceholderLogo src={logo} alt='' loading='lazy' />
            : <PlaceholderInitial>{(name || '').trim().charAt(0).toUpperCase() || '?'}</PlaceholderInitial>}
        </BusinessHeaderPlaceholder>
      )}
      {children}
    </BusinessHeaderStyled>
  )
}

export const BusinessHeaderClosedContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    div {
      text-align: center;
      width: 100%;
      overflow-wrap: break-word;
      word-break: normal;
    }

`

export const BusinessTags = styled.div`
  display: flex;
  position: absolute;
  justify-content: space-between;
  align-items: center;
  top: 0px;
  margin: 10px;
  width: calc(100% - 17px);

  ${({ hasRibbon }) => hasRibbon && css`
    top: 20px;
  `}

  span.crown {
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 20px;
    display: flex;
    align-items: center;
    color: #FFC917;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  span {
    font-size: 11px;
    padding: 3px 8px;
    color: ${props => props.theme?.colors.white};
    background: ${props => props.theme?.colors.darkGray};
    border-radius: 50px;
    margin-right: 10px;
    ${props => props.theme?.rtl && css`
      margin-left: 10px;
      margin-right: 0;
    `}
    &:last-child {
      ${props => props.theme?.rtl
      ? css`
        margin-left: 0px;
        `
      : css`
        margin-right: 0px;
      `}
    }
  }
`

export const BusinessContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 135px;
  padding-top: 10px;
  ${({ isCustomerMode }) => !isCustomerMode && css`
    height: calc(100% - 145px);

    @media (min-width: 481px) {
      height: calc(100% - 165px);
      ${({ fromBusinessListing }) => fromBusinessListing && css`
        height: calc(100% - 225px);
      `}
    }
  `}

  ${({ isShowMap }) => isShowMap && css`
    max-height: unset;
  `}
`

export const WrapperBusinessLogo = styled.div`
  align-self: center;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  ${({ isCustomerMode }) => isCustomerMode && css`
    width: 65px;
    height: 65px;
    min-height: 65px;
    min-width: 65px;
  `}

  ${({ isSkeleton }) => isSkeleton && css`
    height: auto;
    width: auto;
    > span {
      display: flex;
    }
    @media (min-width: 481px){
      ${({ isCustomerMode }) => isCustomerMode && css`
        min-width: 75px;
        min-height: 75px;
        height: 75px;
        width: 75px;
      `}
    }
  `}
`

const BusinessLogoStyled = styled.div`
  display: flex;
  width: 75px;
  height: 75px;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  min-height: 75px;
  border-radius: 10px;

  @media (min-width: 481px){
    min-width: 80px;
    min-height: 80px;
    height: 80px;
    width: 80px;
    min-height: 80px;
    ${({ isCustomerMode }) => isCustomerMode && css`
      width: 100%;
      height: 100%;
    `}
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
  ${({ isCustomerMode }) => isCustomerMode
? css`
    width: 90%;
  `
: css`
    width: 100%;
  `}
`

export const BusinessInfoItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;

  ${({ fromMyOrders }) => fromMyOrders && css`
    min-height: 70px;
  `}
  div {
    display: flex;
    p {
      margin-right: 5px;
      ${props => props.theme?.rtl && css`
        margin-left: 5px;
        margin-right: 0;
    `}
      text-transform: capitalize;
      display: flex;
      align-items: center;
      margin: 0px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    p.bold {
      font-weight: bold;
    }
  }

  div.name-content {
    display: flex;
    justify-content: space-between;
  }

  .order-now-button {
    border-radius: ${props => props.theme.utils.radius.m}px;
    height: 60px;
  }
`

export const BusinessName = styled.h6`
  font-size: ${props => props.fontSize ?? '16px'};
  display: -webkit-box;
  word-break: break-all;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  margin-block-start: 0;
  margin-block-end: 0;
  color: ${props => props.theme.colors.darkTextColor};
`

export const Categories = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: #6C6C6C;

  @media (min-width: 481px) {
    font-size: 16px;
  }
`

export const Medadata = styled.div`
  margin-top: 0px;
  display: flex;
  justify-content: ${({ flexStart }) => flexStart ? 'flex-start' : 'space-between'};
  font-weight: 400;
  font-size: 12px;
  color: ${props => props.theme?.colors.black};
  flex-wrap: wrap;
  gap: ${({ gap }) => gap ?? '0px'};

  ${({ isCustomerMode }) => isCustomerMode && css`
    > div {
      flex-direction: column;
    }
  `}
  ${({ isSkeleton }) => isSkeleton && css`
    display: flex;
    justify-content: center;
  `}
  ${({ fromBusinessListing }) => fromBusinessListing && css`
    flex-wrap: nowrap;
  `}
  p {
    font-size: ${({ fontSize }) => fontSize ?? '14px'};
    color: ${props => props.theme?.colors.black};
    svg {
      font-size: 16px;
      min-width: 6px;
      margin: 0 3px 0 0;
      ${({ isShowMap }) => isShowMap && css`
        color: ${props => props.theme?.colors?.gray200};
      `}
    }

    span {
      margin-right: 10px;
      ${props => props.theme?.rtl && css`
        margin-left: 10px;
        margin-right: 0;
      `}
    }
  }

  .business-info-item {
    padding-right: 30px;

    ${({ fromBusinessListing }) => fromBusinessListing && css`
      padding-right: 0px;
    `}
  }
  .overflow-hidden {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
  }
  .bullet {
    ${({ fromBusinessListing }) => fromBusinessListing && css`
        font-size: 16px;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre-wrap;
    `}
    ${({ fromFavoriteList }) => fromFavoriteList && css`
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    `}
    svg {
      font-size: 12px;
      color: ${props => props.theme?.colors?.gray200};
    }
  }

  .order-now-button {
    height: 35px;
    font-size: 15px;
    font-weight: 600;
    line-height: 24px;
    background-color: #E9ECEF;
    border-width: 0px;
  }

  @media (min-width: 481px) {
    font-size: 14px;
  }
`

export const BusinessInfoItemMap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-radius: 20px;
  background-color: ${props => props.theme?.colors.grayDividerColor};
  margin-top: 10px;
  margin-bottom: 10px;

  h2 {
    font-size: 16px;
    margin: 0px;
  }

  div.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  div.info-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: ${props => props.theme?.colors?.black};
  }
  div.info-item:first-child {
    margin-bottom: 10px;
  }

`

export const CallCenterInformation = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 10px;
  margin-bottom: 10px;
  div {
    justify-content: space-evenly;
  }
`

export const CallCenterInformationBullet = styled.div`
  display: flex;
  padding: 2px;
  margin-bottom: 2px;
  border-radius: 16px;
  background: ${({ bgcolor }) => bgcolor};
  width: 50px;
  color: #fff;
  svg{
    font-size: 18px;
  }
`

export const BusinessLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0;
  margin-bottom: 0;


  ${({ hideBusinessLogo }) => !hideBusinessLogo && css`
    margin-right: 10px;
  `}
`

export const BusinessStarInfo = styled.div`
  display: flex;
  align-items: center;
  padding-right: ${props => props.fromFavoriteList || props.fromMyOrders || props.fromBusinessListing ? '3px' : '0px'};

  .reviews {
    display: flex;
    align-items: center;
    svg {
      margin-right: 3px;
      font-size: ${props => props.fontSize ?? '22px'};
      color: #FBA800;
      ${props => props.theme?.rtl && css`
        margin-left: 3px;
        margin-right: 0;
    `}
    }
    span {
      font-size: 15px;
      color: #FBA800;
    }
  }

  ${({ fromFavoriteList, fromMyOrders }) => (fromFavoriteList || fromMyOrders) && css`
    .reviews {
      svg {
        margin-right: 0px;
        color: ${props => props.theme?.colors?.darkGreen};
      }
      span {
        font-size: 14px;
        color: ${props => props.theme?.colors?.darkGreen};
      }
    }
  `}
`

export const CardOverlay = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 7.6px;
  z-index: 1;
`

export const InfoLength = styled.p`
  font-size: 16px;
  font-weight: 600;
`

export const InfoDescription = styled.p`
  font-size: 12px;
`

export const RibbonBox = styled.div`
  position: absolute;
  padding: 2px 8px;
  box-sizing: border-box;
  z-index: 10;
  color: ${props => props.theme.colors.colorTextSignForm};
  font-weight: 400;
  font-size: 10px;
  line-height: 13px;
  top: ${props => props.isShowMap ? '-20px' : '0px'};
  background-color: ${props => props.theme.colors.primary};
  max-width: 180px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;

  ${props => props.isShowMap
  ? css`
      right: -3px;
    `
  : css`
      left: 0px;
    `}
  ${props => props.theme.rtl && css`
    right: -3px;
    left: initial;
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

export const FavoriteWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 15px;
  ${props => props.theme.rtl && css`
    margin-right: 15px;
    margin-left: 0px;
  `}

  svg {
    font-size: 20px;
    color: ${props => props.theme.colors.danger500};
  }
`

export const OpenAtContainer = styled.div`
  color: ${({ theme }) => theme?.colors?.primary};
  font-weight: 400;
  font-size: ${props => props.theme?.utils?.tsize?.xs + 'px'};
`
