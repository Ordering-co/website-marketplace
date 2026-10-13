import styled, { css } from 'styled-components'

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${props => props.theme?.header?.components?.style?.backgroundColor};
`

export const InnerHeader = styled.div`
  display: flex;
  width: 100%;
  color: #FFF;
  justify-content: space-between;
  margin: 15px 0;
  align-items: center;

  #left-side {
    width: ${({ theme }) => theme?.header?.components?.layout?.type === 'starbucks' ? '30%' : '25%'};
    justify-content: flex-start;
  }
  #right-side {
    width: ${({ theme }) => theme?.header?.components?.layout?.type === 'starbucks' ? '30%' : '40%'};
    justify-content: flex-end;
  }
  #center-side {
    width: ${({ theme }) => theme?.header?.components?.layout?.type === 'starbucks' ? 'calc(60% - 140px)' : 'calc(60% - 30px)'};
  }

  @media (min-width: 768px) {
    #left-side {
      width: ${({ theme }) => theme?.header?.components?.layout?.type === 'starbucks' ? '30%' : 'initial'};
    }
    #center-side {
      width: calc(100% - 60px);
    }
  }

  @media (min-width: 1024px) {
    #center-side {
      width: calc(100% - 140px);
    }
  }

  @media (min-width: 1200px) {
    #center-side {
      width: calc(70% - 200px);
    }
  }

  @media (min-width: 1500px) {
    #center-side {
      width: calc(60% - 260px);
    }
  }
`

export const LogoHeader = styled.div`
  cursor: pointer;

  img {
    width: ${props => props.imgW ?? '35px'};
    height: ${props => props.imgH ?? '45px'};
    margin: 0;
    vertical-align: middle;
    margin-left: 10px;
    object-fit: contain;

    ${props => props.theme?.rtl && css`
      margin-right: 10px;
      margin-left: 0;
    `}

    @media (min-width: 769px) {
      ${({ theme }) =>
    ['center', 'right']?.includes(theme?.header?.components?.logo?.components?.layout?.position) && css`
        margin-right: 30px;
      `};
      width: ${props => props.imgW ?? '150px'};
    }
  }

  ${props => !props.disabledResponsive && css`
    img:nth-child(1) {
      display: none;
    }
  `}

  @media (min-width: 769px) {
    img:nth-child(1) {
      display: block;
    }
    img:nth-child(2) {
      display: none;
    }
  }
`

export const LeftHeader = styled.div`
  align-self: center;
  display: flex;
  align-items: center;
`

export const RightHeader = styled.div`
  align-self: center;
  display: flex;

  #select-input {
    div {
      color: ${props => props.theme.colors.darkTextColor};
    }
  }
`

export const Menu = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  #select-input {
    border-radius: 7.6px;

    #list {
      border-radius: 7.6px;
    }

    ${({ isCustomerMode }) => !isCustomerMode && css`
      margin: 0px 5px;
      height: 40px;

      svg {
        font-size: 16px;
      }

      > div:first-child {
        height: 100%;
        padding-left: 10px;
        padding-right: 10px;

        @media (min-width: 993px) {
          padding-left: 13px;
          padding-right: 13px;
        }
      }
    `}
  }
  .signup-button {
    border-radius: ${props => props.theme?.utils?.radius?.m}px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &.left-header {
    border: none;
    box-sizing: border-box;
    margin: 0 15px;
    flex-grow: 1;
    padding: 0 10px;
    display: flex;
    align-items: center;
    /* Keep the controls (order type, moment, address) packed tightly to the
       left as one group with a CONSTANT gap at every width, instead of drifting
       apart as the viewport widens ( / ). */
    justify-content: flex-start;
    gap: 16px;
    position: relative;
    height: 44px;

    @media (min-width: 1024px) {
      margin: 0 20px;
      padding: 0 0px;
    }
  }

  > span {
    #select-input {
      background: transparent !important;
    }
  }

  .moment-popover {
    height: 100%;
    justify-content: center;
    width: 200px;
    display: none;

    @media (min-width: 1175px) {
      width: 250px;
    }

    @media (min-width: 1400px) {
      width: 400px;
    }

    > div:first-child {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  .address-popover {
    flex-grow: 1;
    display: none;
    > div:first-child {
      width: 100%;
    }
  }


  @media (min-width: 850px) {
    .moment-popover,
    .address-popover {
      display: flex;
    }
  }
`

export const PinMapWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  width: 45px;
  background-color: ${props => props.theme?.colors.white};
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);
  border-radius: ${props => props.theme?.utils?.radius?.s}px;
  margin: 0 10px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #ffffff 0%, ${props => props.theme?.colors.grayDividerColor || '#f8f9fa'} 100%);
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.12);
    transform: scale(1.05) translateY(-1px);
  }

  &:active {
    transform: scale(1.02) translateY(0);
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
  }

  svg {
    font-size: 19px;
    color: ${props => props.theme?.colors.black};
  }
`

export const AddressMapInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 10px;

  .address-map-icon {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .address-map-info-item {
    display: flex;
    align-items: flex-start;
    padding: 10px 0;

    p {
      font-size: 14px;
      margin: 0;
    }

    svg {
      font-size: 18px;
      margin-right: 10px;
      margin-top: 5px;
    }
  }

  .explore-button {
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      margin-top: 20px;
      width: 100%;
      height: 55px;
      border-radius: ${props => props.theme.utils.radius.m}px;
    }
  }
`

export const MenuItem = styled.div`
  display: flex;
`

export const MenuLink = styled.a`
  text-decoration: none;
  font-size: 16px;
  padding: 10px;
  color: #000;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`

