import React from 'react'
import styled, { css } from 'styled-components'

export const CardContainer = styled.div`
  font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
  ${({ isShowAddButt }) => css`
    min-height: ${isShowAddButt ? '162px' : '110px'};
  `}
  background: ${({ soldOut, theme }) => soldOut ? '#6c757d33' : theme?.colors?.backgroundPage};
  padding: 10px 10px 10px 10px;
  margin: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }


  ${({ useCustomFunctionality }) => useCustomFunctionality && css`
    justify-content: center;
  `}

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    ${({ theme }) => theme?.business_view?.components?.products?.components?.product?.components?.image?.position === 'left'
      ? css`
        flex-direction: row-reverse;
      `
      : css`
        flex-direction: row;
      `
    }

    ${({ useCustomFunctionality }) => useCustomFunctionality && css`
      justify-content: center;
    `}

    ${({ isPreviously }) => isPreviously && css`
      flex-direction: column;
      align-items: flex-start;
      width: 98%;
    `}
    ${({ isFeatured }) => isFeatured && css`
      flex-direction: column;
      align-items: flex-start;
    `}
  }

  button {
    width: 100%;
    margin-top: 10px;
    padding: 4px;
  }
  ${({ productsRows }) => productsRows
    ? css`
    width: ${() => productsRows === 3 ? 'calc(33% - 20px)' : 'calc(50% - 20px)'};
    margin: 10px 0;
  `
    : css`
    width: 100%;
    margin: 10px;
    @media (min-width: 576px) {
      margin: 10px;
      width: calc(100% - 20px);

      ${({ isFavorite, fromOrders }) => (isFavorite || fromOrders) && css`
        margin: 0px 0px 30px;
      `}
      ${({ isPreviously }) => isPreviously && css`
        margin: 10px 10px 10px 0px;
      `}
      ${({ isFeatured }) => isFeatured && css`
        margin: 10px 10px 10px 0px;
      `}
    }

    ${({ isCartOnProductsList }) => isCartOnProductsList
        ? css`
          @media (min-width: 993px) {
            width: calc(50% - 20px);
            margin: 10px 20px 10px 0px;
            ${props => props.theme?.rtl && css`
              margin: 10px 0px 10px 20px;
            `}
          }
        `
        : css`
          @media (min-width: 681px) {
            width: calc(50% - 20px);
          }
          @media (min-width: 1000px) {
            width: calc(33% - 20px);
          }
      `}
  `}

  ${({ isPreviously }) => isPreviously && css`
    min-height: 200px;
    border: 0px;
    margin: 10px 5px 10px 0px;
    ${props => props.theme?.rtl && css`
      margin: 10px 0px 10px 5px;
    `}

    @media (min-width: 768px) {
      min-height: 330px;
    }
  `}

  ${({ isFeatured }) => isFeatured && css`
    min-height: 200px;
    padding: 10px 10px 10px 10px;
    border: 0px;
    margin: 10px 5px 10px 0px;
    ${props => props.theme?.rtl && css`
      margin: 10px 0px 10px 5px;
    `}

    @media (min-width: 768px) {
      min-height: 315px;
    }
  `}

  ${({ isFavorite, fromOrders }) => (isFavorite || fromOrders) && css`
    padding: 20px;
    border: 1px solid #E9ECEF;
    border-radius: 15px;
  `}
`

export const SoldOut = styled.span`
  font-weight: bold;
  position: absolute;
  background: #495057 0% 0% no-repeat padding-box;
  padding: 5px 10px;
  top: 7px;
  border-radius: 2px 0px 0px 2px;
  right: 0px;
  color: white;
  font-size: 12px;
  ${props => props.theme?.rtl && css`
    left: 0px;
    right: initial;
  `}
  &:first-letter {
    text-transform: uppercase;
  }

  ${({ isBottom }) => isBottom && css`
    bottom: 7px;
    top: initial;
  `}
`

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 130px;

  ${({ isBgimage, hideImage }) => css`
    width: ${isBgimage && !hideImage ? 'calc(100% - 130px)' : '100%'};
  `}

  > * {
    margin: 3px;
  }

  .description {
    font-size: 16px;
  }

  .product-card-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    .favorite-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-right: 5px;
      svg {
        color: ${props => props.theme.colors.danger500};
        font-size: ${props => (props.isFavorite || props.fromOrders) ? '20px' : '20px'};
      }
    }
    ${({ fromOrders }) => fromOrders && css`
      flex-direction: column;
      align-items: flex-start;
      .order-button {
        margin-top: 10px;
      }
      @media (min-width: 520px) {
        flex-direction: row;
        align-items: center;
      }
    `}
    ${({ isFavorite, fromOrders }) => (isFavorite || fromOrders) && css`
      flex-wrap: nowrap;
      flex-direction: column;
      align-items: flex-start;

      .order-button {
        width: unset;
        height: 35px;
        padding: 0px 15px;
        font-size: 15px;
        font-weight: 600;
        line-height: 24px;
        margin-top: 10px;
        background-color: #E9ECEF;
        border-width: 0px;
      }
      @media (min-width: 480px) {
        flex-direction: row;
        align-items: center;

        .order-button {
          margin-top: 0px;
        }
      }
    `}
  }

  p {
    color: ${props => props.theme?.colors.black};
    text-align: left;
    font-size: 10px;
    ${props => props.theme?.rtl && css`
      text-align: right;
    `}

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: pre-wrap;

    ${({ isFavorite, fromOrders }) => (isFavorite || fromOrders) && css`
      font-size: 16px;
    `}
  }

  span {
    color: ${props => props.theme.colors.black};
    font-size: 14px;
  }

  ${({ oneLine }) => oneLine && css`
    p {
      -webkit-line-clamp: 1;
    }
  `}

  ${({ isPreviously }) => isPreviously && css`
    width: 100%;
    min-height: 110px;
  `}

  ${({ isFeatured }) => isFeatured && css`
    width: 100%;
    min-height: unset;
  `}

  ${({ isPreviously, isFeatured }) => !isPreviously && !isFeatured && css`
    justify-content: space-between;
  `}

  ${({ fromOrders }) => fromOrders && css`
    min-height: 88px;
  `}

  @media (min-width: 1024px) {
    p {
      font-size: 12px;
    }
    ${({ isFavorite, fromOrders }) => (isFavorite || fromOrders) && css`
      p {
        font-size: 16px;
      }
    `}
    span {
      font-size: 14px;
    }
  }
