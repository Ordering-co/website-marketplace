import React from 'react'
import styled, { css } from 'styled-components'
import { rgba } from 'polished'

export const MessagesListingContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  margin: 0px auto;
  max-width: 85%;
  transition: all 0.3s ease;

  @media (min-width: 1024px) {
    flex-direction: row;
    height: calc(100vh - 105px);
  }
`
export const OrderListItems = styled.div`
  height: 100%;
  margin-top: 20px;
  overflow: hidden;
  transition: all 0.3s ease;

  @media (min-width: 1024px) {
    margin-top: 0px;
  }

  @media (min-width: 1300px){
    max-width: 570px;
    width: 570px;
  }
`
export const MessageContainer = styled.div`
  overflow: hidden;
  margin-top: 20px;
  transition: all 0.3s ease;

  @media (min-width: 1024px) {
    margin-top: 0px;
    height: 100%;
    flex: 1 1 0%;
  }
`
export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  padding: 10px;
  box-sizing: border-box;
  transition: all 0.3s ease;
`
export const OrdersOrderByOptionContainer = styled.div`
  display: flex;
  overflow-x: auto;
  transition: all 0.3s ease;
`
export const InnerTabsContainer = styled.div`
  display: flex;
  transition: all 0.3s ease;

  button {
    font-size: 13px;
    white-space: nowrap;
    padding: 4px 10px;
    line-height: 14px;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }

    ${props => props.theme?.rtl
? css`
      margin-left: 5px;
    `
: css`
      margin-right: 5px;
    `}
  }
`
export const Title = styled.h1`
  margin: 0 5px;
  font-size: 30px;
  font-weight: 700;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    font-size: 36px;
  }
`
export const OrderListContainer = styled.div`
  height: calc(100% - 63px);
  transition: all 0.3s ease;
`
export const OrdersListContainer = styled.div`
  height: 100%;
  padding: 15px 15px 0px 15px;
  box-sizing: border-box;
  overflow-x: hidden;
  transition: all 0.3s ease;
`

export const OrderCard = styled.div`
  font-family: ${props => props.theme?.fonts?.special?.name};
  min-height: 70px;
  max-width: 405px;
  display: flex;
  gap: 20px;
  position: relative;
  cursor: pointer;
  border-radius: 15px;
  border: 1px solid #E9ECEF;
  margin-bottom: 20px;
  padding: 15px 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    border: 1px solid ${props => props.theme.colors.primary};
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  ${({ active }) => active && css`
    border: 1px solid ${props => props.theme.colors.primary};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  `}

  p,
  h2 {
    color: ${props => props.theme.colors.headingColor};
    margin: 0px;
    transition: all 0.3s ease;
  }

  h2 {
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .order-type-status {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    transition: all 0.3s ease;

    p {
      color: ${props => props.theme.colors.black};
      transition: all 0.3s ease;
    }
    .green {
      color: ${props => props.theme.colors.primary};
      transition: all 0.3s ease;
    }
    button {
      max-width: 150px;
      min-height: 32px;
      padding: 4px 10px;
      font-size: ${props => props.theme?.utils?.tsize?.xs}px;
      border-radius: ${props => props.theme?.utils?.radius?.s}px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .order-header-left {
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  }

  .order-header-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s ease;
  }
`

export const OrderHeader = styled.div`
  transition: all 0.3s ease;

  > div {
    display: flex;
    margin: 5px 0 10px;
    transition: all 0.3s ease;
  }

  > p {
    margin-top: 5px;
    color: ${props => props.theme.colors.darkGray};
    transition: all 0.3s ease;
  }
`
export const ViewDetails = styled.a`
  cursor: pointer;
  color: ${props => props.theme.colors.primary};
  font-size: 12px;
  transition: all 0.3s ease;

  &:hover {
    text-decoration: underline;
    transform: translateX(2px);
  }
  margin: 0 10px;
`

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  @media (min-width: 1300px) {
    flex-direction: row;
  }
