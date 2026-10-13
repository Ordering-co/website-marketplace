import styled from 'styled-components'
import { Button } from '../../styles/Buttons'

export const GoogleButton = styled(Button)`
  border: 1px solid #000000;
  background: transparent;
  border-radius: 7.6px;
  font-size: 16px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  margin-bottom: 10px;

  &:active {
    background: ${props => props.theme.colors.primaryContrast};
  }

  svg {
    font-size: 25px;
    fill: #000000;
    flex-shrink: 0;
  }
`
