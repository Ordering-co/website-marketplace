import styled, { css } from 'styled-components'

export const ProductContainer = styled.div`
  max-height: 100vh;
  max-height: 100dvh; /* dvh = visible viewport under mobile URL bars (vh fallback above) */
  position: relative;
  padding: 0px 20px 20px;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    height: 100%;
  }

  @media (min-width: 769px) {
    padding: 0 20px 20px;
  }

  @media (min-width: 1200px) {
    flex-wrap: nowrap;
    padding-bottom: 0;
  }
`

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
 .favorite {
    cursor: pointer;
    transition: all 0.3s ease;Add commentMore actions

    &:hover {
      background: rgba(255, 99, 99, 0.1);
      transform: scale(1.1);
    }
    svg {
      color: ${props => props.theme.colors.danger500};
      display: flex;
      font-size: 20px;
      transition: all 0.3s ease;
    }
    &:hover svg {
      filter: brightness(1.1);
    }
  }
`

export const WrapperImage = styled.div`
  margin-left: -20px;
  width: calc(100% + 40px);
  position: relative;
`

export const SwiperWrapper = styled.div`
  position: relative;
  width: 100%;

  img {
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.02);
    }
    ${props => props.isSoldOut && css`
        filter: grayscale(1);
    `}
  }
  .mySwiper2 {
    height: 250px;
    width: 100%;

    /* on phones a fixed-height box + object-fit:cover crops ("zooms")
       any photo whose aspect ratio doesn't match. Show the whole image on
       mobile; desktop (>=576px) keeps the original cover crop. */
    @media (max-width: 575px) {
      .swiper-slide img {
        object-fit: contain;
      }
    }
    ${({ theme }) => theme?.business_view?.components?.products?.components?.layout?.type === 'starbucks' && css`
      height: 290px;
    `}
    .swiper-slide-active {
      border-radius: 0px;
      img {
        border-radius: 0px;
      }
    }

    @media (min-width: 480px){
      ${({ theme }) => theme?.business_view?.components?.products?.components?.layout?.type === 'starbucks' && css`
        height: 340px;
      `}
    }

    @media (min-width: 576px) {
      height: 500px;
      ${({ theme }) => theme?.business_view?.components?.products?.components?.layout?.type === 'starbucks' && css`
        height: 60vw;
      `}
    }
    ${({ theme }) => theme?.business_view?.components?.products?.components?.layout?.type === 'starbucks' && css`
      @media (min-width: 768px) {
        height: 40vw;
      }
      @media (min-width: 993px) {
        height: 30vw;
      }
      @media (min-width: 1024px){
        height: 350px !important;
      }
      @media (min-width: 1200px) {
        height: 300px !important;
        width: 300px !important;
      }
    `}
  }


  .swiper {
    width: 100%;
    max-height: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .swiper-slide {
    background-size: cover;
    background-position: center;
    .active-img {
      ${({ theme }) => theme?.business_view?.components?.products?.components?.layout?.type === 'starbucks' && css`
      `}
    }
  }

  .product-thumb {
    box-sizing: border-box;
    padding: 30px 0px;
    margin: 0px 20px;

    .swiper-slide {
      display: flex;
      opacity: 0.8;
      border-radius: 7.6px;
      height: auto;
      cursor: pointer;
      overflow: hidden;

      img {
        border-radius: 7.6px;
        max-height: 70px;
        ${({ theme }) => theme?.business_view?.components?.products?.components?.layout?.type === 'starbucks' && css`
          max-width: 80px;
          max-height: 80px;
        `}
      }
    }

    .swiper-slide-thumb-active {
      opacity: 1;
    }
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    ${({ theme }) => theme?.business_view?.components?.products?.components?.layout?.type === 'starbucks' && css`
      border-radius: 50% !important;
    `}
  }

  .active-img {
    ${({ theme }) => theme?.business_view?.components?.products?.components?.layout?.type === 'starbucks' && css`
      height: 60vw !important;
      width: 60vw !important;
      margin: 0 auto;
      @media (min-width: 768px) {
        height: 40vw !important;
        width: 40vw !important;
      }
      @media (min-width: 993px) {
        height: 30vw !important;
        width: 30vw !important;
      }
      @media (min-width: 1024px) {
        height: 350px !important;
        width: 350px !important;
      }
      @media (min-width: 1200px) {
        height: 300px !important;
        width: 300px !important;
      }
    `}
  }

  .swiper-button-next {
    background-image: url(${props => props.theme.images.general.rightArrow});
    background-color: #d1d0d04d;
    background-repeat: no-repeat;
    background-position: 55% center;
    width: 32px;
    height: 32px;
    box-shadow: rgb(0 0 0 / 7%) 0px 4px 10px;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .swiper-button-prev {
    background-image: url(${props => props.theme.images.general.leftArrow});
    background-color: #d1d0d04d;
    background-repeat: no-repeat;
    background-position: 45% center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    box-shadow: rgb(0 0 0 / 7%) 0px 4px 10px;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .swiper-button-next::after, .swiper-button-prev::after {
    display: none;
  }
`

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0px;
  /* position: relative; */
  ${({ noImage }) => noImage && css`
    padding-top: 50px;
  `}
`

export const ProductFormTitle = styled.div`
  overflow-wrap: break-word;

  .price-discount {
    text-decoration: line-through;
  }
`

export const ProductEdition = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
`

export const SectionTitle = styled.h3`
  text-transform: capitalize;
  font-weight: 600;
  font-size: 22px;
  line-height: 24px;
  padding: 7px 0px;
  margin-bottom: 10px;
  margin-top: 10px;
  color: ${props => props.theme.colors.headingColor};
`

export const ProductComment = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;

  textarea {
    margin-top: 8px;
    height: 130px;
  }

  p {
    font-weight: 300;
    margin-bottom: 5px;
  }

  @media (min-width: 577px) {
    margin-bottom: 62px;
  }

  @media (min-width: 769px) {
    margin-bottom: 0px;
    padding-bottom: 10px;
  }
`

export const ProductActions = styled.div`
  display: flex;
  min-height: 82px;
  flex-direction: column;
  align-items: center;
  padding: 10px 0px;
  width: 100%;
  z-index: 9999997;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  input.qty {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  position: sticky;
  width: calc(100% + 40px);
  transform: translateX(-20px);
  bottom: 0;
  background-color: ${(props) => props.theme?.colors?.backgroundPage};

  div.price {
    padding-top: 10px;
    color: ${props => props.theme?.colors.darkTextColor};
    h4 {
      margin: 0;
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
    }
    span {
      font-size: 13px;
      color: #D83520;
      line-height: 15px;
    }
  }

  div.incdec-control {
    width: 180px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);
    border-radius: 30px;
    padding: 10px 20px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    svg {
      width: 25px;
      height: 25px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    .green-icon {
      color: ${props => props.theme.colors.primary};
    }

    @media (min-width: 577px) {
      width: 195px;
    }
  }

  div.price-amount-block {
    display: flex;
    justify-content: ${({ center }) => center ? 'center' : 'space-between'};
    width: 80%;

    @media (min-width: 1200px) {
      justify-content: space-between;
    }
  }

  svg {
    color: ${props => props.theme.colors.primary};
  }

  svg.disabled {
    pointer-events: none;
    color: #CED4DA;
  }

  button:disabled,
  button.disabled {
    background: #E9ECEF;
    border: 1px solid #E9ECEF;
    color: ${props => props.theme.colors.lightGray};
  }

  button.add {
    height: 60px;
    width: 90%;
    padding: 5px 10px;
    margin-top: 10px;
    position: relative;
    border-radius: 30px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &.soldout {
      width: 100%;
      pointer-events: none;
    }
  }
  .qty {
    flex: 1;
    text-align: center;
    display: flex;
    align-items: center;
    height: 38px;
    max-width: 70px;
    min-width: 60px;
    box-sizing: border-box;
    padding: 0;
    margin: 0 10px;
    border-width: 0px;
    font-size: 30px;
    font-weight: 500;
  }

  #address_control {
    button.add {
      width: calc(100% - 20px) !important;
    }
  }

  div#address_list {
    padding: 0;
  }

  div.add-address-button {
    padding-top: 10px;
  }

  @media (min-width: 1200px) {
    bottom: 0px;
    flex-direction: row;
    justify-content: space-between;
    border-top: 1px solid #E9ECEF;
    padding: 10px 20px;
    box-sizing: border-box;

    ${({ isColumn }) => isColumn && css`
      flex-direction: column;
      div.price-amount-block {
        margin-bottom: 15px;
      }
    `}

    div.price {
      width: 25%;
    }

    button.add {
      width: 50%;
      margin-top: 0;
    }

    div.incdec-control {
      margin-right: 18%;
      &.show-weight-unit{
        width: 40%;
      }
    }

    div.add-address-button {
      padding-top: 0;
      width: 100%;
      margin: 0 auto;
      max-width: 300px;
    }
  }
`
export const SkeletonBlock = styled.div`
  width: ${({ width }) => width && `${width}%`};
  border-radius: 16px;
  margin: auto;

  span {
    margin-bottom: 10px;
  }
`

export const WrapperSubOption = styled.div`
  border-radius: 10px;

  &.soldout {
    pointer-events: none;
    background-color: hsl(0, 0%, 72%);
  }
`

export const SkuContent = styled.div`
  display: flex;
`

export const WrapperIngredients = styled.div`
  ${({ isProductSoldout }) => isProductSoldout && css`
    border-radius: 10px;
    pointer-events: none;
    background: hsl(0, 0%, 72%);
  `}
`

export const ProductTabContainer = styled.div`
  position: sticky;
  top: 0px;
  background: white;
  z-index: 9999996;
  overflow: scroll hidden;
  width: 100%;
  ::-webkit-scrollbar {
    height: 0px;
  }

  #optionList {
    > div {
      white-space: nowrap;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 10px 0px;
      margin-right: 25px;
      ${props => props.theme.rtl && css`
        margin-right: 0px;
        margin-left: 25px;
      `}
    }
  }
`

export const Divider = styled.div`
  height: 7px;
  background: #E9ECEF;
`

export const ProductShareWrapper = styled.div`
  position: fixed;
  top: 17px;
  right: 20px;
  z-index: 999999;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > div {
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.05) translateY(-1px);
    }
    > svg {
      margin: 0px !important;
      transition: all 0.3s ease;
    }
  }

  .favorite {
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.1) translateY(-1px);
    }
    svg {
      display: flex;
      font-size: 20px;
      padding: 9px 7px 6px;
      background: white;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    svg.red {
      color: ${props => props.theme.colors.danger500};
    }
  }

  @media (max-width: 449px) {
    flex-direction: row;
    gap: 8px;
    margin-top: 2px;

    > div {
      margin: 0;
    }

    .favorite svg {
      box-sizing: border-box;
      width: 35px;
      height: 35px;
    }
  }

  @media (min-width: 450px) {
    position: absolute;
  }

  /* @media (max-width: 768px) {
    > div {
      right: 20px;
      top: 10px;
      left: auto;
    }
  } */
`
export const ProductName = styled.h1`
  font-size: 20px;
  line-height: 30px;
  color: #344050;
  display: flex;
  justify-content: space-between;
  margin: 0;
  .calories {
    font-size: 16px;
    font-weight: 100;
    color: ${props => props.theme?.colors.darkGray};
    white-space: nowrap;
    display: flex;
    align-items: flex-end;
  }
  @media (min-width: 768px) {
    font-size: 24px;
    line-height: 34px;
  }
`
export const Properties = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`
export const ProductDescription = styled.p`
  margin-top: 5px;
  margin-bottom: 5px;
  white-space: pre-wrap;
  color: ${props => props.theme?.colors.darkGray};
  font-size: 18px;
`
export const PriceContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  > p {
    font-size: 18px;
    line-height: 27px;
    color: #344050;
    margin: 0;
    font-weight: 700;
  }
  .offer-price {
    text-decoration: line-through;
    font-size: 16px;
    color: ${props => props.theme?.colors.darkGray};
  }
`
export const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  span {
    font-size: 16px;
    line-height: 24px;
    color: ${props => props.theme?.colors.darkGray};
  }
`
export const EstimatedPersons = styled.div`
  display: flex;
`
export const ProductTagsListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
`
export const ProductTagWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;

  img {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  }

  span {
    font-size: 14px;
    ${props => props.theme?.rtl
? css`
      margin: 0 10px 0 20px;
    `
: css`
      margin: 0 20px 0 10px;
    `}
  }
`
export const WeightUnitSwitch = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  margin-left: 10px;

  ${props => props.theme?.rtl && css`
    margin-right: 10px;
    margin-left: 0;
 `}
`
export const WeightUnitItem = styled.span`
  display: inline-flex;
  width: fit-content;
  min-width: unset !important;
  font-size: 12px;
  line-height: 18px;
  padding: 2px 6px;
  cursor: pointer;

  ${({ active }) => active && css`
    background-color: ${props => props.theme.colors.primary}15;
    border-radius: 3px;
    color: ${props => props.theme.colors.primary};
  `}
`
export const VideoGalleryWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  svg {
    position: absolute;
    fill: #fff;
    font-size: 28px;
  }
`

export const GuestUserLink = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  cursor: ${props => props.$loading ? 'default' : 'pointer'};
  margin: 15px 10px;
  white-space: nowrap;
  opacity: ${props => props.$loading ? 0.7 : 1};
  pointer-events: ${props => props.$loading ? 'none' : 'auto'};
  &:hover {
    text-decoration: ${props => props.$loading ? 'none' : 'underline'};
  }
  ${props => props.theme.rtl && css`
    margin-left: 0;
    margin-right: 10px;
  `}
`

export const LoadingWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`
