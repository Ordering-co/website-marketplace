import styled, { css } from 'styled-components'

export const PaymentMethodsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`

export const PaymentMethodsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: calc(100%);
  align-items: flex-start;
`

export const Container = styled.div`
  margin: 0 auto;
`

export const PayCard = styled.div`
  width: calc(50% - 30px);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 15px;
  text-align: center;

  ${props => props.isDisabled && css`
    pointer-events: none;
  `}

  > div {
    max-width: 88px;
    width: 100%;
    height: 56px;
    border: ${props => props.hasImage ? '0' : `1px solid ${props.theme?.colors.gray200}`};
    border-radius: 7.6px;
    padding: ${props => props.hasImage ? '0' : '0 15px'};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    box-sizing: border-box;
    transition: all 0.25s ease;

    > svg {
      font-size: 25px;
      path {
        fill: ${props => props.theme?.colors.black};
      }
    }

    > img {
      height: 45px;
      width: auto;
      max-width: 100%;
      object-fit: contain;

      &[alt='paypal_braintree'] {
        height: 45px;
      }
    }
  }

  p {
    width: 100%;
    margin: 0px;
    font-size: 13px;
    text-align: center;
    color: ${props => props.theme?.colors.darkGray};
  }

  @media (min-width: 351px) {
    width: calc(33% - 30px);
  }

  @media (min-width: 513px) {
    width: calc(25% - 30px);
  }

  @media (min-width: 768px) {
    margin: 15px 30px 15px 0px;
    width: calc(25% - 30px);
  }

  @media (min-width: 1200px) {
    width: calc(15% - 20px);
  }

  &:hover:not(.active) > div {
    border: 1px solid ${props => props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.10);
  }

  &.active {
    > div {
      border: 2px solid ${props => props.theme.colors.primary};
      svg path {
        fill: ${props => props.theme.colors.primary};
      }
    }
    p {
      color: ${props => props.theme.colors.primary};
    }
  }

  /* &:not(.active) {
    border: ${({ isSkeleton }) => isSkeleton ? '0' : '1px solid #EAEAEA'};
  } */
`

export const PayCardSelected = styled.div`
  padding: 30px 0px 0px;
`

export const CardItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-weight: bold;

  span {
    display: flex;
  }

  .checks svg {
    color: ${props => props.theme.colors.primary};
    font-size: 22px;
  }

  img {
      width: 24px;
      height: 20px;
  }

  .brand svg {
    font-size: 26px;
  }

  > * {
    margin-right: 10px
    ${props => props.theme?.rtl && css`
      margin-left: 10px;
      margin-right: 0;
    `}
  }
`
