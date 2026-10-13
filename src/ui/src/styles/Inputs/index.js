import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { Button } from '../Buttons'

export const Input = styled.input`
  background: #FFF;
  color: #010300;
  border: 0px solid #DBDCDB;
  border-radius: ${props => props?.theme?.utils?.radius?.s}px;
  font-size: 16px;
  padding: 12px 20px;
  outline: none;
  &:focus {
    border-color: ${() => darken(0.07, '#CCC')};
  }
  ${({ w }) => w && css`
    width: 20%;
  `}
  &::placeholder,
  &::-webkit-input-placeholder {
    color: #9FA2A0;
  }
  &:-ms-input-placeholder {
    color: #9FA2A0;
  }
  ${({ borderBottom }) => borderBottom && css`
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #E9ECEF;
  `}
  ${({ isError }) => isError && css`
    border-color: ${props => props.theme.colors?.danger500} !important;
  `}

  ${({ theme }) => theme?.general?.components?.inputs?.borderRadius && css`
    border-radius: ${theme?.general?.components?.inputs?.borderRadius};
  `}

  ${({ theme }) => theme?.general?.components?.inputs?.color && css`
    color: ${theme?.general?.components?.inputs?.color};
  `}

  ${({ theme }) => theme?.general?.components?.inputs?.borderColor && css`
    border: 1px solid ${theme?.general?.components?.inputs?.borderColor};
    &::placeholder,
    &::-webkit-input-placeholder,
    &:-ms-input-placeholder {
      color: ${theme?.general?.components?.inputs?.borderColor};
    }
  `}
`

export const InputGroup = styled.div`
  display: flex;
  & > ${Input}:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 0;
    padding-left: 0;
  }
  & > ${Input}:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
    padding-right: 0;
  }
`

export const InputGroupLeft = styled.div`
  line-height: 34px;
  padding-left: 7px;
  padding-right: 7px;
  font-size: 16px;
  border-width: 1px;
  height: 34px;
  border-style: solid;
  ${props => props.theme?.rtl
    ? css`
      border-left-width: 0;
      border-radius: 34px 34px 0 0;
  `
: css`
      border-radius: 34px 0 0 34px;
      border-right-width: 0;
  `}
  & ${Button} {
    margin-left: -7px;
    ${props => props.theme?.rtl && css`
        margin-right: -7px;
        margin-left: 0;
    `}
  }
`

export const TextArea = styled.textarea`
  background: #FFF;
  color: #010300;
  border: 0px solid #DBDCDB;
  box-shadow: 0px 1px 4px 0px #0000001A;
  border-radius: 15px;
  font-size: 16px;
  padding: 20px 20px;
  /* keep content-box here. box-sizing:border-box made this shared
     control fold its 40px vertical padding into every consumer's fixed
     height/min-height, shrinking order-comment boxes ~40px on all viewports.
     The width-overflow case is handled by the few consumers that
     set width:100% (they declare their own box-sizing / are flex-stretched). */
  outline: none;
  resize: none;
  &:focus {
    border-color: ${() => darken(0.07, '#CCC')};
  }
  ${({ w }) => w && css`
    width: 20%;
  `}
  &::placeholder,
  &::-webkit-input-placeholder {
    color: #9FA2A0;
  }
  &:-ms-input-placeholder {
    color: #9FA2A0;
  }

  ${({ theme }) => theme?.general?.components?.inputs?.borderRadius && css`
    border-radius: ${theme?.general?.components?.inputs?.borderRadius};
  `}

  ${({ theme }) => theme?.general?.components?.inputs?.color && css`
    color: ${theme?.general?.components?.inputs?.color};
  `}

  ${({ theme }) => theme?.general?.components?.inputs?.borderColor && css`
    border: 1px solid ${theme?.general?.components?.inputs?.borderColor};
    &::placeholder,
    &::-webkit-input-placeholder,
    &:-ms-input-placeholder {
      color: ${theme?.general?.components?.inputs?.borderColor};
    }
  `}
`

export const InputGroupRight = styled(InputGroupLeft)`
  border-radius: 0 34px 34px 0;
  line-height: 34px;
  border-right-width: 1px;
  border-left-width: 0;
  ${props => props.theme?.rtl && css`
        border-left-width: 1px;
        border-right-width: 0;
        border-radius: 0 0 34px 34px;
    `}
  & ${Button} {
    margin-left: 0;
    margin-right: -7px;
    ${props => props.theme?.rtl && css`
        margin-left: -7px;
        margin-right: 0;
    `}
  }

`

export const InputPrimary = styled(Input)`
  background: #FFF;
  color: ${props => props.theme.colors.primary};
  border-color: ${props => props.theme.colors.primary};
  &:focus {
    border-color: ${props => darken(0.1, props.theme.colors.primary)};
  }
`

export const InputSecundary = styled(Input)`
  background: #FFF;
  color: ${props => props.theme.colors.secundary};
  border-color: ${props => props.theme.colors.secundary};
  &:focus {
    border-color: ${props => darken(0.1, props.theme.colors.secundary)};
  }
`
export const InputGroupPrimary = styled(InputGroup)`
  & > ${InputGroupLeft} {
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
  }
`
