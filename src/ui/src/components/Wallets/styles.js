import styled, { css } from 'styled-components'

export const Container = styled.div`
  width: 95%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0px 15px 15px 15px;
  box-sizing: border-box;
  min-height: calc(100vh - 280px);
  transition: all 0.3s ease;

  ${props => props.noPadding && css`
    padding: 0;
  `}

  > img {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  .gift-card-content {
    width: 70%;
    margin: 0 auto;
    transition: all 0.3s ease;
  }

  @media (min-width: 768px) {
    width: 85%;
  }
`

export const Title = styled.h1`
  font-weight: 600;
  font-size: 32px;
  margin-bottom: 0px;
  margin-top: 0;
  transition: all 0.3s ease;

  @media (min-width: 1280px) {
    font-size: 36px;
  }
`

export const TabsContainer = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.gray200};
  transition: all 0.3s ease;
`

export const Tab = styled.div`
  padding: 10px 0px;
  margin-right: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  position: relative;

  &:hover {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  }

  ${props => props.theme.rtl && css`
    margin-right: 0px;
    margin-left: 30px;
  `}

  ${({ active }) => active && css`
    ${({ borderBottom }) => borderBottom && css`
      border-bottom: 1px solid;
    `}
    background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primary}dd 100%);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
    }
  `}

  ${({ active }) => !active && css`
    color: ${props => props.theme.colors.darkGray};
  `}
`

export const SectionWrapper = styled.div`
  padding-top: 10px;
  display: flex;
  transition: all 0.3s ease;

  ${(props) => !props.isLoading && css`
    align-items: center;
  `};

  @media (min-width: 768px) {
    ${(props) => !props.isLoading && css`
      align-items: flex-start;
    `};
  }
`

export const TransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
`

export const BalanceElement = styled.div`
  width: 100%;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.grayDividerColor};
  border-radius: 15px;
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

  .balance_element {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .balance_element-points {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transition: all 0.3s ease;
    margin-top: 20px;

    h1 {
      font-size: 26px;
      transition: all 0.3s ease;
    }

    span {
      font-size: 14px;
      margin-left: 0px;
      transition: all 0.3s ease;
    }

    @media (min-width: 768px) {
      margin-top: 0px;
    }
  }

  h1 {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    padding: 0;
    transition: all 0.3s ease;
  }

  span {
    font-size: 10px;
    margin-left: 5px;
    transition: all 0.3s ease;
  }

  @media (min-width: 768px) {
    flex-direction: row;
  }

  @media (min-width: 1280px) {
    padding: 40px 30px;
    .balance_element-points {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      h1 {
        font-size: 36px;
      }

      span {
        font-size: 14px;
        margin-left: 0px;
      }
    }
    h1 {
      font-size: 32px;
    }

    span {
      font-size: 20px;
    }

    ${({ loyaltyLevel }) => loyaltyLevel && css`
      padding: 10px 30px;
    `}
  }
`

export const WrapContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  transition: all 0.3s ease;
`

export const Transactions = styled.div`
  transition: all 0.3s ease;

  .transactions_list {
    margin-top: 20px;
    transition: all 0.3s ease;

    h2 {
      text-align: center;
      transition: all 0.3s ease;
    }
  }

  @media (min-width: 768px) {
    margin: 0;

    .transactions_list h2 {
      text-align: left;
    }
  }
`

export const LoyaltyContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;

  span.loyalty_name {
    font-size: 28px;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-1px);
  }
`

export const LoyaltyWrapp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  transition: all 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 16px;
    transition: all 0.3s ease;
  }

  /* Neutral placeholder shown when the level image is missing/fails — keeps the
     slot the same size so the "Level X" text never shifts. */
  .loyalty_placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    background: ${props => props.theme.colors.gray300};
    color: ${props => props.theme.colors.darkGray};

    svg {
      font-size: 44px;
    }
  }

  &:hover img {
    transform: scale(1.05);
  }
`

export const NotFoundText = styled.div`
  font-size: 16px;
  text-align: center;
  transition: all 0.3s ease;

  span {
    font-weight: 600;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-1px);
  }
`

export const Divider = styled.div`
  width: 100%;
  height: 5px;
  background-color: #E9ECEF;
  margin: 30px 0;
  border-radius: 2px;
  transition: all 0.3s ease;
`
