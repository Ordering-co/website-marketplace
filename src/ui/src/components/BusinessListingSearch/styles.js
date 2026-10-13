import React from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'

export const BusinessListingSearchContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  ${({ isShowMap }) => isShowMap && css`
    padding: 0 20px 0px;
  `}
`

export const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  cursor: pointer;

  h3 {
    margin: 0 10px 0 0;
  }

  .rotate {
    transform: rotate(180deg);
  }

  .accordion__icon {
    transition: transform 0.6s ease;
  }
`

export const FiltersContainer = styled.div`
  flex-direction: column;
  @media (min-width: 993px){
    flex-direction: row;
    display: flex;
    width: 100%;
  }
`

export const Filters = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 8px 10px;
  box-sizing: border-box;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  position: relative;
  &::-webkit-scrollbar { display: none; }

  ${({ fullWidth }) => !fullWidth && css`
    padding-top: 12px;
  `}
`

export const FiltersInner = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: max-content;
`

export const FilterItem = styled.div`
  cursor: pointer;
  padding: 8px 16px;
  margin-inline-end: 16px;
  border-radius: 20px;
  font-size: 14px;
  background: ${props => props.active ? props.theme.colors.lightGreen : props.theme.colors.gray300};
  color: ${props => props.active ? props.theme.colors.darkGreen : props.theme.colors.black};
  border: 1px solid ${props => props.active ? props.theme.colors.lightGreen : props.theme.colors.gray200};
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.active
      ? darken(0.05, props.theme.colors.lightGreen)
      : props.theme.colors.backgroundPage};
    border-color: ${props => props.active ? props.theme.colors.darkGreen : props.theme.colors.primary};
    color: ${props => props.active ? props.theme.colors.darkGreen : props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.10);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 14px;
    color: ${props => props.active ? props.theme.colors.darkGreen : props.theme.colors.black};
    transition: all 0.25s ease;
  }

  &:hover svg {
    color: ${props => props.active ? props.theme.colors.darkGreen : props.theme.colors.primary};
  }
`

export const BusinessBanner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  position: relative;

  ${({ bgimage }) => bgimage && css`
    width: 100%;
    height: calc(65vh - 98px);
    background-image: url(${bgimage});
    background-repeat: no-repeat, repeat;
    background-size: cover;
    object-fit: cover;
    background-position: center;

    @media (min-width: 450px) {
      height: 370px;
    }

    @media (min-width: 821px) {
      height: ${({ height, theme }) => theme?.business_listing_view?.components?.business_hero?.components?.styles?.height || height || '650px'};
    }
  `}

  @media (max-width: 576px) {
    margin-bottom: 15px;
  }
`

export const FiltersResultContainer = styled.div`
  width: 100%;
  max-width: 100%;
  ${({ fullWidth }) => !fullWidth && css`
    @media (min-width: 993px) {
      display: flex;
    }
  `}
`

export const SortContainer = styled.div`

`

export const MaxFilterContainer = styled.div`
  p.under-price {
    font-size: 14px;
    color: ${props => props.theme.colors.black};
  }
`

export const TagsContainer = styled.div`

`

export const ProgressContentWrapper = styled.div`
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: #F8F9FA;
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;

  svg {
    position: absolute;
    color: ${props => props?.theme?.colors?.darkGreen};
    z-index: 1;
    font-size: 10px;
    transform: translateX(-50%) translateY(-50%);
    top: 50%;
  }
`

export const ProgressBar = styled.div`
  height: 4px;
  border-radius: 50px;
  background: ${props => props?.theme?.colors?.darkGreen};
