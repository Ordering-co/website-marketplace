import styled, { css } from 'styled-components'

export const SignUpContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  ${({ isPopup }) => !isPopup && css`
    min-height: calc(100vh - 65px);
    min-height: calc(100dvh - 65px); /* dvh = visible viewport under mobile URL bars (vh fallback above) */
  `}
  padding: 0 10px;
  box-sizing: border-box;

  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`
const Side = styled.div`
  display: flex;
  width: 100%;
`

export const FormSide = styled(Side)`
  flex-direction: column;
  align-items: flex-start;
  margin: auto;

  @media (min-width: 992px) {
    font-size: ${({ isPopup }) => isPopup ? '12px' : '1em'};
  }

  @media (min-width: 1200px){
    font-size: ${({ isPopup }) => isPopup ? '0.9em' : '1em'};
  }
`

export const FormInput = styled.form`
  width: ${({ isPopup }) => isPopup ? '100%' : '80%'};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  input {
    &::placeholder, .PhoneInputInput::placeholder {
      color: ${props => props.theme.colors?.lightGray} !important;
    }

    &:-ms-input-placeholder, .PhoneInputInput:-ms-input-placeholder {
      color: ${props => props.theme.colors?.lightGray} !important;
    }

    &::-ms-input-placeholder, .PhoneInputInput::-ms-input-placeholder {
      color: ${props => props.theme.colors?.lightGray} !important;
    }
  }

  div.phone_number {
    margin: 10px 0px;
    width: 100%;
  }

  input.form:not(:last-child) {
    margin: 10px 0px;
    padding: 12px 20px;
  }

  button {
    margin-top: 10px;
    padding: 12px 5px;
    border-radius: ${props => props?.theme?.utils?.radius?.m}px;
    width: 100%;
  }
`

export const RedirectLink = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0px;
  font-size: 17px;

  span {
    margin-right: 5px;
    color: black;

    ${props => props.theme?.rtl && css`
      margin-left: 5px;
      margin-right: 0px;
    `}
  }

  a {
    color: ${props => props.theme.colors.primary} !important;
    text-decoration: none;
    &:link, &:visited {
      color: ${props => props.theme.colors.primary} !important;
    }
    &:hover {
      text-decoration: underline !important;
    }
  }

  * {
    margin: 0px;
    padding: 0px;
  }

  ${({ register }) => register && css`
    width: calc(95% - 20px);

    @media (min-width: 481px) {
      width: ${({ isPopup }) => isPopup ? 'calc(100% - 20px)' : 'calc(80% - 20px)'};
    }
  `}

  @media (min-width: 425px) {
    flex-direction: row;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 992px) {
    font-size: ${({ isPopup }) => isPopup ? '13px' : '18px'};
    flex-direction: row;
  }

  @media (min-width: 1200px) {
    ${({ isPopup }) => isPopup && css`
      font-size: 16px;
    `};
  }
`

export const SocialButtons = styled.div`
  width: ${({ isPopup }) => isPopup ? '100%' : '80%'};
  margin-top: 20px;

  ${({ isPopup }) => isPopup && css`
    display: flex;
    flex: 1;
    gap: 20px;
  `}

  button {
    border: 2px solid #000000;
    width: 100%;
    height: fit-content;
    min-height: 60px;
    padding: 6px 5px;
    border-radius: ${props => props?.theme?.utils?.radius?.m}px;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-align: center;

    img {
      width: 30px;
    }
  }
`

export const Title = styled.h1`
  font-weight: 600;
  font-size: 36px;
  margin-top: 0;
  margin-bottom: 30px;
  color: ${props => props.theme.colors.darkTextColor};
`

export const SkeletonWrapper = styled.div`
  span{
    margin: 10px 0;
    border-radius: 30px;
  }
`

export const SkeletonSocialWrapper = styled(SkeletonWrapper)`
  width: ${({ isPopup }) => isPopup ? '100%' : '80%'};
  span{
    margin-top: 0;
  }
`

export const WrapperPassword = styled.div`
  width: 100%;
  position: relative;
  input {
    box-shadow: 0px 1px 4px 0px #0000001A;
    box-sizing: border-box;
    width: 100%;
    padding-right: 40px !important;
    padding-left: 20px !important;
  }
`

export const TogglePassword = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  font-weight: 300;
  color: #333;
  font-size: 24px;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.theme?.rtl && css`
    right: auto;
    left: 15px;
  `}
  span{
    cursor: pointer;
  }
  svg {
    font-size: 16px;
    color: ${props => props.theme.colors.lightGray};
  }
`

export const ReCaptchaWrapper = styled.div`
  margin: 12px auto;
`
export const LoginDivider = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin: 30px 0;

  p {
    margin: 0;
    width: 70px;
    font-size: 14px;
    color: #748194;
    text-align: center;
  }
`

export const DividerLine = styled.div`
  height: 1px;
  background: #E9ECEF;
  flex-grow: 1;
`

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin: 5px 0px;


  @media (min-width: 800px) {
    ${({ isHalf }) => isHalf && css`
      width: 48%;
    `}
  }
`
export const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  input{
    box-shadow: 0px 1px 4px 0px #0000001A;
    box-sizing: border-box;
    width: 100%;

    ${props => props.theme.rtl
? css`
      padding-right: 20px !important;
    `
: css`
      padding-left: 20px !important;
    `}
    margin: 10px 0;
  }
`
export const InputBeforeIcon = styled.div`
  position: absolute;
  top: 0px;
  left: 15px;
  display: flex;
  align-items: center;
  height: 100%;

  ${props => props.theme?.rtl && css`
    right: 15px;
    left: initial;
  `}

  svg {
    font-size: 16px;
    color: ${props => props.theme.colors.lightGray};
  }
`

export const TermsConditionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;

  > label {
    font-size: 14px;
    ${props => props.theme?.rtl
? css`
      margin-right: 7px;
    `
: css`
      margin-left: 7px;
    `}

    > span:first-child {
      font-weight: 500;
      ${props => props.theme?.rtl
? css`
        margin-left: 7px;
      `
: css`
        margin-right: 7px;
      `}
    }

    > a {
      font-weight: 900;
      color: ${props => props.theme.colors.primary} !important;
    }
  }

  @media (min-width: 768px) {
    > label {
      font-size: 16px;
    }
  }
`

export const PromotionsWrapper = styled(TermsConditionWrapper)``

export const BussinessAndDriverSignUp = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 20px;

  button:first-child {
    margin-bottom: 10px;
  }

  @media (min-width: 993px) {
    flex-direction: row;
    button:first-child {
      margin-bottom: 0px;
    }
  }

  button {
    width: 100%;
    margin-top: 15px;
    padding: 5px;
    margin: 0 10px;
  }
`

export const CheckboxArea = styled.div`
  padding: 20px 0px;
`

export const ValidationText = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.colors.danger500};
`
