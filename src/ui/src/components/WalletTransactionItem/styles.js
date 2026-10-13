import styled from 'styled-components'

export const TransactionsContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .transaction-list {
    display: flex;
    flex-direction: column;
    width: 80%;
  }
`

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  margin: 20px 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray200};
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray100};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:last-child {
    border-bottom: none;
  }
`

export const ItemDateBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .left-wrapper {
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  }
`

export const ItemIcon = styled.div`
  width: 53px;
  height: 53px;
  border-radius: 12px;
  background-color: ${(props) => props.theme.colors.grayDividerColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  svg {
    font-size: 24px;
    color: ${(props) => props.theme.colors.danger500};
    transition: all 0.3s ease;
  }

  &.green {
    background-color: ${(props) => props.theme.colors.success100};
    svg {
      color: ${(props) => props.theme.colors.success500};
    }
  }

  &:not(.green) {
    background-color: ${(props) => props.theme.colors.danger100};
  }
`

export const ItemRight = styled.div`
  margin-left: 10px;
  transition: all 0.3s ease;
`

export const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: all 0.3s ease;

  .date {
    color: ${(props) => props.theme.colors.darkGray};
    margin-bottom: 4px;
    transition: all 0.3s ease;
  }

  div.amount {
    width: max-content;
    font-weight: 600;
    color: ${(props) => props.theme.colors.danger500};
    transition: all 0.3s ease;
  }

  div.green {
    color: ${(props) => props.theme.colors.success500};
  }
`

export const ItemText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
`

export const ItemDescriptionBlock = styled.div`
  flex-direction: row;
  flex-wrap: wrap;
  color: ${(props) => props.theme.colors.darkTextColor};
  font-weight: 700;
  font-size: 15px;
  line-height: 1.4;
  transition: all 0.3s ease;

  div {
    transition: all 0.3s ease;
  }
`

export const TabsContainer = styled.div`
  margin: 20px;

  .tabs {
    width: 100%;
    flex-direction: column;
  }

  .tab {
    padding: 8px 22px;
    margin-bottom: 10px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
    }

    @media (min-width: 576px) {
      margin-left: 25px;
      margin-right: 25px;
      margin-bottom: 0px;
    }
  }

  @media (min-width: 576px) {
    margin: 0px;
    .tabs {
      flex-direction: row;
      justify-content: center;
    }
  }
`

export const Header = styled.div`
  margin-top: 40px;
  transition: all 0.3s ease;
`