`

export const MaxItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

export const BusinessList = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${({ hideProductList }) => hideProductList ? 'column' : 'row'};
  box-sizing: border-box;
  align-items: center;
  ${({ noResults }) => noResults && css`
    justify-content: center;
  `}
  ${({ hideProductList }) => !hideProductList && css`
    flex-wrap: nowrap;
    overflow-x: auto;
  `}

  @media (min-width: 480px){
    flex-direction: row;
  }
  #searchlist {
    > div {
      width: calc(100% - 40px);
      min-width: calc(100% - 40px);

      @media (min-width: 681px) {
        width: calc(50% - 40px);
        min-width: calc(50% - 40px);
      }
      @media (min-width: 993px) {
        width: calc(33% - 40px);
        min-width: calc(33% - 40px);
      }
      @media (min-width: 1200px) {
        width: calc(25% - 40px);
        min-width: calc(25% - 40px);
      }
    }
  }
`

export const MaxItem = styled.p`
  cursor: pointer;
  margin-top: 0;
  font-size: 14px;
  font-weight: ${({ active }) => active ? '600' : '400'};
  color: ${({ active, theme }) => active ? theme.colors.primary : 'inherit'};
  transition: color 0.25s ease;
`

export const SortItem = styled.p`
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ active }) => active ? '600' : '400'};
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 8px;
  margin: 4px 0;

  &:hover {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  }
`

export const ProductsList = styled.div`
  margin-top: 10px;
`

export const BusinessInfo = styled.div`
  display: flex;
  button {
    height: 25px;
    font-size: 10px;
    white-space: nowrap;
    line-height: 0;
    max-width: 80px;
  }
  @media (min-width: 380px){
    button{
      max-width: initial;
    }
  }
  @media (min-width: 480px){
    button {
      line-height: 30px;
      height: 44px;
      overflow: initial;
      font-size: 16px;
    }
  }
`

export const Metadata = styled.div`
  margin-top: 5px;
  display: flex;
  font-weight: 300;
  font-size: 10px;
  color: ${props => props.theme?.colors.darkGray};
  flex-wrap: wrap;
  ${({ isSkeleton }) => isSkeleton && css`
    display: flex;
    justify-content: space-between;
  `}
  p {
    color: ${props => props.theme?.colors.darkGray};
    svg {
      font-size: 7px;
      min-width: 6px;
      margin: 0 3px;
    }

    span {
      margin-right: 10px;
      ${props => props.theme?.rtl && css`
        margin-left: 10px;
        margin-right: 0;
      `}
    }
  }

  @media (min-width: 481px) {
    font-size: 14px;
  }
`

export const BusinessInfoItem = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  margin-left: 10px;
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
  @media (min-width: 480px) {
    width: 100%;
  }
`

export const SingleBusinessSearch = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`

export const BusinessProductsListContainer = styled.div`
  display: flex;
  box-sizing: border-box;

  .product-card {
    width: 270px;
    max-width: 270px;
  }

  @media(min-width: 480px){
    .product-card {
      width: 400px;
      max-width: 400px;
    }
  }
`

export const BusinessListWrapper = styled.div`
  width: 100%;

  ${({ fullWidth }) => !fullWidth && css`
    @media (min-width: 993px) {
      width: 45%;
      height: calc(100vh - 75px);
      height: calc(100dvh - 75px); /* dvh = visible viewport under mobile URL bars (vh fallback above) */
      overflow-y: auto;
    }
  `}
  ${({ hideProductList }) => !hideProductList && css`
    @media (min-width: 993px) {
      width: 100%;
      height: auto;
    }
  `}
  ${({ isShowMap }) => isShowMap && css`
    @media (min-width: 993px) {
      overflow-y: auto;
      height: calc(100vh - 75px);
      height: calc(100dvh - 75px);
      padding-right: 10px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: ${props => props.theme.colors.gray};
        border-radius: 4px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
    }
  `}
`

export const BusinessProductsListWrapper = styled(BusinessListWrapper)``

export const BusinessControllerSkeleton = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  > div {
    flex: 1;
  }
  @media (min-width: 681px){
    flex-direction: row;
    ${({ isShowMap }) => isShowMap && css`
      flex-direction: column;
    `}
  }
`

export const NotFoundWrapper = styled.div`
  padding-top: 50px;
