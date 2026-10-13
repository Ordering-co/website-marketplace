import styled, { css } from 'styled-components'

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  min-height: auto;
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    flex-direction: row;
  }

  @media (min-width: 993px) {
    min-height: calc(100vh - 337px);
    box-sizing: border-box;
  }
`

export const WrapperLeftContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0px 20px 10px;
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    width: 52%;
    padding: 55px 60px 55px 40px;
  }

  @media (min-width: 820px) {
    padding: 30px 60px 55px 40px;
  }
`

export const WrapperRightContainer = styled.div`
  width: 100%;
  border-left: 1px solid #E9ECEF;
  box-sizing: border-box;
  padding: 10px 20px;
  transition: all 0.3s ease;

  .paymentsContainer {
    margin-top: -20px;
  }

  @media (max-width: 575px) {
    padding-bottom: 96px;
  }

  @media (min-width: 769px) {
    width: 48%;
    padding: 10px 40px 100px;

    .paymentsContainer {
      margin-top: 20px;
    }
  }
`

export const WrapperUserDetails = styled.div`
  width: 100%;
  transition: all 0.3s ease;

  h1 {
    font-size: 17px !important;
    font-weight: 700 !important;
  }
`

export const UserDetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 15px;
  transition: all 0.3s ease;

  ${({ guestForm }) => guestForm && css`
    margin-top: 25px;
    padding-bottom: 20px;
  `}
