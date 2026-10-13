import styled, { css } from 'styled-components'
import { darken } from 'polished'

export const AddressListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  transition: all 0.3s ease;

  ${({ isProfile }) => !isProfile && css`
    width: 100%;
  `}

  ${({ isLoading }) => isLoading && css`
    pointer-events: none;
  `}

  .address-form {
    margin-top: 10px;
  }

  .add-address-button {
    display: flex;
    justify-content: flex-start;

    button.add {
      height: 60px;
      padding: 5px 10px;
    }
  }

  button.add {
    height: 50px;
    width: fit-content;
    border-radius: ${props => props?.theme?.utils?.radius?.m}px;
    border-width: 0px;
    padding: 0px;
    font-size: 14px;
    transition: all 0.3s ease;

    &:hover {
      color: ${props => props?.theme?.colors?.primary};
      background-color: transparent;
      transform: translateY(-2px);
    }

    &:active {
      color: ${props => props?.theme?.colors?.primary};
      background-color: transparent;
      transform: translateY(-1px);
    }

    ${({ isProfile }) => !isProfile && css`
      min-width: 100px;
    `}
  }
`

export const AddressListUl = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0px;
  margin-top: 0px;
  transition: all 0.3s ease;

  .divider {
    height: 2px;
    background-color: #E9ECEF;
    margin: 10px 0px 20px;
    border-radius: 1px;
    transition: all 0.3s ease;
  }

  .explore-nearby {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transition: all 0.3s ease;

    h2 {
      font-size: 20px;
      text-align: left;
      margin-bottom: 0px;
      transition: all 0.3s ease;
    }
  }

  .search-address-button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;

    h2 {
      font-size: 20px;
      text-align: left;
      margin: 0px;
      transition: all 0.3s ease;
    }
  }

  .search-address-button {
    position: relative;
    height: 50px;
    width: fit-content;
    border-radius: ${props => props?.theme?.utils?.radius?.m}px;
    border-width: 0px;
    padding: 0px 20px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
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

    @media (min-width: 768px) {
      position: absolute;
    }
  }
`

export const AddressItem = styled.li`
  font-family: ${props => props?.theme?.fonts?.special?.name};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5px 15px 5px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
  }

  ${({ isProfile }) => !isProfile && css`
    padding: 15px 5px 15px 20px;
    margin-bottom: 20px;
    border-radius: ${props => props?.theme?.utils?.radius?.s}px;
    border: 1px solid ${props => props?.theme?.colors?.gray200};
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
    cursor: pointer;

    &:hover {
      box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.12);
      border-color: ${props => props?.theme?.colors?.primary || props?.theme?.colors?.gray200};
    }

    &:active {
      transform: translateY(-1px);
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    }
  `}

  ${({ active, isProfile }) => active && !isProfile && css`
    border: 1px solid ${props => props?.theme?.colors?.primary};
    color: ${props => props?.theme?.colors?.primary};
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  `}

  label {
    font-size: 15px;
    margin-left: 5px;
    font-weight: bold;
    transition: all 0.3s ease;
    ${props => props.theme?.rtl && css`
      margin-right: 5px;
      margin-left: 0;
  `}
  }

  .wrapAddress {
    display: flex;
    align-items: center;
    transition: all 0.3s ease;

    span {
      font-size: 14px;
      display: flex;
      cursor: ${props => props?.isProfile ? 'default' : 'pointer'};
      margin-right: 10px;
      transition: all 0.3s ease;

      ${props => props.theme?.rtl && css`
        margin-left: 10px;
        margin-right: 0px;
      `}

      &.radio {
        color: ${props => props.theme.colors.lightGray};
        font-size: 20px;

        > svg.address-checked {
          color: ${props => props.theme.colors.primary};
        }
      }

      &.selected-tag {
        > svg {
          color: ${props => props.theme.colors.primary};
        }
      }

      &.tag {
        font-size: 24px;
        color: ${props => props.theme.colors.primary};
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.1);
        }
      }

      @media (min-width: 768px) {
        font-size: 16px;
      }
    }
  }

  .address {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.5;
    transition: all 0.3s ease;

    span {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    span:first-child {
      font-weight: 600;
    }

    span:last-child {
      opacity: 0.5;
      font-size: 12px;
    }
  }
`

