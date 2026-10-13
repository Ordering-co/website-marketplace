import styled, { css } from 'styled-components'

export const Title = styled.h1`
  font-weight: 600;
  font-size: 32px;
  margin-bottom: 20px !important;
  margin-top: 0;
`
export const Container = styled.div`
  padding: 20px;
  overflow: hidden;
  min-height: auto;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  ${({ initialHeight }) => !initialHeight && css`
    min-height: calc(100vh - 320px);
  `}

  > h1 {
    font-weight: 600;
    font-size: 32px;
    line-height: 48px;
    margin-bottom: 7px;
    margin-top: 0px;
    text-transform: capitalize;
  }

  @media (min-width: 769px) {
    ${({ hideOrders }) => !hideOrders
? css`
      padding: 0px 40px 40px;
      width: 75%;
    `
: css`
      padding: 0;
      width: 100%;

      @media (min-width: 993px) {
        min-height: 'auto';
      }
    `}
    margin-left: auto;
    margin-right: auto;
  }

`

export const Divider = styled.div`
  background: ${props => props.theme.colors.grayDividerColor};
  height: 8px;
  width: 100%;
  margin: 20px 0;
`

export const OrderGroupFilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 15px;

  button {
    margin-top: 10px;
    display: flex;
    align-items: center;
    border-radius: 50px;
    margin-right: 10px;
    ${props => props.theme.rtl && css`
      margin-right: 0;
      margin-left: 10px;
    `}
    > svg {
      margin-left: 5px;
      ${props => props.theme.rtl && css`
        margin-right: 5px;
        margin-left: 0;
      `}
    }
  }
`

export const NoOrdersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0px;
  box-sizing: border-box;
  min-height: calc(100% - 120px);
  width: 100%;

  ${({ allEmpty }) => !allEmpty && css`
    position: absolute;
  `}

  > p {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    margin-top: 0px;
    margin-bottom: 25px;
  }

  button {
    height: 44px;
  }
`

export const CategoryListsContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 25px;
`
export const MyOrdersMenuContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.gray300};
  border-radius: 20px;
  z-index: 1000;
  position: sticky;
  top: 0;
  text-align: center;
  width: 100%;
  margin-bottom: 5px;
  div.category {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 10px 0px;
    margin: 0 15px;
    &:nth-of-type(1) {
      margin-left: 0;
      ${props => props.theme.rtl && css`
        margin-left: 15px;
        margin-right: 15px;
      `}
    }
  }

  div.special {
    ${props => !props.featured && css`
      display: none
    `}
  }

  .my-orders-tab {
    min-width: max-content;
  }

  @media (min-width: 992px) {
    width: auto;
  }
`