`

export const BusinessDetailsContainer = styled(UserDetailsContainer)`
  margin-top: 15px;
  border: none;
  margin-bottom: 10px;
  flex-direction: column;
  transition: all 0.3s ease;

  .business-details-header > div {
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;

    h1 {
      text-transform: capitalize;
      margin: 0px;
      font-weight: 700;
      font-size: 20px;
      color: ${props => props.theme.colors.black};
    }
    p {
      font-size: 14px;
      margin: 5px 0;
      color: ${props => props.theme.colors.black};
    }

    img {
      width: 56px;
      height: 56px;
      border-radius: 15px;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }
  .business-details-container {
    font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;

    p {
      color: ${props => props.theme.colors.black};
      margin: 5px 0;
    }
  }
`

export const PaymentMethodContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  transition: all 0.3s ease;

  h1 {
    margin: 0px;
    font-weight: 500;
    font-size: 20px;
    color: ${props => props.theme.colors.darkTextColor};
  }
`

export const DriverTipContainer = styled(PaymentMethodContainer)`
  margin: 20px 0px 0px;
  transition: all 0.3s ease;

  h1 {
    font-size: 16px;
    font-weight: 600;
  }
  > p {
    margin: 0;
    font-size: 14px;
    font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
    color: ${props => props.theme?.colors.darkGray};
  }
`

export const CartContainer = styled(PaymentMethodContainer)`
  margin: 20px 0px 0px;
  margin-bottom: 20px;
  position: relative;
  transition: all 0.3s ease;

  ${({ hideOrderBill }) => hideOrderBill && css`
    margin-top: 0px;
    margin-bottom: 0px;
  `}

  ${({ hideProductList }) => hideProductList && css`
    background-color: ${props => props?.theme?.colors?.gray300};
    border-radius: 20px;
    padding: 5px 20px 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `}

  ${({ isGiftCardCart }) => isGiftCardCart && css`
    padding: 10px 20px 0px;
    table .subtotal td {
      padding: 0px;
    }
  `}
`

export const WalletPaymentOptionContainer = styled(PaymentMethodContainer)`
  margin: 20px 0px 0px;
  transition: all 0.3s ease;

  h1 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
`

export const WrapperPlaceOrderButton = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 80px;
  transition: all 0.3s ease;

  > div {
    width: 100%;
    display: flex;
    justify-content: center;

    button {
      font-size: 18px;
      font-weight: 600;
      padding: 5px 20px;
      cursor: pointer;
      border-radius: 30px;
      height: 60px;
      width: 100%;
      max-width: 480px;
      line-height: 32px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
`

export const WarningMessage = styled.div`
  width: 100%;
  height: fit-content;
  max-height: fit-content;
  min-height: 150px;
  background-color: #F2BB40;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  border-radius: 10px;
  position: relative;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(242, 187, 64, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(242, 187, 64, 0.4);
  }

  svg {
    position: absolute;
    font-size: 30px;
    top: 0;
    left: 0;
    margin: 11px;
    transition: all 0.3s ease;
    ${props => props.theme?.rtl && css`
        right: 0;
        left: initial;
    `}
  }

  h1 {
    font-size: 20px;
    margin: 0px 60px;
    text-align: center;
  }
`

export const NotFoundImage = styled.div`
  max-width: 300px;
  transition: all 0.3s ease;

  img {
    width: 300px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }
`

export const CartsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: auto;
  transition: all 0.3s ease;

  @media (min-width: 381px) {
    width: 80%;
  }
`

export const WarningText = styled.p`
  margin: 10px auto;
  text-align: center;
  color: ${props => props.theme.colors.primary};
  transition: all 0.3s ease;
`

export const WrapperLeftContent = styled.div`
  width: 100%;
  transition: all 0.3s ease;

  .checkout-title {
    margin: 0;
    font-weight: 600;
    font-size: 32px;
    color: ${props => props.theme?.colors.darkTextColor};
  }
`

export const CheckOutDivider = styled.div`
  height: 1px;
  width: calc(100%);
  background: #E9ECEF;
  transition: all 0.3s ease;
`

export const DeliveryOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  gap: 10px;
  transition: all 0.3s ease;

  h2 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .delivery-options-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  button {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    max-width: 440px;
    height: 50px;
    border-width: 1px;
    transition: all 0.25s ease;
    border-radius: 8px;
    box-shadow: none;
    background: ${props => props.theme.colors.primary} !important;
    color: ${props => props.theme.colors.primaryContrast} !important;
    border-color: ${props => props.theme.colors.primary};

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
    }

    &:active {
      transform: translateY(0);
    }

    &.inactive {
      background: ${props => props.theme.colors.gray300} !important;
      color: ${props => props.theme.colors.black} !important;
      border-color: ${props => props.theme.colors.gray200};

      &:hover {
        background: ${props => props.theme.colors.backgroundPage} !important;
        border-color: ${props => props.theme.colors.primary};
        color: ${props => props.theme.colors.primary} !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
      }
    }
  }
`

export const CartHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  transition: all 0.3s ease;

  h1 {
    font-weight: 600;
    font-size: 20px;
    line-height: 30px;
  }

  span {
    font-size: 13px;
    color: ${props => props.theme.colors.primary};
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;

    &:hover {
        text-decoration: underline;
        transform: translateY(-1px);
      }
  }

  h1, span {
    margin: 5px 0px;
  }

  @media (min-width: 300px) {
    flex-direction: row;
    align-items: center;
  }
`

export const SelectSpotContainer = styled.div`
  transition: all 0.3s ease;
`

export const WrapperActionsInput = styled.div`
  transition: all 0.3s ease;

  input {
    width: 100%;
    transition: all 0.3s ease;

    &:focus {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  h1 {
    font-size: 20px;
  }
`

export const MobileWrapperPlaceOrderButton = styled.div`
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  background-color: white;
  padding: 15px 25px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  z-index: 1006;
  box-shadow: 0px 4px 10px rgb(0 0 0 / 12%);
  transition: all 0.3s ease;

  button {
    width: 100%;
    min-height: 44px;
    border-radius: 7.6px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
`

export const MobilePlaceOrderHint = styled.p`
  margin: 0;
  text-align: center;
  font-size: 13px;
  line-height: 1.3;
  color: ${props => props.theme.colors.primary};
`

export const OrderContextUIWrapper = styled.div`
  flex: 1;
  margin-left: 15px;
  max-width: 85%;
  transition: all 0.3s ease;

  ${props => props.theme.rtl && css`
    margin-left: 0px;
    margin-right: 15px;
  `}

  @media (min-width: 480px) {
    max-width: 90%;
  }
`

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  transition: all 0.3s ease;

  .back-arrow {
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(-2px);
      color: ${props => props.theme.colors.primary};
    }
  }
`

export const AuthButtonList = styled.div`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  h2 {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 3px;
  }

  button {
    width: 100%;
    height: 44px;
    margin-top: 22px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
`

export const Flag = styled.span`
  font-size: 13px;
  margin: 0px 10px 0px 0px;
  text-transform: capitalize;
  color: #E63757;
  font-weight: 500;
  transition: all 0.3s ease;

  p {
    margin: 0;
    color: #344050;
  }

  @media (min-width: 381px) {
    font-size: 14px;
  }
`

export const SectionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;

  h1 {
    margin: 0px;
    font-size: 18px;
    font-weight: 600;
  }
`

export const OrderDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 30px 20px;
  transition: all 0.3s ease;
`

export const SpinnerContainer = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: -100%;
  transition: all 0.3s ease;
`

export const SummaryAccordion = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
`

export const NoPaymentNeededMsg = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;

  p {
    margin: 5px 0 0 0;
    font-size: 14px;
    color: ${props => props.theme.colors.gray};
  }
`

export const SummaryAccordionHeader = styled.div`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      transform: translateY(-1px);
    }

    > span {
      font-weight: 600;
      font-size: 18px;
    }

    svg {
      transition: transform 0.3s ease;
      transform: ${props => props.active ? 'rotate(180deg)' : 'rotate(0)'};
    }

    .align-content {
      display: flex;
      align-items: center;

      button {
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
        }
      }
    }

    ${({ isPayment }) => isPayment && css`
      padding: 15px 0px 5px;
    `}
  }

  .content {
    padding: 0px;
    transition: all 0.3s ease-in-out;
    opacity: ${props => props.active ? '0' : '1'};
    max-height: ${props => props.active ? '0' : '1000px'};
    overflow: ${props => props.active ? 'hidden' : 'visible'};

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 400;
    }
  }
`

export const SummaryAccordionContent = styled.div`
  max-height: ${props => props.active ? '1000px' : '0'};
  opacity: ${props => props.active ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  transform-origin: bottom;
`

export const CardItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  font-weight: bold;
  margin-top: 15px;
  transition: all 0.3s ease;
  padding: 10px 8px 10px 10px;
  border-radius: 8px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  span {
    display: flex;
  }

  img {
    width: 35px;
    height: 35px;
    transition: all 0.3s ease;
  }

  .card-number {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: ${(props) => props.theme?.utils?.tsize?.s}px;
    transition: all 0.3s ease;

    p {
      margin: 0;
      padding-right: 5px;
      font-weight: 900;
    }
  }

  .brand {
    width: 50px;
    height: 44px;
    border-radius: 10px;
    border: 1px solid ${props => props?.theme?.colors?.gray200};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    svg {
      font-size: 26px;
      transition: all 0.3s ease;
    }
  }

  .payment-container {
    flex: 1;
    min-width: 0;
    transition: all 0.3s ease;
  }

  .payment-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;

    span {
      font-size: 15px;
      font-weight: 500;
    }
  }

  .brand {
    margin-right: 10px;
    flex-shrink: 0;
    ${props => props.theme?.rtl && css`
      margin-left: 10px;
      margin-right: 0;
    `}
  }

  .card-delete-action {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: 8px;
    padding: 4px 2px 4px 4px;
    cursor: pointer;
    overflow: visible;
  }
`