export const SubMenu = styled(InnerHeader)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0px 20px 7px;
  box-sizing: border-box;
  margin: 0px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: 850px) {
    display: none;
  }
`

export const CustomerInfo = styled.div`
  display: none;
  cursor: pointer;
  flex: 1;
  position: relative;
  @media (min-width: 450px) {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      display: flex;
      align-items: center;
      margin: 0;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: ${props => props.theme?.colors.darkGray};
      }
      svg {
        color: #748194;
        margin: 0;
        font-size: 20px;
        position: absolute;
        right: 0;
      }
    }
  }
`

export const UserEdit = styled.div`
  > :first-child{
     margin-bottom: 20px;
  }
`

export const AddressMenu = styled.div`
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors?.headingColor};
  display: flex;
  align-items: center;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  span {
    width: 85%;
    p {
      margin: 0;
      padding: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  ${({ isCustomerMode }) => isCustomerMode
? css`
    flex: 0.8;
  `
: css`
    width: 50%;
  `}

  svg {
    color: ${props => props.theme.colors?.primary};
    font-size: 16px;
    margin-right: 10px;
    ${props => props.theme?.rtl && css`
      margin-left: 10px;
      margin-right: 0;
    `}
  }
  @media (min-width: 765px) {
    ${({ isCustomerMode }) => !isCustomerMode && css`
      width: 80%;
    `}
  }
  /* Keep the address a compact, fixed-ish box from tablet up so it doesn't
     resize/jump between breakpoints (which pushed the header controls apart).
     ~280px shows "316 West Washingto…" truncated, matching the other controls. */
  @media (min-width: 820px) {
    ${({ isCustomerMode }) => !isCustomerMode && css`
      width: auto;
      max-width: 280px;
      flex-shrink: 0;
    `}
  }
`

export const MomentMenu = styled.div`
  height: 100%;
  display: none;

  /* Content-width box (was a fixed 175/250/400px box with the ASAP pill
     centered, which left growing empty space around it as the viewport widened
     — ). Now it packs tight next to the other header controls.
     No align-items override: the default stretch keeps the inner pill the
     full 44px height so it matches the order-type toggle. */
  @media (min-width: 850px) {
    display: flex;
  }

  > div {
    background-color: #F8F9FA;
    cursor: pointer;
    font-size: 14px;
    color: ${props => props.theme?.colors.black};
    display: flex;
    align-items: center;
    text-align: center;
    white-space: nowrap;
    padding: 0 15px;
    border-radius: ${props => props.theme?.utils?.radius?.s}px;
    font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    &:active {
      transform: translateY(0);
    }

    svg {
      margin-left: 15px;
    }
  }
`

export const AddressWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const FarAwayMessage = styled.div`
  pointer-events: none;
  position: absolute;
  display: flex;
  align-items: center;
  z-index: 2000;
  /* Anchor to the address (AddressWrapper is position:relative and wraps only
     the address): sit just below it with the caret pointing up at it. The old
     hardcoded left:210px detached the bubble from the address. */
  top: 100%;
  left: 0;
  background: ${props => props.theme.colors.black};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.12);
  border-radius: 20px;
  padding: 6px 15px;
  box-sizing: border-box;
  margin: 10px 0px 0px 0px !important;

  ${props => props.theme?.rtl && css`
    right: 0;
    left: initial;
  `}

  svg {
    position: absolute;
    top: -13px;
    left: 25px;
    font-size: 20px;
    color: ${props => props.theme.colors.black};
    margin-right: 10px;
    ${props => props.theme?.rtl && css`
      margin-right: auto;
      margin-left: 10px;
      left: initial;
      right: 25px;
    `}
  }
  span {
    font-size: 12px;
    line-height: 18px;
    color: ${props => props.theme.colors.white};
  }

  @media (min-width: 400px) {
    padding: 10px 20px;
    font-size: 14px;
    line-height: 24px;
  }
  @media (min-width: 850px) {
    width: 360px;
    padding: 10px 20px;
    font-size: 14px;
    line-height: 24px;
  }
`

export const Divider = styled.div`
  border: 1px solid ${props => props.theme?.colors.darkGray};
  height: 100%;
`
export const AddressFormWrapper = styled.div`
  @media (min-width: 450px) {
    margin-top: 20px;
  }
`
export const InputGroup = styled.div`
  p {
    font-weight: 500;
    font-size: 20px;
    color: ${props => props.theme.colors.darkTextColor};
    width: 100%;
    text-align: left;
    margin: 0 0 7px 0;
  }
`

export const LanguageSelectorWrapper = styled(InputGroup)`
  > div {
    border-radius: 7.6px;
    text-align: left;
    background: #F8F9FA !important;
    border-color: #F8F9FA;
    background-color: #F8F9FA !important;
    height: 44px;

    > div:first-child {
      height: 44px;
    }

    #list {
      border-radius: 7.6px;
      background: #F8F9FA !important;
      border-color: #F8F9FA;
    }
  }
  #select-input {
    margin-left: 5px;
  }
`

export const HeaderSearchMode = styled.div`
  display: flex;
  justify-content: center;
  width: 300px;
  a {
    text-decoration: none;
  }
  input {
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }
  @media (min-width: 1400px){
    width: 350px;
  }
  @media (min-width: 1200px){
    width: 300px;
    div {
      > span {
        padding: 7px 0;
      }
    }
  }
`

export const LeftSide = styled.div`
  display: flex;
  width: 100%;
  @media (min-width: 769px){
    flex-direction: ${({ theme }) =>
    ['center', 'right']?.includes(theme?.header?.components?.logo?.components?.layout?.position) ? 'row-reverse' : 'row'};
    width: 64%;
  }
`

export const AddressOrderTypeContainer = styled.div`
`