`

export const WrapLogo = styled.div`
  position: relative;
  max-width: 130px;
  max-height: 130px;
  height: 130px;
  ${({ isBgimage }) => isBgimage && css`
    width: 130px;
  `}
  ${({ theme }) => theme?.business_view?.components?.products?.components?.product?.components?.image?.position === 'left'
    ? css`
    margin-right: 5px;
  `
    : css`
    margin-left: 5px;
  `}
  ${props => props.theme?.rtl && css`
    margin-right: 5px;
    margin-left: 0px;
  `}
  ${({ isPreviously }) => isPreviously && css`
    margin: 0px 0px 5px 0px;
    width: 226px;
    max-width: 226px;
    height: 150px;
    max-height: 150px;

    @media (min-width: 768px) {
      width: 326px;
      max-width: 326px;
      height: 227px;
      max-height: 227px;
    }
  `}
  ${({ isFeatured }) => isFeatured && css`
    margin: 0px 0px 5px 0px;

    @media (min-width: 768px) {
      width: 246px;
      max-width: 246px;
      height: 240px;
      max-height: 240px;
    }
  `}

  ${({ isFavorite }) => isFavorite && css`
    margin: 0px 50px 0px 0px;
    width: 140px;
    height: 144px;
    max-width: 140px;
    max-height: 144px;

    .image {
      min-height: 144px;
    }
  `}

  ${({ fromOrders }) => fromOrders && css`
    ${({ theme }) => theme?.business_view?.components?.products?.components?.product?.components?.image?.position === 'left'
      ? css`
        margin: 0px 50px 0px 0px;
      `
      : css`
        margin: 0px 0px 0px 50px;
      `
    }
    width: 88px;
    height: 88px;
    max-width: 88px;
    max-height: 88px;

    .image {
      min-height: 88px;
    }
  `}

  ${({ hideImage }) => hideImage && css`
    max-width: 0px;
    max-height: 0px;
    height: 0px;
    width: 0px;
  `}