`

const BusinessLogoStyled = styled.div`
  display: flex;
  width: 48px;
  height: 48px;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  min-height: 48px;
  border-radius: 7.6px;

  ${({ isSkeleton }) => isSkeleton && css`
    span {
      min-width: 45px;
      min-height: 45px;
      height: 45px;
      width: 45px;
      min-height: 45px;
    }
      @media (min-width: 681px){
        span {
          min-width: 75px;
          min-height: 75px;
          height: 75px;
          width: 75px;
          min-height: 75px;
      }
    }
  `}

  @media (min-width: 681px){
    min-width: 75px;
    min-height: 75px;
    height: 75px;
    width: 75px;
    min-height: 75px;
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

export const BusinessName = styled.h6`
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  margin-block-start: 0;
  margin-block-end: 0;
  color: ${props => props.theme.colors.darkTextColor};
  @media (min-width: 681px){
    font-size: 16px;
  }
`

export const BusinessesTitle = styled.h1`
  font-weight: 600;
  font-size: 24px;
  color: ${props => props.theme?.colors.headingColor};
  margin-bottom: 20px;
`

export const BrandContainer = styled.div`
  > h3 {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    margin-top: 0px;
    margin-bottom: 10px;
  }
`

export const BrandListWrapper = styled.div`
  max-height: 300px;
  overflow: auto;
`

export const BrandItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  }

  ${({ active }) => active && css`
    background: linear-gradient(135deg, ${props => props.theme.colors.lightGreen} 0%, ${props => props.theme.colors.lightGreen}dd 100%);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);

    span {
      color: ${props => props.theme.colors.darkGreen};
    }
  `}

  span {
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    transition: all 0.3s ease;
  }

  svg {
    color: ${props => props.theme.colors.darkGreen};
    font-size: 16px;
    transition: all 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`

export const NoResult = styled.div`
  text-align: center;
`

export const PriceFilterWrapper = styled.div``

export const PriceFilterListWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;

  > button {
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: 24px;

    svg {
      margin-left: 5px;
      font-size: 12px;
      ${props => props.theme.rtl && css`
        margin-right: 5px;
        margin-left: 0px;
      `}
    }
  }
`

export const PreviouslyOrderedContainer = styled.div`

`
export const SearchBarContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  align-items: flex-start;

  @media (min-width: 581px) {
    flex-direction: row;
  }

  .search-bar-business-listing {
    padding: 0 10px 15px;
    width: calc(100% - 20px);

    @media (min-width: 581px) {
      width: 100%;
      min-width: 100px;
      max-width: 300px;
      padding: 0;
    }
  }
`

export const HightestRatedWrapper = styled.div`
  padding: 0;
`

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  transition: all 0.3s ease;

  button {
    width: calc(100% - 40px);
    max-width: 430px;
    height: 55px;
    border-radius: ${props => props.theme.utils.radius.m}px;
    transition: all 0.3s ease;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(-1px);
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.12);
    }
  }

  p {
    cursor: pointer;
    color: ${props => props.theme.colors.black};
    transition: all 0.3s ease;
    padding: 8px 16px;
    border-radius: 8px;
    margin-top: 10px;

    &:hover {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      transform: translateY(-1px);
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
      color: ${props => props.theme?.colors?.primary || props.theme.colors.black};
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
    }
  }
`

export const Description = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.black};
  font-weight: 300;
  margin-bottom: 20px;
`

export const MapWrap = styled.div`
  width: 100%;
  padding: 0px;

  @media (min-width: 993px) {
    width: 55%;
    padding: 0px;
  }
`

export const MapWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  > div {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }

  @media (min-width: 993px) {
    width: 100%;
    height: calc(100vh - 75px);
    height: calc(100dvh - 75px);
    margin: 0;
    border-radius: 0;
    border-left: 1px solid ${props => props.theme.colors.gray200};
    box-shadow: none;
  }
`