`
export const BusinessInfo = styled.div`
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 125px;
    transition: all 0.3s ease;
  }
  display: flex;
  align-items: center;

  div.info {
    ${props => props.theme?.rtl
? css`
      margin-right: 10px;
    `
: css`
      margin-left: 10px;
    `}
    p {
      margin: 0px;
      color: ${props => props.theme.colors?.headingColor};
      font-size: 12px;
      transition: all 0.3s ease;
    }
    p.bold {
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
  }
  @media (min-width: 1300px) {
    width: 45%;
  }
`
export const WrapperImage = styled.div`
  max-width: 45px;
  max-height: 45px;
  height: 45px;
  width: 45px;
  transition: all 0.3s ease;
  ${({ isSkeleton }) => !isSkeleton && css`
    border: 1px solid #E3E3E3;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  `}
  ${({ hideContent }) => hideContent && css`
    max-width: 70px;
    max-height: 70px;
    height: 70px;
    width: 70px;
  `}
  svg {
    width: 100%;
    height: 100%;
    padding: 7px;
    box-sizing: border-box;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`
export const UnreadMessageCounter = styled.div`
  position: absolute;
  top: 12px;
  ${props => props.theme?.rtl
? css`
    left: 20px;
  `
: css`
    right: 20px;
  `}
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => rgba(props.theme.colors.primary, 0.12)};
  border-radius: 10px;
  font-size: ${props => props.theme?.utils?.tsize?.s}px;
  font-weight: 600;
  height: 30px;
  color: ${props => props.theme.colors.primary};
  padding: 3px 15px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`
const ImageStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`
export const Image = (props) => {
  return (
    <ImageStyled
      {...props}
      style={{ backgroundImage: `url(${props.bgimage})` }}
    >
      {props.children}
    </ImageStyled>
  )
}

export const DriverSelectorWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin-top: 10px;
  transition: all 0.3s ease;
  > div {
    > div:first-child {
      border: none;
      padding: 0px;
      transition: all 0.3s ease;
      > div:first-child {
        padding: 0px;
        transition: all 0.3s ease;
      }
    }
  }

  @media (min-width: 1300px) {
    width: 55%;
    margin-top: 0px;
    ${props => props.theme?.rtl
? css`
      border-right: 1px solid ${props => props.theme.colors?.secundary};
      padding-right: 15px;
    `
: css`
      border-left: 1px solid ${props => props.theme.colors?.secundary};
      padding-left: 15px;
    `}
  }
`
export const LoadMoreButtonWrap = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  transition: all 0.3s ease;

   button {
     width: 100%;
     padding: 5px;
     background: ${props => props.theme.colors?.primary} !important;
     color: #fff;
     transition: all 0.3s ease;
     border-radius: 8px;

     &:hover {
       transform: translateY(-2px);
       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
       color: #fff !important;
     }
   }
`

export const DriverInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  transition: all 0.3s ease;

  @media (min-width: 1300px) {
    margin-top: 0px;
  }
`

export const OptionContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
   margin-left: 10px;
   transition: all 0.3s ease;

`
export const DriverNameContainer = styled.div`
  line-height: 1.3;
  color: #263238;
  transition: all 0.3s ease;

  ${({ small }) => small && css`
    font-size: 8px;
  `}
`

export const DriverName = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${props => props.theme.colors.headingColor};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 150px;
  margin: 0px;
  transition: all 0.3s ease;

  ${({ small }) => small && css`
    font-size: 11px;
  `}

  @media (max-width: 576px) {
    max-width: 90px;
  }
`
export const DriverText = styled.span`
  font-size: 12px;
  transition: all 0.3s ease;

  ${({ small }) => small && css`
    font-size: 8px;
  `}
`

export const NotFoundSourceWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  height: 100%;
  transition: all 0.3s ease;

`
