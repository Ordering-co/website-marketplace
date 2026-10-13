import styled, { css } from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0px;
  cursor: pointer;

  span {
    display: flex;
    font-size: 16px;
    color: ${props => props.theme.colors.darkGray};
  }

  span:nth-child(1) {
    margin-right: 10px;
    ${props => props.theme?.rtl && css`
      margin-left: 10px;
      margin-right: 0px;
    `}
    svg {
      color: ${props => props.isSoldOut ? props.theme.colors.lightGray : props.theme.colors.primary};
      font-size: 26px;
    }

    .green-icon {
      color: ${props => props.theme.colors.primary};
    }
  }
`
