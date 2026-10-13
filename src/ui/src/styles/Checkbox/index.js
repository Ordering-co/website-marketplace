import styled, { css } from 'styled-components'

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  position: relative;
  cursor: pointer;
  width: 18px;
  height: 18px;
  border: none;
  transition: all 0.2s ease;

  &:before {
    content: "";
    display: block;
    position: absolute;
    width: 18px;
    height: 18px;
    top: 0;
    left: 0;
    border: 1px solid #CCC;
    border-radius: 2px;
    background-color: #FFF;
    transition: all 0.2s ease;
  }

  &:hover:before {
    transform: scale(1.05);
  }

  &:checked:before {
    content: "";
    display: block;
    position: absolute;
    width: 18px;
    height: 18px;
    top: 0;
    ${props => props.theme?.rtl
    ? css`
      right: 0;
    `
: css`
      left: 0;
    `}
    background-color: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.primary};
    box-shadow: 0 2px 8px ${props => props.theme.colors.primary}40;
  }

  &:checked:hover:before {
    transform: scale(1.05);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:disabled:before {
    border-color: #CCC;
    background-color: #F2F2F2;
    filter: grayscale(1);
  }

  &:disabled:hover:before,
  &:disabled:checked:hover:before {
    transform: none;
  }

  &:checked:after {
    content: "";
    display: block;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    position: absolute;
    top: 2px;
    ${props => props.theme?.rtl
? css`
      right: 7px;
    `
: css`
      left: 7px;
    `}
    transition: all 0.2s ease;
  }
`
