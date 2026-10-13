import styled, { css } from 'styled-components'
import { darken } from 'polished'

export const AddressFormContainer = styled.div`
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: clip;
`

export const FormFields = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  flex: 1 1 100%;
  align-self: stretch;
`

export const FormActions = styled.div`
  /* Use padding (not margin) so the sticky bar's opaque background covers the
     gap. Margin on sticky CTAs stays transparent and lets Address tags bleed
     through while scrolling (the "Favorite / Other" peek under the button). */
  margin-top: 0;
  padding: 16px 0 12px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  /* pin the primary CTA to the bottom of the scrolling modal so it
     never scrolls out of view (same pattern as AddressList's ContinueButton) */
  position: sticky;
  bottom: 0;
  background-color: ${props => props.theme?.colors?.backgroundPage};
  z-index: 10;

  /* do not use bottom:65px in this modal CTA — the Modal already covers
     the NavigationBar. Seal below the bar so modal padding cannot reveal tags. */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    height: 64px;
    background-color: ${props => props.theme?.colors?.backgroundPage};
    pointer-events: none;
  }

  button {
    border-radius: ${props => props.theme.utils.radius.m}px;
    height: 60px;
    width: 100%;
    text-transform: lowercase;
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

    &:first-letter {
      text-transform: uppercase;
    }
  }
`

export const FormControl = styled.form`
  padding: 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;

  input {
    box-shadow: 0px 1px 4px 0px #0000001A;
    box-sizing: border-box;
    margin: 10px 0px;
    height: 50px;
    width: 100%;
    transition: transform 160ms ease-out, box-shadow 160ms ease-out, opacity 160ms ease-out;
    border-radius: 12px;

    &:hover:not(:disabled) {
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
      transform: translateY(-1px);
    }

    &:focus:not(:disabled) {
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0px 1px 4px 0px #0000001A;
    }

    &.internal_number,
    &.zipcode {
      flex: auto;
    }

    &::placeholder{
      color: #CBCBCB;
      transition: all 0.3s ease;
    }

    &:focus::placeholder {
      opacity: 0.7;
    }
  }

  textarea {
    box-shadow: 0px 1px 4px 0px #0000001A;
    width: 100%;
    /* /697: this address-notes textarea sets width:100%, so keep the
       padding inside the box here to avoid mobile overflow. It uses rows (not a
       fixed height), so border-box only constrains width. */
    box-sizing: border-box;
    margin: 10px 0 20px;
    border-radius: ${props => props?.theme?.utils?.radius?.s}px;
    transition: transform 160ms ease-out, box-shadow 160ms ease-out, opacity 160ms ease-out;

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
    }

    &:hover:not(:disabled) {
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
      transform: translateY(-1px);
    }

    &:focus:not(:disabled) {
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }
  }

  .input-autocomplete {
    width: 100%;
    background: #FFF;
    border: 0px solid #BBB;
    border-radius: 30px;
    font-size: 16px;
    padding: 12px 20px !important;
    height: 50px;
    outline: none;
    transition: all 0.3s ease;
    box-shadow: 0px 1px 4px 0px #0000001A;

    &:hover:not(:disabled) {
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
      transform: translateY(-1px);
    }

    &:focus {
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
      border-color: ${() => darken(0.07, '#CCC')};
    }

    ::placeholder {
      color: #DBDCDB;
      transition: all 0.3s ease;
    }

    &:focus::placeholder {
      opacity: 0.7;
    }

    &:-ms-input-placeholder {
      color: #DBDCDB;
    }

    &::-ms-input-placeholder { /* Microsoft Edge */
      color: #DBDCDB;
    }
  }

  .google-control {
    transition: all 0.3s ease;

    .gps-button {
      border-radius: ${props => props?.theme?.utils?.radius?.m}px;
      transition: all 0.3s ease;
      background: transparent;

      &:hover {
        transform: translateY(-2px) scale(1.05);
      }

      &:active {
        transform: translateY(-1px) scale(1.02);
      }
    }

    input {
      border-radius: ${props => props?.theme?.utils?.radius?.s}px;
      box-shadow: 0px 1px 4px 0px #0000001A;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
      }

      &:focus {
        border: 0px solid ${props => props.theme.colors.primary};
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
      }
    }
  }

  .internal_number {
    width: 100%;

    & + .zipcode {
      width: calc(50% - 8px);
    }

    &:has(+ .zipcode) {
      width: calc(50% - 8px);
      ${props => props.theme?.rtl
        ? css`
            margin-left: 16px;
          `
        : css`
            margin-right: 16px;
          `}
    }
  }

  .zipcode {
    width: 100%;
  }

  @media (min-width: 481px) {
    padding: 10px;
  }
