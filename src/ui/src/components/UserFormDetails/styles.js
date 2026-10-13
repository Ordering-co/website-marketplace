import styled, { css } from 'styled-components'

export const FormInput = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  transition: all 0.3s ease;

  div.phone_number {
    width: 100%;
  }

  input.form {
    font-size: 16px;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border-radius: 15px;
    border-width: 0px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);
    transition: all 0.3s ease;

    &:disabled {
      background-color: rgba(239, 239, 239, 0.3);
      cursor: not-allowed;
    }

    &:focus {
      border: 1px solid ${props => props.theme.colors.darkGreen};
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    &:hover:not(:disabled) {
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
      transform: translateY(-1px);
    }
  }

  > button {
    width: 100%;
    padding: 7px 0;
    transition: all 0.3s ease;
  }

  @media (min-width: 769px) {
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
  }
`

export const ActionsForm = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  /* keep Save/Continue visible while the profile form scrolls on mobile */
  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    background-color: ${props => props.theme?.colors?.backgroundPage};
    padding: 10px 0;
    z-index: 10;
  }

  /* below 576px the fixed bottom NavigationBar (~65px, z-index 1005)
     sits at bottom:0 and covers this CTA. Lift it clear, matching the 
     offset used by the other mobile bottom bars. */
  @media (max-width: 575px) {
    bottom: 65px;
  }

  button {
    flex: 1;
    margin-top: 10px;
    padding: 7px 0px;
    width: 49%;
    font-weight: 600;
    box-sizing: border-box;
    transition: all 0.3s ease;
    border-radius: 12px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);

    &:disabled {
      cursor: not-allowed;
      transform: none;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    }

    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
    }

    &:not(:disabled):active {
      transform: translateY(-1px);
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.12);
    }

    &:nth-child(2) {
      margin-left: 10px;
    }

    &.edit-btn {
      flex: unset;
      height: 46px;
      width: unset;
      margin: 10px auto 0;
      padding: 0 30px;
      border-radius: 16px;
    }
  }

  ${props => props.theme?.rtl && css`
    button {
      &:nth-child(1) {
        margin-right: 0px;
      }
      &:last-child {
        margin-right: 5px;
      }
    }
  `}
`

export const SkeletonForm = styled.div`
  width: 100%;
  justify-content: center;
  height: auto;
  display: inline-flex;
  flex-wrap: wrap;
  padding: 0;
  margin-top: 0px;
  transition: all 0.3s ease;

  > * {
    width: 100%;
    margin: 10px 0;
    display: inline;
    height: 50px;
    transition: all 0.3s ease;

    span{
      border-radius: 16px;
      width: 100%;
      height: 100%;
    }
  }

  @media (min-width: 768px){
    justify-content: flex-start;
    > * {
      width: calc(50% - 10px);
      margin: 5px;
    }
  }
`

export const InputGroup = styled.div`
  width: 100%;
  transition: all 0.3s ease;

  p {
    font-weight: 500;
    font-size: 20px;
    color: ${props => props.theme.colors.darkTextColor};
    width: 100%;
    text-align: left;
    margin: 0 0 7px 0;
    transition: all 0.3s ease;
  }

  &:hover p {
    color: ${props => props.theme?.colors?.primary || props.theme.colors.darkTextColor};
  }
`

export const Divider = styled.div`
  background: #F8F9FA;
  height: 8px;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
`

export const InputPhoneNumberWrapper = styled(InputGroup)`
  .PhoneInput {
    margin-top: 10px;
    margin-bottom: 10px;
    gap: 15px;
    transition: all 0.3s ease;

    input {
      border: none;
      border-radius: 15px;
      transition: all 0.3s ease;

      &:focus {
        border: 1px solid ${props => props.theme.colors.darkGreen};
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
      }

      &:hover:not(:disabled) {
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
      }
    }

    .PhoneInputCountry {
      width: 90px;
      justify-content: space-evenly;
      border-radius: 15px;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.02);
      }
    }
  }
`

export const LanguageSelectorWrapper = styled(InputGroup)`
  margin-bottom: 20px;
`

export const PromotionsWrapper = styled.div`
  display: flex;
  margin: 10px 0;
  width: 100%;
  transition: all 0.3s ease;

  > label {
    font-size: 16px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-1px);
    }

    ${props => props.theme?.rtl
? css`
      margin-right: 7px;
    `
: css`
      margin-left: 7px;
    `}

    > span:first-child {
      font-weight: 500;
      transition: all 0.3s ease;
      ${props => props.theme?.rtl
? css`
        margin-left: 7px;
      `
: css`
        margin-right: 7px;
      `}
    }

    > a {
      color: ${props => props.theme.colors.primary} !important;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  @media (min-width: 768px) {
    > label {
      font-size: 16px;
    }
  }
`

export const NotificationsGroupSwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding: 15px 0;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  > p {
    margin: 0;
    font-weight: 500;
    font-size: 20px;
    color: ${props => props.theme.colors.darkTextColor};
    width: 100%;
    text-align: left;
    transition: all 0.3s ease;
  }

  &:hover > p {
    color: ${props => props.theme?.colors?.primary || props.theme.colors.darkTextColor};
  }
`

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid #E9ECEF;
  padding: 10px 10px;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 2px 0;

  &:hover {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  }

  p {
    font-size: 20px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  &:hover p {
    color: ${props => props.theme?.colors?.primary || '#000'};
  }
`
