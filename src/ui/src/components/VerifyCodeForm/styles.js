import styled from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  margin: 0px auto;
  max-width: 350px;

  > p {
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    margin-top: 0px;
    margin-bottom: 18px;
  }

  > button {
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    padding: 0px;
    color: ${props => props.theme.colors.links};
    text-decoration: none;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      background-color: transparent;
      color: ${props => darken(0.1, props.theme.colors.links)};
      text-decoration: underline;
    }
  }

  @media (min-width: 576px) {
    max-width: 500px;
  }
`

export const DownTimer = styled.h4`
  text-align: center;
  margin: 0px;
  font-weight: 400;
  font-size: 24px;
  line-height: 36px;
`

export const OtpWrapper = styled.div`
  padding-top: 18px;

  .otp-container {
    display: flex;
    justify-content: space-between;
    margin: 20px 0px;

    .otp-input {
      width: 50px !important;
      height: 55px;
      border: 1px solid ${props => props.theme?.colors.darkGray};
      border-radius: 7.6px;
      background-color: #FFF;
      outline: none;
      font-size: 20px;
      font-weight: bold;

      &:focus{
        border-color: ${(props) => darken(0.07, props.theme?.colors.darkGray)} !important;
      }

      &::placeholder,
      &::-webkit-input-placeholder {
        color: ${props => props.theme.colors.lightGray};
      }
      &:-ms-input-placeholder {
        color: ${props => props.theme.colors.lightGray};
      }
    }
  }

  @media (min-width: 576px) {
    .otp-container {
      .otp-input {
        width: 100px !important;
        height: 105px;
        font-size: 36px;
      }
    }
  }
`
