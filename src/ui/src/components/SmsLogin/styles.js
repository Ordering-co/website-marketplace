import styled from 'styled-components'
import { Button } from '../../styles/Buttons'

export const SMSButton = styled(Button)`
  background-color: ${props => props.theme.colors.backgroundPage};
  border: 1px solid ${props => props.theme.colors.black};
  color: ${props => props.theme.colors.black};
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  transition: all 0.25s ease;
  svg {
    font-size: 28px;
    color: ${props => props.theme.colors.black};
  }

  div {
    margin: 0 auto;
  }

  &:hover {
    background-color: ${props => props.theme.colors.gray300};
    border-color: ${props => props.theme.colors.black};
    color: ${props => props.theme.colors.black};
  }
`
