import React from 'react'
import styled, { css } from 'styled-components'
import { rgba } from 'polished'

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px 0 20px;
  transition: all 0.3s ease;
`

export const WrapperContainer = styled.div`
  width: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  min-height: auto;
  position: relative;
  transition: all 0.3s ease;

  ${({ orderCompleted }) => orderCompleted && css`
    max-width: 580px;
    > div:nth-child(2) {
      padding: 0px 20px 0;
    }
    .order-info {
      margin-bottom: 0px;
    }
    .order-details {
      h1 {
        margin: 0px;
        font-size: 36px;
        font-weight: 700;
      }
    }
  `}

  @media (min-width: 993px) {
    width: 100%;
    padding: ${({ orderCompleted }) => !orderCompleted ? '0px 30px 0px' : '0px 0px 0px'};
    min-height: calc(100vh - 337px);
    box-sizing: border-box;
    max-width: ${({ orderCompleted }) => orderCompleted ? '700px' : '1500px'};
  }
`

export const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

export const HeaderInfo = styled.div`
  width: 80%;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  h1, p {
    margin: 0;
    color: ${props => props.theme.colors.darkTextColor};
    transition: all 0.3s ease;
  }

  h1 {
    margin-bottom: 22px;
  }

  &:hover {
    transform: translateY(-1px);
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  transition: all 0.3s ease;
`

export const OrderBusiness = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  border-radius: ${(props) => props?.theme?.utils?.radius.m}px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 10px 0px #0000001F;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  }

  @media (min-width: 769px) {
    flex-direction: row;
  }
`

export const BusinessWrapper = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  transition: all 0.3s ease;

  ${props => props.borderBottom && css`
    padding-bottom: 15px;
    border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  `}
  ${props => props.borderTop && css`
    margin-top: 15px;
    border-top: 1px solid ${props => props.theme.colors.lightGray};
  `}
  img {
    width: 100px;
    height: 100px;
    border-radius: ${(props) => props?.theme?.utils?.radius.m}px;
    margin-right: 0;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (min-width: 400px) {
      margin-right: 25px;
    }
  }

  @media (min-width: 400px) {
    width: ${props => props.w ?? '100%'};
  }
`

export const BtsOrderStatus = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  transition: all 0.3s ease;

  div + div {
    margin-left: 0;
    margin-top: 10px;
  }
  @media (min-width: 400px) {
    flex-direction: row;
    div + div {
      margin-left: 30px;
      margin-top: 0px;
    }
  }
`

export const BusinessInfo = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin-right: 0;
  margin-top: 10px;
  transition: all 0.3s ease;

  h1,
  p {
    margin: 0;
    color: ${props => props.theme.colors.darkTextColor};
    overflow-wrap: anywhere;
    transition: all 0.3s ease;
  }

  h2 {
    font-weight: 600;
    font-size: 18px;
    margin: 0px 0px 5px 0px;
    transition: all 0.3s ease;
  }
  p {
    font-size: 14px;
    margin-bottom: 5px;
  }

  &:hover {
    transform: translateY(-1px);
  }
`

export const ActionsBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 5vw;
  transition: all 0.3s ease;

  > * {
    margin-right: 5px;
    transition: all 0.3s ease;
    ${props => props.theme?.rtl && css`
      margin-left: 5px;
      margin-right: 0px;
  `}
  }

  svg {
    font-size: ${(props) => props.theme?.utils?.tsize?.m}px;
    cursor: pointer;
    color: ${props => props.theme.colors.lightGray};
    transition: all 0.3s ease;

    &:hover {
      color: ${(props) => props.theme.colors.primary};
      transform: scale(1.1);
    }
  }

  .business-icon {
    background-color: white;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.12);
    width: 45px;
    height: 45px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    margin-right: 10px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.2);
    }

    svg {
      font-size: 32px;
      fill: #000;
      transition: all 0.3s ease;
    }
  }

  ${props => props.actionType === 'business' && css`
    margin-left: 0;
    width: 100%;
  `}

  @media (min-width: 380px) {
    svg {
      font-size: ${(props) => props.theme?.utils?.tsize?.m}px;
    }
  }
`

export const OrderInfo = styled.div`
  margin: 0px;
  position: relative;
  background-color: ${props => props.theme.colors.gray300};
  border-radius: 20px;
  padding: 10px 20px 0;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  .order-id {
    margin-top: 10px;
    text-align: center;
  }

  h1, p {
    margin: 0px;
    color: ${props => props.theme.colors.darkTextColor};
    transition: all 0.3s ease;
  }
  h1 {
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 32px;
  }
  p {
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .order-progress {
    margin: 0px 0 0px;
    padding: 10px 0 0px;
    font-size: 32px;
    font-weight: 700;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    transition: all 0.3s ease;

    span {
      font-size: 32px;
      font-weight: 700;
      transition: all 0.3s ease;
    }

    .life-saver-icon {
      cursor: pointer;
      margin-top: 10px;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;

      .life-saver-icon {
        margin-top: 0px;
      }
    }
  }
  .date {
    margin-bottom: 20px;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  .types {
    margin-bottom: 6px;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  .order-status {
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  #error-subs {
    margin: 20px 0 0;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }

  @media (min-width: 768px) {
    padding: 10px 30px 0px;
    #error-subs {
      margin: 20px 0;
    }
  }
`

export const ValidationText = styled.div`
  color: ${props => props.theme.colors.danger500};
  transition: all 0.3s ease;
  ${props => props.onlyText
? css`
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
  `
: css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme.colors.danger500};
    background-color: ${props => props.theme.colors.danger100};
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
    }

    ${props => props.mb && css`
      margin-bottom: ${props.mb};
    `}

    ${props => props.color && css`
      svg {
        font-size: 21px;
      }
    `}

    svg {
      width: 5%;
      transition: all 0.3s ease;
    }

    span {
      margin: 0 0 0 5px;
      padding: 0;
      font-size: 14px;
      color: ${props => props.theme.colors.headingColor};
      transition: all 0.3s ease;
    }
  `}
