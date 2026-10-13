import styled, { css } from 'styled-components'

export const ForgotPasswordContainer = styled.div`
  width: 100%;
  height: ${({ isPopup }) => isPopup ? '100vh' : 'auto'};
  height: ${({ isPopup }) => isPopup ? '100dvh' : 'auto'}; /* dvh = visible viewport under mobile URL bars (vh fallback above) */

  h1 {
    font-weight: 600;
    font-size: 24px;
    margin-top: 0;
    margin-bottom: 30px;
    text-align: center;
  }
  @media (min-width: 992px) {
    height: 100%;
    min-height: ${({ isPopup }) => isPopup ? '500px' : 'calc(100vh - 65px)'};
    min-height: ${({ isPopup }) => isPopup ? '500px' : 'calc(100dvh - 65px)'};
  }
`
const Side = styled.div`
  display: flex;
  width: 100%;
`

export const FormSide = styled(Side)`
  flex-direction: column;
  align-items: center;
  margin-top: 30px;

  @media (min-width: 992px) {

    margin: auto;
    font-size: ${({ isPopup }) => isPopup ? '12px' : '1em'};
  }
`

export const FormInput = styled.form`
  width: ${({ isPopup }) => isPopup ? '95%' : '80%'};
  display: flex;
  flex-direction: column;

  button {
    margin: 10px 0;
    padding: 5px;
  }
`

// Mirrors the standardized input style used across the app (LoginForm,
// SignUpForm): full-width field with the shared box-shadow so the Forgot
// Password email field matches the rest of the app.
export const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 5px;

  input {
    box-sizing: border-box;
    width: 100%;
    padding-right: 40px !important;
    padding-left: 20px !important;
    margin: 10px 0;
    box-shadow: 0px 1px 4px 0px #0000001A;
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

    ${props => props.theme?.rtl && css`
      margin-left: 5px;
      margin-right: 0px;
    `}
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
  }

  * {
    margin: 0px;
    padding: 0px;
  }

  ${({ register }) => register && css`
    width: calc(95% - 20px);

    @media (min-width: 481px) {
      width: ${({ isPopup }) => isPopup ? 'calc(95% - 20px)' : 'calc(80% - 20px)'};
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

export const ReCaptchaWrapper = styled.div`
  margin: 12px auto;
`

export const ValidationText = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.colors.danger500};
  padding: 0px 10px;
`