`

export const AddressWrap = styled.div`
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-top: -11px;
  transition: all 0.3s ease;

  button {
    height: 41px;
    right: 1px;
    border: none;
    transition: all 0.3s ease;

    ${props => props.theme?.rtl && css`
      left: 1px;
      right: initial;
    `}

    svg {
      font-size: 18px;
      transition: all 0.3s ease;
    }

    &:hover svg {
      transform: scale(1.1);
    }
  }
`

export const WrapAddressInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;

  i {
    padding: 0px 10px;
    transition: all 0.3s ease;
  }

  svg {
    position: absolute;
    color: ${props => props.theme.colors.primary};
    top: 21px;
    left: 10px;
    font-size: 20px;
    transition: all 0.3s ease;
    ${props => props.theme?.rtl && css`
      right: 10px;
      left: initial;
    `}
  }

  input {
    background-position: left 10px center !important;
    background-repeat: no-repeat !important;
    background-size: 13px !important;
    padding: 7px 30px 7px 15px !important;
    transition: all 0.3s ease;
    ${props => props.theme?.rtl && css`
      padding: 7px 15px 7px 30px !important;
    `}
  }
`

export const AddressTagSection = styled.div`
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  margin: 14px 0 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  transition: all 0.3s ease;

  button {
    display: flex;
    align-items: center;
    gap: 7px;
    height: 38px;
    min-width: 0;
    padding: 0 16px;
    border: 1px solid ${props => props.theme.colors.gray200};
    color: ${props => props.theme.colors.darkGray};
    font-size: 14px;
    font-weight: 600;
    background-color: ${props => props.theme.colors.gray300};
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.25s ease;

    svg {
      font-size: 16px;
      min-width: 16px;
      color: ${props => props.theme.colors.darkGray};
      transition: all 0.25s ease;
    }

    span {
      display: flex;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: all 0.25s ease;
    }

    &:hover {
      border-color: ${props => props.theme.colors.primary};
      background-color: ${props => props.theme.colors.backgroundPage};
      color: ${props => props.theme.colors.primary};
      transform: translateY(-1px);
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.10);

      svg, span {
        color: ${props => props.theme.colors.primary};
      }
    }
  }

  button.active {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);

    svg, span {
      color: ${props => props.theme.colors.white};
    }

    &:hover {
      background-color: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.white};
      transform: translateY(-1px);

      svg, span {
        color: ${props => props.theme.colors.white};
      }
    }
  }
`

export const AddressTagsDivider = styled.div`
  width: 100%;
  display: flex;
  margin: 18px 0px 0px;
  transition: all 0.3s ease;

  p {
    margin-bottom: 0px;
    font-size: 15px;
    font-weight: 600;
    color: ${props => props.theme.colors.darkGray};
    transition: all 0.3s ease;
  }
`

export const WrapperMap = styled.div`
  width: 100%;
  height: 170px;
  margin-bottom: 10px;
  transition: all 0.3s ease;

  > div {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: ${props => props?.theme?.utils?.radius?.m}px;
    transition: all 0.3s ease;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`

export const WrapperSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  padding: 9px 10px;
  transition: all 0.3s ease;

  span {
    width: 100%;
    transition: all 0.3s ease;
  }
`