`

export const WrapTags = styled.div`
  display: flex;
  margin-left: 10px;
  margin-right: 10px;
  overflow-x: auto;

  ${({ isBgimage }) => isBgimage && css`
    width: 50px;
  `}
  ${props => props.theme?.rtl && css`
    margin-right: 5px;
    margin-left: 0px;
  `}

  div {
    display: flex;
    margin: auto;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
`

const CardLogoStyled = styled.div`
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  background-position: center;
  object-fit: cover;
  min-height: 130px;
  border-radius: 20px;

  ${({ height }) => height && css`
    min-height: ${height}px;
  `}


  ${({ isFeatured }) => isFeatured && css`
    min-height: 130px;
    @media (min-width: 768px) {
      min-height: 240px;
    }
  `}

  ${({ isPreviously }) => isPreviously && css`
    min-height: 150px;
    @media (min-width: 768px) {
      min-height: 227px;
    }
  `}
`

const PlusIcon = styled.div`
  position: absolute;
  bottom: 4px;
  right: 2px;
  width: 38px;
  height: 38px;
  background-image: url("data:image/svg+xml,%3Csvg width='58' height='58' viewBox='0 0 58 58' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_132_10586)' filter='url(%23filter0_d_132_10586)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M14.75 6C13.4902 6 12.282 6.50045 11.3912 7.39124C10.5004 8.28204 10 9.49022 10 10.75L10 39.25C10 40.5098 10.5004 41.718 11.3912 42.6088C12.282 43.4996 13.4902 44 14.75 44H43.25C44.5098 44 45.718 43.4996 46.6088 42.6088C47.4996 41.718 48 40.5098 48 39.25V10.75C48 9.49022 47.4996 8.28204 46.6088 7.39124C45.718 6.50045 44.5098 6 43.25 6H14.75ZM30.1875 16.6875C30.1875 16.3726 30.0624 16.0705 29.8397 15.8478C29.617 15.6251 29.3149 15.5 29 15.5C28.6851 15.5 28.383 15.6251 28.1603 15.8478C27.9376 16.0705 27.8125 16.3726 27.8125 16.6875V23.8125H20.6875C20.3726 23.8125 20.0705 23.9376 19.8478 24.1603C19.6251 24.383 19.5 24.6851 19.5 25C19.5 25.3149 19.6251 25.617 19.8478 25.8397C20.0705 26.0624 20.3726 26.1875 20.6875 26.1875H27.8125V33.3125C27.8125 33.6274 27.9376 33.9295 28.1603 34.1522C28.383 34.3749 28.6851 34.5 29 34.5C29.3149 34.5 29.617 34.3749 29.8397 34.1522C30.0624 33.9295 30.1875 33.6274 30.1875 33.3125V26.1875H37.3125C37.6274 26.1875 37.9295 26.0624 38.1522 25.8397C38.3749 25.617 38.5 25.3149 38.5 25C38.5 24.6851 38.3749 24.383 38.1522 24.1603C37.9295 23.9376 37.6274 23.8125 37.3125 23.8125H30.1875V16.6875Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_132_10586' x='0' y='0' width='58' height='58' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='4'/%3E%3CfeGaussianBlur stdDeviation='5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_132_10586'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_132_10586' result='shape'/%3E%3C/filter%3E%3CclipPath id='clip0_132_10586'%3E%3Crect width='38' height='38' fill='white' transform='translate(10 6)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`

export const CardLogo = (props) => {
  const style = {}
  if (props.bgimage) {
    style.backgroundImage = `url(${props.bgimage})`
  }
  if (props.soldOut) {
    style.filter = 'brightness(70%)'
  }
  return (
    <CardLogoStyled {...props} style={style}>
      {props.children}
      {props.isFeatured && <PlusIcon />}
    </CardLogoStyled>
  )
}

export const PriceWrapper = styled.div`
  display: flex;
  align-items: center;

  span {
    font-size: 16px;
    font-weight: 600;
  }
  .current-price {
    min-width: 64px
  }
  .off-price {
    font-size: 10px;
    color: ${props => props.theme?.colors.darkGray};
    margin-left: 5px;
    text-decoration: line-through;
    ${({ isOffPrice }) => isOffPrice && css`
      min-width: 46px;
    `}
    ${props => props.theme.rtl && css`
      margin-right: 5px;
      margin-left: 0;
    `}

    @media (min-width: 1024px) {
      font-size: 13px;
      ${({ isOffPrice }) => isOffPrice && css`
        min-width: 64px;
      `}
      ${({ isFavorite, fromOrders }) => (isFavorite || fromOrders) && css`
        font-size: 16px;
      `}
    }
  }

  ${({ isFavorite, fromOrders }) => (isFavorite || fromOrders) && css`
    gap: 10px;

    span {
      font-size: 18px;
      ${({ fromOrders }) => fromOrders && css`
        font-size: 16px;
        font-weight: 400;
      `}
    }
  `}
`

export const QuantityContainer = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryContrast};
  position: absolute;
  top: 8px;
  right: 8px;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-sizing: border-box;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 999;

  ${props => props.theme?.rtl && css`
    right: initial;
    left: 8px;
  `}

  span {
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
  }
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
  top: -4px;
  right: -3px;
  background-color: ${props => props.theme.colors.primary};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  max-width: 70px;
  word-break: break-all;

  ${props => props.theme.rtl && css`
    left: -3px;
    right: initial;
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
`

export const LastOrder = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 400;
  font-size: 16px !important;
  margin: 0px 3px;
`

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    font-size: 20px;
    font-weight: 600;
    text-align: left;
    color: ${props => props.theme.colors.black};
    margin: 0px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: pre-wrap;

    ${({ isPreviously }) => isPreviously && css`
      font-size: 22px;
      font-weight: 600;
      -webkit-line-clamp: 1;
    `}

    ${({ isFeatured }) => isFeatured && css`
      font-size: 20px;
      font-weight: 600;
      -webkit-line-clamp: 1;
    `}

    ${({ isFavorite, fromOrders }) => (isFavorite || fromOrders) && css`
      font-size: 20px;
      font-weight: 600;
      -webkit-line-clamp: 1;
    `}
  }
`
export const SkeletonCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 130px);
  > * {
    margin: 3px;
  }
`
export const SkeletonCardLogo = styled.div`
  max-width: 130px;
  max-height: 130px;
  width: 130px;
  height: 130px;

  margin-left: 5px;
  ${props => props.theme?.rtl && css`
    margin-right: 5px;
    margin-left: 0px;
  `}
`
