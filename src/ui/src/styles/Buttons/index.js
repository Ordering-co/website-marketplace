import styled, { css } from 'styled-components'
import { darken } from 'polished'

export const IconButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 6px;
  height: 32px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s ease-in;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  > svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.lightGray};
  }

  &:hover {
    background-color: #1507260a;

    > svg {
      color:  #151b26;
    }
  }

  &:active {
    background-color: #1507261a;
  }

  ${({ color }) => color === 'black' && css`
    > svg {
      color: ${props => props.theme.colors.headingColor};
    }
    &:hover {
      background-color: ${props => props.theme.colors.secundary};
    }
    &:active {
      background-color: ${props => props.theme.colors.secundaryDarkContrast};
    }

    ${({ active }) => active && css`
      background-color: ${props => props.theme.colors.secundaryDarkContrast};
    `}
  `}

  ${({ color }) => color === 'primary' && css`
    > svg {
      color: ${props => props.theme.colors.primary};
    }
    &:hover {
      background-color: #1507260a;
      > svg {
        color: ${props => props.theme.colors.primary};
      }
    }
  `}
  ${({ isDisabled }) => isDisabled && css`
    pointer-events: none;
  `}
`

const ButtonBase = styled.button`
  background: #E9ECEF;
  color: ${props => props.theme?.colors?.black || '#000'};
  border: 1px solid #E9ECEF;
  border-radius: 15px;
  line-height: 30px;
  padding-left: 15px;
  padding-right: 15px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
  &:active {
    background: ${() => darken(0.07, '#CCC')};
  }
  &:disabled {
    opacity: ${({ avoidOpacity }) => avoidOpacity ? 1 : 0.5};
    cursor: not-allowed;
  }
  ${({ width }) => width && css`
    width: ${width};
  `}
  ${({ bgtransparent }) => bgtransparent && css`
      background: transparent !important;
      &:hover {
        background: ${darken(0.15, '#CCC')};
        color: ${props => darken(0.15, props.theme.colors.primary)} !important;
      }
  `}
  ${({ initialIcon }) => initialIcon && css`
    text-align: left;
    ${props => props.theme?.rtl && css`
      text-align: right;
    `}
    img{
      vertical-align: middle;
    }
    span {
      padding-left: 15%
      ${props => props.theme?.rtl && css`
        padding-right: 15%;
        padding-left: 0;
    `}
    }
  `}
  ${({ theme }) => theme?.general?.components?.buttons?.borderRadius && css`
      border-radius: ${theme?.general?.components?.buttons?.borderRadius};
  `}
  ${({ theme }) => Object.values(theme?.general?.components?.buttons?.shadow?.components || {}).some(val => !!val) && css`
    box-shadow:
      ${theme?.general?.components?.buttons?.shadow?.components?.x || '0px'}
      ${theme?.general?.components?.buttons?.shadow?.components?.y || '0px'}
      ${theme?.general?.components?.buttons?.shadow?.components?.blur || '0px'}
      ${theme?.general?.components?.buttons?.shadow?.components?.spread || '0px'}
      ${theme?.general?.components?.buttons?.shadow?.components?.color || '#000'};
  `}
  ${({ theme, outline, bgtransparent }) => theme?.general?.components?.buttons?.color && !outline && !bgtransparent && css`
    background: ${theme?.general?.components?.buttons?.color};
    &:active {
      background: ${darken(0.07, theme?.general?.components?.buttons?.color)};
    }
    &:hover {
      background: ${darken(0.07, theme?.general?.components?.buttons?.color)};
    }
  `}
  ${({ theme, outline }) => theme?.general?.components?.buttons?.buttonTextColor && !outline && css`
    color: ${theme?.general?.components?.buttons?.buttonTextColor};
    &:active {
      color: ${darken(0.07, theme?.general?.components?.buttons?.buttonTextColor)};
    }
    &:hover {
      color: ${darken(0.07, theme?.general?.components?.buttons?.buttonTextColor)};
    }
  `}
  ${({ outline }) => outline && css`
    background: #FFF;
    color: ${props => props.theme.colors.darkGray};
    border-color: ${props => props.theme.colors.darkGray};
    &:active {
      color: #FFF;
      background: ${props => props.theme.colors.darkGray};
    }
    &:hover {
      background: ${props => props.theme.colors.darkGray};
      color: #FFF;
    }
  `}
  ${({ circle }) => circle && css`
    background: #CCC;
    color: #FFF;
    border-color: #CCC;
    padding: 0;
    width: 34px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    border-radius: 50%;
    &:active {
      color: #FFF;
      background: ${darken(0.07, '#CCC')};
    }
  `}
  ${({ circle, outline }) => circle && outline && css`
    background: #FFF;
    color: ${props => props.theme.colors.darkGray};
    border-color: ${props => props.theme.colors.darkGray};
    padding: 0;
    width: 34px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    border-radius: 50%;
    &:active {
      color: #FFF;
      background: ${props => props.theme.colors.darkGray};
    }
  `}
  ${({ color }) => color === 'primary' && css`
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primaryContrast};
    border-color: ${props => props.theme.colors.primary};
    &:active {
      background: ${props => darken(0.07, props.theme.colors.primary)};
    }
    &:hover {
      background: ${props => darken(0.07, props.theme.colors.primary)};
      color: #FFF;
    }
    ${({ outline }) => outline && css`
      background: #FFF;
      color: ${props => props.theme.colors.primary};
      border-color: ${props => props.theme.colors.primary};
      &:active {
        color: ${props => props.theme.colors.primaryContrast};
        background: ${props => props.theme.colors.primary};
      }
      &:hover {
        background: ${props => darken(0.07, props.theme.colors.primary)};
        color: #FFF;
      }
    `}
    ${({ circle }) => circle && css`
      background: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.primaryContrast};
      border-color: ${props => props.theme.colors.primary};
      padding: 0;
      width: 34px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-radius: 50%;
      &:active {
        border-color: ${props => darken(0.07, props.theme.colors.primary)};
        background: ${props => darken(0.07, props.theme.colors.primary)};
      }
    `}
    ${({ circle, outline }) => circle && outline && css`
      background: #FFF;
      color: ${props => props.theme.colors.primary};
      border-color: ${props => props.theme.colors.primary};
      padding: 0;
      width: 34px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-radius: 50%;
      &:active {
        border-color: ${props => props.theme.colors.primary};
        background: ${props => props.theme.colors.primary};
      }
    `}
  `}
  ${({ color }) => color === 'primaryContrast' && css`
    background: ${props => props.theme.colors.primaryContrast};
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primaryContrast};
    &:hover {
      background: ${props => darken(0.04, props.theme.colors.primaryContrast)};
    }
    &:active {
      background: ${props => darken(0.1, props.theme.colors.primaryContrast)};
    }
    ${({ naked }) => naked && css`
      background: transparent;
      border-color: transparent;
      &:active {
        background: transparent;
      }
      &:hover {
        background: transparent;
      }
    `}
  `}
  ${({ color }) => color === 'secundary' && css`
    background: ${props => props.theme.colors.secundary};
    color: ${props => props.theme.colors.secundaryContrast};
    border-color: ${props => props.theme.colors.secundary};
    &:active {
      background: ${props => darken(0.07, props.theme.colors.secundary)};
    }
    ${({ outline }) => outline && css`
      background: #FFF;
      color: ${props => props.theme.colors.secundary};
      border-color: ${props => props.theme.colors.secundary};
      &:active {
        color: ${props => props.theme.colors.secundaryContrast};
        background: ${props => darken(0.05, props.theme.colors.secundary)};
      }
      &:hover {
        background: ${props => darken(0.07, props.theme.colors.secundary)};
        color: #FFF;
      }
    `}
    ${({ circle }) => circle && css`
      background: ${props => props.theme.colors.secundary};
      color: ${props => props.theme.colors.secundaryContrast};
      border-color: ${props => props.theme.colors.secundary};
      padding: 0;
      width: 34px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-radius: 50%;
      &:active {
        color: ${props => props.theme.colors.secundaryContrast};
        border-color: ${props => darken(0.07, props.theme.colors.secundary)};
        background: ${props => darken(0.07, props.theme.colors.secundary)};
      }
    `}
    ${({ circle, outline }) => circle && outline && css`
      background: #FFF;
      color: ${props => props.theme.colors.secundary};
      border-color: ${props => props.theme.colors.secundary};
      padding: 0;
      width: 34px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-radius: 50%;
      &:active {
        border-color: ${props => props.theme.colors.secundary};
        background: ${props => props.theme.colors.secundary};
        color: ${props => props.theme.colors.secundaryContrast};
      }
    `}
  `}
  ${({ color }) => color === 'gray' && css`
    background: ${props => props.theme.colors.grayDividerColor};
    color: ${props => props.theme.colors.darkGray};
    border-color: ${props => props.theme.colors.grayDividerColor};
    &:active {
      background: ${props => darken(0.05, props.theme.colors.grayDividerColor)};
    }
    &:hover {
      background: ${props => darken(0.07, props.theme.colors.grayDividerColor)};
    }
    ${({ boldText }) => boldText && css`
      font-weight: 600;
    `}
  `}
  ${({ color }) => color === 'green' && css`
    background: ${props => props.theme.colors.lightGreen};
    color: ${props => props.theme.colors.darkGreen};
    border-color: ${props => props.theme.colors.lightGreen};
    &:active {
      background: ${props => darken(0.05, props.theme.colors.lightGreen)};
    }
    &:hover {
      background: ${props => darken(0.07, props.theme.colors.lightGreen)};
    }
    ${({ outline }) => outline && css`
      background: #FFF;
      color: ${props => props.theme.colors.darkGreen};
      border-color: ${props => props.theme.colors.darkGreen};
      &:active {
        color: ${props => props.theme.colors.darkGreen};
        background: ${props => darken(0.05, props.theme.colors.lightGreen)};
      }
      &:hover {
        background: ${props => darken(0.07, props.theme.colors.darkGreen)};
        color: #FFF;
      }
    `}
  `}
  ${({ color }) => color === 'lightGray' && css`
    background: ${props => props.theme.colors.gray200};
    color: ${props => props.theme.colors.black};
    border: 1px solid ${props => props.theme.colors.gray200};
    transition: all 0.25s ease;
    &:active {
      transform: translateY(0);
      background: ${props => darken(0.05, props.theme.colors.gray200)};
    }
    &:hover {
      background: ${props => props.theme.colors.backgroundPage};
      border-color: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.primary};
      transform: translateY(-1px);
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.10);
    }
  `}
  ${({ color }) => color === 'darkGray' && css`
    background: ${props => props.theme.colors.gray300};
    color: ${props => props.theme.colors.black};
    border: 1px solid ${props => props.theme.colors.gray200};
    box-shadow: none;
    transition: all 0.25s ease;
    svg {
      transition: all 0.25s ease;
    }
    &:active {
      transform: translateY(0);
      background: ${props => darken(0.03, props.theme.colors.gray300)};
    }
    &:hover {
      background: ${props => props.theme.colors.backgroundPage};
      border-color: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.primary};
      transform: translateY(-1px);
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.10);
      svg {
        color: ${props => props.theme.colors.primary};
      }
    }
  `}
  ${({ color }) => color === 'red' && css`
    background: ${props => props.theme.colors.danger500};;
    color: ${props => props.theme.colors.backgroundPage};
    border-color: ${props => props.theme.colors.danger500};
    &:active {
      background: ${props => darken(0.05, props.theme.colors.danger500)};
    }
    &:hover {
      background: ${props => darken(0.07, props.theme.colors.danger500)};
    }
    ${({ outline }) => outline && css`
      background: ${props => props.theme.colors.backgroundPage};
      color: ${props => props.theme.colors.danger500};
      border-color: ${props => props.theme.colors.danger500};
      &:active {
        color: ${props => props.theme.colors.backgroundPage};
        background: ${props => props.theme.colors.danger500};
      }
      &:hover {
        background: ${props => darken(0.07, props.theme.colors.danger500)};
        color: ${props => props.theme.colors.backgroundPage};
      }
    `}
  `}
  ${({ color }) => color === 'lightRed' && css`
    background: ${props => props.theme.colors.danger200};;
    color: ${props => props.theme.colors.danger500};
    border-color: ${props => props.theme.colors.danger200};
    &:active {
      background: ${props => darken(0.05, props.theme.colors.danger200)};
    }
    &:hover {
      background: ${props => darken(0.07, props.theme.colors.danger200)};
    }
    ${({ outline }) => outline && css`
      background: ${props => props.theme.colors.danger500};
      color: ${props => props.theme.colors.danger200};
      border-color: ${props => props.theme.colors.danger200};
      &:active {
        color: ${props => props.theme.colors.danger500};
        background: ${props => props.theme.colors.danger200};
      }
      &:hover {
        background: ${props => darken(0.07, props.theme.colors.danger200)};
        color: ${props => props.theme.colors.danger500};
      }
    `}
  `}
  ${({ color }) => color === 'white' && css`
    background: ${props => props.theme.colors.white};;
    color: ${props => props.theme.colors.black};
    border-color: ${props => props.theme.colors.white};
    &:active {
      background: ${props => darken(0.05, props.theme.colors.white)};
    }
    &:hover {
      background: ${props => darken(0.07, props.theme.colors.white)};
    }
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);

    ${({ outline }) => outline && css`
      background: ${props => props.theme.colors.black};
      color: ${props => props.theme.colors.white};
      border-color: ${props => props.theme.colors.white};
      &:active {
        color: ${props => props.theme.colors.white};
        background: ${props => props.theme.colors.black};
      }
      &:hover {
        background: ${props => darken(0.07, props.theme.colors.white)};
        color: ${props => props.theme.colors.black};
      }
    `}
  `}
  ${({ color }) => color === 'black' && css`
    background: ${props => props.theme.colors.black};;
    color: ${props => props.theme.colors.backgroundPage};
    border-color: ${props => props.theme.colors.black};
    &:active {
      background: ${props => darken(0.05, props.theme.colors.black)};
    }
    &:hover {
      background: ${props => darken(0.07, props.theme.colors.black)};
    }
    ${({ outline }) => outline && css`
      background: ${props => props.theme.colors.backgroundPage};
      color: ${props => props.theme.colors.black};
      border-color: ${props => props.theme.colors.black};
      &:active {
        color: ${props => props.theme.colors.backgroundPage};
        background: ${props => props.theme.colors.black};
      }
      &:hover {
        background: ${props => darken(0.07, props.theme.colors.black)};
        color: ${props => props.theme.colors.backgroundPage};
      }
    `}
  `}
`

export const ButtonSpinner = styled.span`
  box-sizing: border-box;
  display: block;
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: button-spinner-rotate 1.4s linear infinite;
  flex-shrink: 0;

  @keyframes button-spinner-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

export const SocialIconSlot = styled.span`
  width: 25px;
  height: 25px;
  min-width: 25px;
  min-height: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 0;

  svg {
    font-size: 25px;
    flex-shrink: 0;
  }
`

export const SocialButtonLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
`

export const Button = styled(ButtonBase).attrs({ as: 'button' })``
export const ButtonLink = styled(ButtonBase).attrs({ as: 'a' })`
  text-decoration: none;
  text-align: center;
  &:link, &:visited, &:hover {
    text-decoration: none !important;
  }
`

export default Button
