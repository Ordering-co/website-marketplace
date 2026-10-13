import styled, { css } from 'styled-components'

export const Container = styled.div`
  padding: 0px 10px;

  div:not(:last-child) {
    padding-bottom: 5px;
  }

  @media (min-width: 769px) {
    margin-bottom: 10px;
    padding: 10px;
  }
`

export const WrapperContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

export const NotCarts = styled.div`
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;
  margin: auto;

  ${({ isSlideBar }) => isSlideBar && css`
    height: auto;
    min-height: calc(100vh - 140px);
    min-height: calc(100dvh - 140px);
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;

    #not-found-source {
      box-sizing: border-box;
      max-width: 100%;
    }
  `}

  img {
    width: 200px;
    height: auto;
    aspect-ratio: attr(width) / attr(height)
  }
  h1 {
    margin: 5px 0px 0px;
    opacity: 0.5;
    text-align: center;
    font-size: 24px;
  }
`

export const Title = styled.h1`
  font-weight: 600;
  font-size: 20px;
  color: ${props => props.theme.colors.darkTextColor};
  margin-bottom: 8px;
  line-height: 30px;
  margin-top: 0;
  text-align: center;

  @media (min-width: 576px) {
    text-align: left;
  }
`

export const CartGroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;

  button {
    flex-shrink: 0;
  }
`

export const CartGroupTitle = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  min-width: 0;
`

export const PendingBadge = styled.span`
  color: ${props => props.theme?.colors?.primary};
  font-size: 12px;
  margin-left: 5px;
`

export const CartGroupTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const CartGroupDivider = styled.div`
  height: 1px;
  background-color: #ccc;
  width: 100%;
  position: absolute;
  left: 0px;
`

export const MultiCartPriceContainer = styled.div`
  margin-top: 38px;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
    margin-bottom: 5px;
    > h4 {
      font-size: 18px;
      margin: 0;
    }
  }
  > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  p {
    font-size: 14px;
    color: ${props => props.theme.colors.darkGray};
    margin: 0;
  }
`