`

export const OrderIdSec = styled.h1`
  font-size: 25px !important;
  transition: all 0.3s ease;
  @media (min-width: 350px) {
    font-size: 32px !important;
  }
`
export const ReviewOrderLink = styled.span`
  margin: 0;
  cursor: pointer;
  text-decoration-line: underline;
  user-select: none;
  transition: all 0.3s ease;
  ${({ active }) => active
? css`
    color: ${props => props.theme?.colors.primary};

    &:hover {
      transform: translateY(-1px);
    }
  `
: css`
    color: ${props => props.theme.colors.lightGray};
    cursor: not-allowed;
    span {
      pointer-events: none;
    }
  `}
  ${({ isMargin }) => isMargin && css`
    margin: 0 10px 0 0;
  `}
`

const StatusBarStyled = styled.div`
  height: 20px;
  border-radius: ${props => props.theme?.utils?.radius?.m}px;
  margin: 18px 0px 8px;
  background: ${props => `linear-gradient(to right, ${props.theme.colors.primary} ${props.percentage}%, ${rgba(props.theme.colors.primary, 0.2)} ${props.percentage}%)`};
  transition: all 0.3s ease;
  ${props => props.theme?.rtl && css`
    background: linear-gradient(to left, ${props.theme.colors.primary} ${props.percentage}%, ${rgba(props.theme.colors.primary, 0.2)} ${props.percentage}%);
  `}
`

export const StatusBar = (props) => {
  return (
    <StatusBarStyled {...props}>
      {props.children}
    </StatusBarStyled>
  )
}

export const SectionTitle = styled.h1`
  margin: 20px 0 0 0;
  font-size: ${(props) => props.theme?.utils?.tsize?.m}px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
`

export const SectionTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  h2 {
    font-size: ${(props) => props.theme?.utils?.tsize?.m}px;
    font-weight: 500;
    margin: 0px 0px 5px 0px;
    transition: all 0.3s ease;
  }
`

export const OrderCustomer = styled(BusinessInfo)`
  display: flex;
  flex-direction: column;
  padding: 20px 0 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
`

