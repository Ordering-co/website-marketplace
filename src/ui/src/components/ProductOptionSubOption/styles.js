import styled, { css } from 'styled-components'
import { rgba } from 'polished'

export const Container = styled.div`
  padding: 12px 10px;
  cursor: pointer;
  margin: 4px 0px;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.95);
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }
  -webkit-touch-callout: none;
    -webkit-user-select: none;
     -khtml-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;

  .options-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .option-container {
    min-height: 47px;
    align-items: center;
    display: flex;
    width: 100%;
  }
  .control-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 80px;
  }
`

export const IconControl = styled.div`
  display: flex;
  color: ${props => props.theme.colors.primary};
  margin-right: 5px;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
  ${props => props.theme?.rtl && css`
    margin-left: 5px;
    margin-right: 0px;
  `}
  svg {
    font-size: 24px;
    transition: all 0.2s ease;
  }

  svg[disabled] {
    color: ${props => props.theme.colors.lightGray};
  }

  .icon {
    font-size: 26px;
  }

  .green-icon {
    font-size: 26px;
    color: ${props => props.theme.colors.primary};
    transition: all 0.2s ease;
    &:hover {
      transform: scale(1.1);
    }
  }

  .extra-icon {
    font-size: 28px;
  }
`
export const Text = styled.div`
  flex: 1 1 auto;
  display: flex;
  font-weight: 300;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 8px;

  div {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 18px;
    color: ${props => props.theme.colors.black};
  }

  span {
    margin-left: 10px;
    font-weight: 500;
    color: ${props => props.theme.colors.black};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${props => props.theme?.rtl && css`
      margin-left: 0;
      margin-right: 10px;
    `}
  }

  ${({ noMargin }) => noMargin && css`
    span {
      margin: 0;
    }
  `}
`

export const SubOptionThumbnail = styled.div`
  display: inline-block;
  border-radius: 8px;
  background-image: url(${({ src }) => src});
  background-repeat: no-repeat, repeat;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`

export const QuantityControl = styled.div`
  width: 100%;
  display: flex;
  color: ${props => props.theme.colors.headingColor};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  font-size: 20px;
  margin: 0 5px;
  border-radius: 20px;
  padding: 6px 12px;
  transition: all 0.2s ease;
  min-width: 80px;
  background: #f8f9fa;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
  .plus-icon {
    color: ${props => props.theme.colors.primary};
  }

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 22px;
    margin-right: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 6px;
    padding: 4px;

    &:hover:not([disabled]) {
      transform: scale(1.1);
      background: rgba(0, 0, 0, 0.06);
    }

    &:active:not([disabled]) {
      transform: scale(0.95);
    }

    ${props => props.theme?.rtl && css`
      margin-left: 6px;
      margin-right: 0px;
    `}

    @media (min-width: 425px) {
      margin: 0 3px 1px;
      ${props => props.theme?.rtl && css`
        margin-right: 3px;
        margin-left: 0px;
    `}
    }
  }

  svg[disabled] {
    color: #CBCBCB;
    cursor: not-allowed;

    &:hover {
      color: #adb5bd;
      transform: none;
      background: none;
    }
  }

  svg:last-child {
    margin-left: 6px;
    margin-right: 0;
    ${props => props.theme?.rtl && css`
      margin-right: 6px;
      margin-left: 0px;
  `}
    @media (min-width: 425px) {
      margin: 0 3px 1px;
      ${props => props.theme?.rtl && css`
        margin-right: 3px;
        margin-left: 0px;
    `}
    }
  }
`

export const PositionControl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.black};
  font-weight: 300;
  font-size: 18px;
  margin: 0 5px;
  padding: 0px;

  > div {
    width: 100px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${props => props.theme.colors.gray300};
    font-size: 14px;
    font-weight: 700;
    padding: 0 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;

    &:hover:not(.disabled) {
      background: ${props => props.theme.colors.gray200};
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &:active:not(.disabled) {
      transform: translateY(0);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }
    &.reverse {
      border-radius: ${props => props.theme?.utils?.radius.m}px 0px 0px ${props => props.theme?.utils?.radius.m}px;
    }

    &.right {
      border-radius: 0px ${props => props.theme?.utils?.radius.m}px ${props => props.theme?.utils?.radius.m}px 0px;
    }

    &.selected {
      color: ${props => props.theme.colors.primary};
      background: ${props => rgba(props.theme.colors.primary, 0.12)};
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 2px 8px ${props => rgba(props.theme.colors.primary, 0.2)};
      &:hover {
        background: ${props => rgba(props.theme.colors.primary, 0.12)};
        filter: brightness(1.05);
      }
    }

    &.disabled {
      pointer-events: none;
      opacity: 0.2
    }
    &.disable-clicks {
      pointer-events: none;
    }
  }

  svg {
    font-size: 20px;
    margin-right: 5px;
    background: ${props => props.theme.colors.gray300};
    transition: all 0.2s ease;

    ${props => props.theme?.rtl && css`
      margin-left: 3px;
      margin-right: 0px;
    `}
    &.reverse {
      transform: rotate(180deg);
    }

    &.selected {
      color: ${props => props.theme.colors.primary};
      background: ${props => rgba(props.theme.colors.primary, 0.12)};
    }

    &.disabled {
      pointer-events: none;
      opacity: 0.2
    }
    &.disable-clicks {
      pointer-events: none;
    }
  }
`

export const SuboptionPrice = styled.div`
  display: flex;
  white-space: nowrap;
  font-weight: 300;
  font-size: 14px;
  color: ${props => props.theme.colors.darkGray};
  margin-top: 5px;
  margin-left: 5px;
  min-width: 60px;
  ${props => props.theme?.rtl && css`
    margin-right: 5px;
    margin-left: 0px;
  `}
`

export const LeftOptionContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`

export const RightOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
`

export const ExtraControl = styled.div`
  display: flex;
  align-items: center;
  color: #CBCBCB;
  font-weight: 300;
  font-size: 18px;
  margin: 0 5px;

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 20px;
    margin-right: 3px;
    ${props => props.theme?.rtl && css`
      margin-left: 3px;
      margin-right: 0px;
    `}
  }
  svg[disabled] {
    color: ${props => props.theme.colors.lightGray};
  }
`

export const ExtraItem = styled.div`
  display: flex;
  padding-bottom: 10px;
  &.disabled {
      pointer-events: none;
      opacity: 0.2
    }
`
