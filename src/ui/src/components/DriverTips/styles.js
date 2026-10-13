import styled, { css } from 'styled-components'

export const DriverTipContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-bottom: 20px;
  width: 100%;
`

export const TipCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  border: 1px solid ${props => props.theme.colors.gray200};
  background: ${props => props.theme.colors.gray300};
  width: 100%;
  height: 50px;
  min-width: 65px;
  max-width: 70px;
  cursor: pointer;
  text-transform: capitalize;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.black};
  transition: all 0.25s ease;
  text-align: center;

  &:hover {
    background: ${props => props.theme.colors.backgroundPage};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.10);
  }

  &.active {
    border: 1px solid ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};

    &:hover {
      background: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.white};
    }
  }

  @media (min-width: 768px) {
    max-width: 95px;
    ${({ isCartPopover }) => isCartPopover && css`
      max-width: 80px;
    `}
  }
`

export const FormDriverTip = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 1396px) and (max-width: 1556px) {
    flex: 0 0 100%;
  }
`

export const DriverTipLabel = styled.label`
  font-size: 16px;
  align-self: flex-start;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }

  ${props => props.theme?.rtl && css`
    margin-left: 20px;
    margin-right: 0;
  `}
`

export const WrapperInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;

  input {
    width: 100%;
    padding: 4px 15px;
    box-sizing: border-box;
    flex: 1;
    text-align: center;
    transition: all 0.3s ease;
    border: 1px solid ${props => props.theme.colors.gray200};
    border-radius: 15px;
    height: 50px;
    outline: none;
    color: ${props => props.theme.colors.black};

    &:focus {
      border: 2px solid ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.primary};
    }

    &:hover {
      transform: scale(1.02);
    }
  }

  button {
    white-space: nowrap;
    flex-shrink: 0;
  }
`

export const DriverTipMessage = styled.p`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
`

export const WrapperTips = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: stretch;
  gap: 12px;
  min-height: 65px;
`

export const TipChips = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`