export const PhotoBlock = styled.img`
  border-radius: 10px;
  width: 100px;
  height: 100px;
  margin-right: 25px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

export const Map = styled.div`
  margin-bottom: 10px;
  width: 100%;
  height: 300px;
  transition: all 0.3s ease;
  > div {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: ${(props) => props?.theme?.utils?.radius.m}px;
    transition: all 0.3s ease;
  }

  #google-maps-image {
    object-fit: cover;
    border-radius: ${(props) => props?.theme?.utils?.radius.m}px;
    transition: all 0.3s ease;
  }

  &:hover {
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

export const OrderDriver = styled(OrderCustomer)`
  margin-top: 0px;
  transition: all 0.3s ease;

  ${({ orderCompleted }) => orderCompleted && css`
    padding-top: 0px;
  `}
`

export const WrapperDriver = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  transition: all 0.3s ease;

  div.photo {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    img {
      max-width: ${({ orderCompleted }) => orderCompleted ? '44px' : '65px'};
      max-height: ${({ orderCompleted }) => orderCompleted ? '44px' : '65px'};
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    svg {
      width: 48px;
      height: 48px;
      margin-right: 10px;
      transition: all 0.3s ease;
      ${props => props.theme?.rtl && css`
        margin-left: 10px;
        margin-right: 0;
      `}

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .driver-info {
    p {
      font-size: ${(props) => props.theme?.utils?.tsize?.s}px;
      transition: all 0.3s ease;
    }
  }

  .driver-name-wrapper {
    display: flex;
    transition: all 0.3s ease;
    h2 {
      @media (min-width: 400px) {
        margin-bottom: 0;
        margin-right: 25px;
      }
    }
  }

  &:hover {
    transform: translateY(-1px);
  }
`

export const OrderProducts = styled(OrderCustomer)`
  flex-direction: column;
  transition: all 0.3s ease;

  ${({ orderCompleted }) => orderCompleted && css`
    border-width: 0px;
    padding: 0px 0 20px;
    margin-top: 30px;

    .quantity-item {
      font-size: 20px;
    }
    .product-name {
      padding-left: 10px;
      h3 {
        font-size: 16px;
        font-weight: 600;
        -webkit-line-clamp: none;
      }
    }
    .accordion-product-options {
      padding-left: 20px;
      width: auto;
      margin: 0px;
    }
  `}
`

export const OrderButtons = styled(OrderCustomer)`
  padding: 20px 0 10px;
  transition: all 0.3s ease;

  h3 {
    font-size: 18px;
    margin: 0 0 10px;
    border-top: 1px solid #E9ECEF;
    padding-top: 20px;
    transition: all 0.3s ease;
  }
  .review-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;
  }
  .buttons-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: all 0.3s ease;
  }
  .one-button {
    flex-direction: row;
    justify-content: center;
  }
  button {
    height: 40px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`

export const OrderBill = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
  margin-top: 10px;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.gray300};
  padding: 20px 25px 20px 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  table {
    width: 100%;
    font-size: 14px;
    font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
    transition: all 0.3s ease;

    td {
      padding-bottom: ${({ orderCompleted }) => orderCompleted ? '10px' : '20px'};
      transition: all 0.3s ease;
    }

    td span {
      unicode-bidi: bidi-override;
      transition: all 0.3s ease;
    }
    tr td:nth-child(2) {
      text-align: right;
      ${props => props.theme?.rtl && css`
        text-align: left;
      `}
    }

    .subtotal {
      td {
        font-weight: 500;
      }
    }

    .icon {
      display: flex;
      align-items: center;
      overflow: visible;
    }
  }

  table.total {
    border-top: 1px solid #BFBFBF;
    margin-top: 15px;
    padding-top: 15px;
    transition: all 0.3s ease;

    tr {
      font-size: 14px;
      transition: all 0.3s ease;
      td:nth-child(1) {
        font-weight: 600;
        font-size: ${(props) => props.theme?.utils?.tsize?.m}px;
        padding-top: 10px;
        transition: all 0.3s ease;
      }
      td:nth-child(2) {
        font-weight: 600;
        font-size: ${(props) => props.theme?.utils?.tsize?.m}px;
        padding-top: 10px;
        transition: all 0.3s ease;
      }
    }
  }

  table.comments {
    margin-top: 20px;
    align-items: center;
    transition: all 0.3s ease;
    tr {
      td:nth-child(1) {
        font-weight: bold;
        transition: all 0.3s ease;
      }
    }
  }

  .driver {
    padding: 10px 0;
    transition: all 0.3s ease;
  }

  @media (min-width: 678px) {
    table {
      font-size: 18px;
    }
  }
`

export const SkeletonBlock = styled.div`
  width: ${({ width }) => width && `${width}%`};
  border-radius: 16px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
`

export const SkeletonBlockWrapp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  line-height: 40px;
  transition: all 0.3s ease;
`

export const ShareOrder = styled.div`
  display: flex;
  margin: 0 0 20px;
  justify-content: space-between;
  z-index: 1;
  transition: all 0.3s ease;

  div.wrap {
    & > div:first-child {
      left: 0;
    }
    button {
      border-radius: ${(props) => props?.theme?.utils?.radius.m}px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }

  h1 {
    font-size: 15px;
    margin: 0px;
    transition: all 0.3s ease;
  }

  p {
    font-size: 13px;
    margin: 0px;
    transition: all 0.3s ease;
  }

  button {
    display: flex;
    justify-content: center;
    position: relative;
    font-size: 14px;
    align-items: center;
    background: ${props => props.theme.colors.backgroundPage};
    transition: all 0.3s ease;

    svg {
      left: 0;
      margin-right: 6px;
      color: ${props => props.theme.colors.primary};
      transition: all 0.3s ease;
    }

    &:hover {
      svg {
        color: #FFFFFF;
        transform: scale(1.1);
      }
    }
  }

  div.text {
    width: 60%;
    transition: all 0.3s ease;
  }

  div.wrap {
    display: flex;
    align-items: center;
    transition: all 0.3s ease;

    & > div:first-child {
      width: 100%;
      position: relative;
      div {
        right: 0px;
        left: initial;
        top: 35px;
      }
    }
  }

  @media (min-width: 1201px) {
    div.wrap {
      & > div:first-child {
        left: 0;
      }
    }
  }

  @media (min-width: 768px) {
    div.wrap {
      width: 30%;
      & > div:first-child {
        left: 0;
      }
    }

    h1 {
      font-size: ${(props) => props.theme?.utils?.tsize?.m}px;
    }

    p {
      font-size: 18px;
    }

    button {
      font-size: 18px;
      width: 100%;
      svg {
        position: absolute;
        margin-left: 10px;
      }
    }
  }

  @media (min-width: 425px) {
    div.text {
      width: 70%;
    }

    h1 {
      font-size: 18px;
    }

    p {
      font-size: 15px;
    }
  }
`

export const MessagesIcon = styled.span`
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`

export const ExclamationWrapper = styled.div`
  position: absolute;
  transform: translate(75%, -25%);
  transition: all 0.3s ease;
  svg{
    font-size: 16px;
    color: ${props => props.theme?.colors?.primary};
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`

export const WrapperLeftContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0px 0px 0px;
  transition: all 0.3s ease;

  .map-container {
    display: flex;
    justify-content: center;
    transition: all 0.3s ease;
  }
`

export const WrapperRightContainer = styled(WrapperLeftContainer)`
  transition: all 0.3s ease;
  ${({ orderCompleted }) => orderCompleted && css`
    .order-progress {
      font-size: ${(props) => props.theme?.utils?.tsize?.s}px;
      font-weight: 800;
    }
  `}
`

export const Divider = styled.div`
  background: #E9ECEF;
  height: 5px;
  transition: all 0.3s ease;
  ${({ margin }) => margin && css`
    margin: ${margin};
  `}
`

export const MyOrderActions = styled.div`
  transition: all 0.3s ease;
`

export const ReviewWrapper = styled.div`
  transition: all 0.3s ease;
`

export const Exclamation = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
  margin-left: 5px;
  top: 3px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`

export const CommentContainer = styled.div`
  margin: 20px 0;
  transition: all 0.3s ease;

  h3 {
    font-weight: 800;
    font-size: ${(props) => props.theme?.utils?.tsize?.xs}px;
    margin: 0 0 10px;
    transition: all 0.3s ease;
  }
  span {
    font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
    font-size: ${(props) => props.theme?.utils?.tsize?.s}px;
    font-weight: 400;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-1px);
  }
`
export const NewOrder = styled.div`
  transition: all 0.3s ease;
  button {
    width: 160px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`
export const OrderActions = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  transition: all 0.3s ease;
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: auto;
  transition: all 0.3s ease;

  button {
    display: flex;
    align-items: center;
    font-size: 14px;
    justify-content: space-around;
    min-width: 200px;
    max-height: 53px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  > h1 {
    text-align: center;
    transition: all 0.3s ease;
  }

  .delivery-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;

    .date {
      font-size: 18px;
      font-weight: 400;
      transition: all 0.3s ease;
    }

    .types {
      font-size: ${(props) => props.theme?.utils?.tsize?.m}px;
      margin-bottom: 15px;
      transition: all 0.3s ease;
    }

    ${({ orderCompleted }) => orderCompleted && css`
      align-items: center;
      .business-logo {
        img {
          width: 44px;
          height: 44px;
          border-radius: 15px;
          transition: all 0.3s ease;

          &:hover {
            transform: scale(1.1);
          }
        }
      }
      .business-info {
        display: flex;
        align-items: flex-start;
        padding: 20px 0px;
        gap: 10px;
        transition: all 0.3s ease;
      }

      .types {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 0px;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .completed-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        transition: all 0.3s ease;
        svg {
          font-size: 50px;
          color: ${props => props.theme.colors.primary};
          transition: all 0.3s ease;

          &:hover {
            transform: scale(1.1);
          }
        }
      }
      .date {
        font-size: ${(props) => props.theme?.utils?.tsize?.xs}px;
        font-weight: 400;
        margin-bottom: 0px;
      }
      .order-status {
        font-size: ${(props) => props.theme?.utils?.tsize?.xs}px;
        font-weight: 400;
      }
      .order-status.completed {
        color: ${props => props.theme.colors.primary};
      }
    `}

    @media (min-width: 576px) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .time-container {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 40px;
    font-weight: 800;
    color: ${(props) => props.theme?.colors?.primary};
    transition: all 0.3s ease;

    button {
      min-width: 96px;
      width: fit-content;
      max-width: 140px;
      height: 34px;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }

  @media (min-width: 650px) {
    width: 100%;
  }
`

export const ReOrder = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  flex-direction: column;
  transition: all 0.3s ease;

  button {
    padding: 5px 16px;
    min-width: unset;
    margin: 5px 5px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (min-width: 650px) {
      margin: 0px 5px;
    }
  }

  @media (min-width: 650px) {
    flex-direction: row;
  }
`

export const BusinessTitle = styled.div`
  display: flex;
  justify-content: space-between;
  transition: all 0.3s ease;
`

export const OrderPreferences = styled(OrderCustomer)`
  border-width: 0px;
  padding: 0px;
  margin: 20px 0px;
  transition: all 0.3s ease;

  .order-type-address {
    font-weight: 600;
    font-size: 20px;
    transition: all 0.3s ease;
  }

  .order-type {
    display: flex;
    align-items: center;
    min-height: 25px;
    max-width: 450px;
    margin-top: 5px;
    transition: all 0.3s ease;

    p {
      font-size: ${(props) => props.theme?.utils?.tsize?.s}px;
      font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
      font-weight: 400;
      margin: 0;
      transition: all 0.3s ease;
    }
  }

  ${({ orderCompleted }) => orderCompleted && css`
    padding: 20px 0;
    border-top: 1px solid #E9ECEF;
    border-bottom: 1px solid #E9ECEF;
  `}
`

export const HeaderTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
  transition: all 0.3s ease;

  h1 {
    font-size: ${(props) => props.theme?.utils?.tsize?.xl}px;
    font-weight: 800;
    margin-bottom: 5px;
    transition: all 0.3s ease;
  }

  @media (min-width: 481px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    h1 {
      font-size: 40px;
    }
  }
  `

export const PlaceSpotSection = styled.div`
  transition: all 0.3s ease;
`
export const OrderStatusAndLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;

  @media (min-width: 450px) {
    flex-direction: row;
  }
`
export const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
`

export const OrderHistoryContainer = styled.div`
  transition: all 0.3s ease;
`

export const HistoryItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 28px 23px;
  border-bottom: 1px solid ${props => props.theme.colors.gray200};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  > svg {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.primary};
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`

export const DetailWrapper = styled.div`
  margin-left: 50px;
  transition: all 0.3s ease;
  ${props => props.theme.rtl && css`
    margin-left: 0px;
    margin-right: 50px;
  `}

  h3 {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    margin: 0px;
    transition: all 0.3s ease;
  }
  p {
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    margin: 0px;
    transition: all 0.3s ease;
  }
`

export const ButtonWrapper = styled.div`
  margin-top: 40px;
  transition: all 0.3s ease;
  button {
    width: 100%;
    height: 44px;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    svg {
      position: absolute;
      top: 10px;
      font-size: 22px;
      right: 16px;
      transition: all 0.3s ease;
      ${props => props.theme.rtl && css`
        left: 16px;
        right: initial;
        transform: rotate(180deg);
      `}
    }
  }
`

export const MapWrapper = styled.div`
  width: 100%;
  margin-top: 0px;
  transition: all 0.3s ease;
`

export const BusinessExternalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    width: 50%;
  }
`
export const DirectionButtonWrapper = styled.div`
  margin-top: 30px;
  transition: all 0.3s ease;

  button {
    height: 50px;
    width: 200px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`

export const ProfessionalWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0px 10px 10px 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }

  > img {
    width: 55px;
    height: 55px;
    min-width: 55px;
    border-radius: 8px;
    object-fit: cover;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  > svg {
    width: 55px;
    height: 55px;
    min-width: 55px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      color: ${(props) => props.theme.colors.primary};
    }
  }

  > p {
    font-weight: 600;
    font-size: 17px;
    line-height: 26px;
    margin-left: 14px;
    transition: all 0.3s ease;

    ${props => props.theme.rtl && css`
      margin-left: 0px;
      margin-right: 14px;
    `}
  }

  @media (min-width: 411px) {
    > img {
      width: 65px;
      height: 65px;
      min-width: 65px;
    }
    > svg {
      width: 65px;
      height: 65px;
      min-width: 65px;
    }
  }
`

export const ProfessionalBlock = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.disabled};
  margin-bottom: 15px;
  transition: all 0.3s ease;
`
export const PlaceSpotWrapper = styled.div`
  transition: all 0.3s ease;
  @media (min-width: 768px) {
    width: calc(100% - 20px);
  }
`

export const PoweredByOrdering = styled.p`
  text-align: center;
  margin: 0;
  display: flex;
  justify-content: center;
  white-space: pre !important;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  a{
    font-weight: 600;
    margin-left: 5px;
    transition: all 0.3s ease;
  }
  a:hover{
    text-decoration: none;
    transform: translateY(-1px);
  }
`

export const OrderClonnedMessage = styled.div`
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
  p {
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
  }
`

export const PaymentWrapper = styled.div`
  margin-left: 2px;
  transition: all 0.3s ease;

  span.title {
    font-size: ${(props) => props.theme?.utils?.tsize?.xs}px;
    font-weight: 800;
    transition: all 0.3s ease;
  }

  .payments-list {
    width: 100%;
    transition: all 0.3s ease;
    span {
      font-size: 18px;
      transition: all 0.3s ease;
    }

    .payment-item {
      font-weight: 500;
      margin-bottom: 20px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
      }

      .paymethod {
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
      }

      .paymethod-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        transition: all 0.3s ease;
      }
    }

    .payment-item:last-child {
      margin-bottom: 0px;
    }
  }
`

export const ReviewsProgressContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  transition: all 0.3s ease;

  svg {
    padding: 0 5px;
    font-size: 48px;
    color: ${props => props.theme?.colors.primary};
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  svg:first-child {
    padding-left: 0;
  }
`