export const AddressItemActions = styled.div`
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  a {
    padding-left: 5px;
    border-radius: 10px;
    display: flex;
    cursor: pointer;
    margin: 0px 5px;
    font-size: 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(1.05);
    }

    &.red {
      svg {
        color: ${props => props?.theme?.colors?.danger500};
        transition: all 0.3s ease;
      }

      &:hover svg {
        transform: scale(1.1);
      }
    }

    svg {
      color: ${props => props?.theme?.colors?.black};
      transition: all 0.3s ease;
      ${({ isProfile }) => isProfile && css`
        padding: 8px;
        border-radius: 10px;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.12);
      `}
    }
  }

  a.disabled {
    svg {
      color: #CCC;
    }
    pointer-events: none;
  }
`

export const WrappNotAddresses = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;
  margin: 20px auto 10px;
  transition: all 0.3s ease;

  ${({ isCustomerMode }) => isCustomerMode
? css`
    min-height: 200px;
    height: 200px;
  `
: css`
    height: 350px;
  `}

  img {
    width: 200px;
    height: auto;
    aspect-ratio: attr(width) / attr(height);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  h1 {
    margin: 5px 0px 0px;
    opacity: 0.5;
    text-align: center;
    font-size: 24px;
    transition: all 0.3s ease;
  }
`

export const FormActions = styled.div`
  padding: 10px 0px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  transition: all 0.3s ease;

  button {
    height: 45px;
    flex: 1;
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

    &:last-child#second-btn {
      margin-left: 10px;
      ${props => props.theme?.rtl && css`
        margin-left: 0;
        margin-right: 10px;
      `}
    }
  }

  @media (min-width: 769px) {
    button {
      &:last-child#second-btn {
        margin-left: 25px;
        ${props => props.theme?.rtl && css`
          margin-left: 0;
          margin-right: 25px;
      `}
      }
    }
  }
`

export const ContinueButton = styled.div`
  width: 100%;
  position: sticky;
  bottom: 1px;
  transition: all 0.3s ease;

  button {
    width: 100%;
    white-space: nowrap;
    height: 50px;
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
  }
`

export const AddressTitle = styled.span`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: left;
  transition: all 0.3s ease;
  ${props => props.theme?.rtl && css`
    text-align: right;
  `}

  ${({ isProfile }) => isProfile && css`
    font-size: 34px;
  `}
`

export const AddressSubTitle = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: left;
  transition: all 0.3s ease;
`

export const AddressHalfContainer = styled.div`
  display: flex;
  width: 100%;
  transition: all 0.3s ease;
`

export const List = styled.div`
  width: ${({ halfWidth }) => halfWidth ? '50%' : '100%'};
  padding-right: 10px;
  padding-left: 10px;
  transition: all 0.3s ease;

  button {
    width: 100%;
    transition: all 0.3s ease;
  }
`

export const AddressFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: all 0.3s ease;

  ${({ addressOpen }) => !addressOpen && css`
    width: 50%;
    position: sticky;
    right: 0;
    top: 0;
    height: 100%;
    padding-left: 10px;
  `}
`

export const CloseIcon = styled.div`
  font-size: 30px;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  ${props => props.theme?.rtl && css`
    right: 25px;
    left: initial;
  `}
  ${({ isProductForm }) => isProductForm && css`
    top: 18px;
  `}

  svg{
    transition: all 0.3s ease;
    border-radius: 50%;

    &:hover {
      background-color: #1507260a;
      transform: scale(1.1);

      > svg {
        color: #151b26;
      }
    }

    &:active {
      background-color: ${() => darken(0.07, '#CCC')};
      transform: scale(1.05);
    }
  }
`

export const TitleFormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  transition: all 0.3s ease;

  h1 {
    text-align: left;
    margin: 0 10px;
    font-size: 24px;
    transition: all 0.3s ease;
  }
`

export const TitleAddress = styled.h1`
  text-align: left;
  margin: auto;
  font-size: 24px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
`
