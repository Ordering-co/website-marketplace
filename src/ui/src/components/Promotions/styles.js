import React from 'react'
import styled, { css } from 'styled-components'

export const PromotionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
  transition: all 0.3s ease;

  > h1 {
    margin-top: 0px;
    transition: all 0.3s ease;
  }

  @media (min-width: 993px){
    width: 70%;
    padding: 0px;
  }

  @media (min-width: 1200px){
    > h1 {
      font-size: 36px;
    }
  }
`

export const PromotionTitle = styled.h1`
  align-self: flex-start;
  transition: all 0.3s ease;
`

export const OfferWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 140px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`

export const OfferDescriptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  button {
    height: 35px;
    font-size: 15px;
    font-weight: 600;
    min-width: fit-content;
    padding-left: 10px;
    padding-right: 10px;
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`

export const SingleOfferContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 2px dashed #E9ECEF;
  margin-bottom: 10px;
  transition: all 0.3s ease;

  p, h2 {
    margin: 0;
    transition: all 0.3s ease;
  }

  h2 {
    font-size: 16px;
  }

  p {
    font-size: 12px;
    font-weight: 400;
  }

  @media (min-width: 720px){
    button{
      font-size: 16px;
    }
  }

  @media (max-width: 424px) {
    flex-direction: column-reverse;
    height: auto;
    gap: 20px;

    button,
    #offer-wrap {
      width: 100%;
      max-width: 100%;
      justify-content: center;
    }
    #offer-info {
      width: calc(100% - 10px);
    }
  }
`

export const Description = styled.p`
  margin: 0;
  color: ${props => props.theme?.colors.gray200};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  transition: all 0.3s ease;
`

export const ExpiresAt = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  transition: all 0.3s ease;

  .or-while-stocks-last {
    font-weight: 400;
  }
`

export const OfferInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  transition: all 0.3s ease;
`

export const OfferInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  transition: all 0.3s ease;

  ${({ isSkeleton }) => isSkeleton && css`
    width: 100%;
  `}

  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  @media (min-width: 720px){
    width: 80%;
    h2 {
      font-size: 18px;
    }
  }
`

export const SearchBarContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  .search-bar {
    justify-content: flex-start;
    transition: all 0.3s ease;

    /* Layout-only override. The "Search promotion" field uses the canonical
       SearchBar look; focus/hover states are inherited from the base
       SearchBar (src/ui/src/components/SearchBar/styles.js). */
    input {
      width: 100%;
    }
  }

  .clear {
    right: 0;
    transition: all 0.3s ease;
  }
`

const BusinessLogoStyled = styled.div`
  width: 70px;
  height: 70px;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  min-height: 70px;
  border-radius: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  ${({ fromModal }) => fromModal && css`
    min-width: 115px;
    min-height: 115px;
    height: 115px;
    width: 115px;
    margin-bottom: 15px;
  `}

  @media (min-width: 481px){
    min-width: 75px;
    min-height: 75px;
    height: 75px;
    width: 75px;
    min-height: 75px;

    ${({ isCustomerMode }) => isCustomerMode && css`
      width: 100%;
      height: 100%;
    `}

    ${({ fromModal }) => fromModal && css`
      min-width: 115px;
      min-height: 115px;
      height: 115px;
      width: 115px;
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

export const SingleBusinessOffer = styled.div`
  display: flex;
  transition: all 0.3s ease;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  button{
    font-size: 12px;
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  @media (min-width: 720px){
    button{
      font-size: 16px;
    }
  }
`

export const AvailableBusinesses = styled.div`
  display: none;
  white-space: pre;
  width: 80%;
  transition: all 0.3s ease;

  p:nth-child(2){
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const OfferData = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  transition: all 0.3s ease;

  p {
    font-size: 15px;
    margin: 0px;
    transition: all 0.3s ease;
  }

  .offer-data-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    transition: all 0.3s ease;

    .description {
      font-size: 15px;
      margin: 0 0 10px;
      transition: all 0.3s ease;
    }

    .terms-and-conditions {
      font-weight: 600;
      transition: all 0.3s ease;
    }
  }

  .offer-data-content-info {
    width: auto;
    width: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    padding: 10px 20px;
    border-radius: 20px;
    background-color: ${({ theme }) => theme?.colors?.gray300};
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-1px);
    }

    p {
      font-size: 14px;
      transition: all 0.3s ease;
    }
  }
`

export const Code = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme?.colors?.gray300};
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  span {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  p{
    font-size: 16px;
    transition: all 0.3s ease;
  }
`

export const ValueOfOffer = styled.div`
  transition: all 0.3s ease;

  p{
    font-size: 16px;
    transition: all 0.3s ease;
  }

  span{
    font-size: 20px;
    transition: all 0.3s ease;
  }
`

export const BusinessInfo = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  transition: all 0.3s ease;

  button {
    height: 44px;
    min-width: max-content;
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  p {
    font-size: 12px;
    width: 50%;
    text-align: left;
    transition: all 0.3s ease;
  }

  @media(min-width: 720px){
    p{
      font-size: 16px;
      width: 70%;
    }
  }
`

export const OfferView = styled.div`
  margin-top: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;

  h2 {
    font-size: 16px;
    width: 100%;
    text-align: left;
    transition: all 0.3s ease;
  }

  @media(min-width: 720px){
    h2 {
      font-size: 20px;
    }
  }
`

export const OfferViewList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;

  button {
    font-size: 14px;
    transition: all 0.3s ease;
  }
`
