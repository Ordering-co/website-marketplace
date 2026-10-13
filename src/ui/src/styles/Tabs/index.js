import styled, { css } from 'styled-components'
import { rgba } from 'polished'

export const Tabs = styled.div`
  display: flex;
  ${({ variant }) => variant === 'primary' && css`
    width: fit-content;
    border-radius: ${props => props?.theme?.utils?.radius?.m}px;
    background-color: #F8F9FA;
    color: ${props => props?.theme?.colors?.primary};
  `}

  ${({ variant }) => variant === 'secundary' && css`
    color: ${props => props?.theme?.colors?.darkTextColor};
  `}

  ${({ variant }) => variant === 'primaryContrast' && css`
    color: ${props => props?.theme?.colors?.white};
  `}

  ${({ disableBackground }) => disableBackground && css`
    background-color: transparent;
  `}
`

export const Tab = styled.div`
  border-radius: ${props => props?.theme?.utils?.radius?.m}px;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 50px;
  ${({ active }) => active && css`
    background-color: ${props => props?.variant === 'primaryContrast' ? props?.theme?.colors?.primary : rgba(props?.theme?.colors?.primary, 0.12)};
    ${({ borderBottom }) => borderBottom && css`
      border-bottom: 1px solid;
    `}
  `}

  ${({ active }) => !active && css`
    &:hover {
      transform: translateY(-4px);
    }
    color: ${props => props?.variant === 'primaryContrast' ? props?.theme?.colors?.black : props?.theme?.colors?.darkGray};
  `}

  ${({ boldText }) => boldText && css`
    font-weight: 600;
  `}

  ${({ padding }) => padding && css`
    padding: ${padding};
  `}

  ${({ fromCategoryTabs }) => !fromCategoryTabs && css`
    @media (max-width: 480px) {
      flex: 1;
    }
  `}

`
