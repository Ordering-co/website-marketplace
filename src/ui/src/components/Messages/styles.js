import styled, { css } from 'styled-components'
import { darken } from 'polished'

export const MessagesContainer = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 15px;
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    padding: 0 40px;
  }

  ${({ profileMessages }) => profileMessages && css`
    padding: 0 !important;
  `};
`

export const HeaderProfile = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #EEEEEE;
  height: 70px;
  box-sizing: border-box;
  transition: all 0.3s ease;

  ${({ active }) => active && css`
    background: ${props => props.theme?.colors.grayDividerColor};
  `}

  ${({ isCursor }) => isCursor && css`
    cursor: pointer;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  `}

  div {
    transition: all 0.3s ease;

    p {
      margin-left: 10px;
      transition: all 0.3s ease;
      ${props => props.theme?.rtl && css`
        margin-right: 10px;
        margin-left: 0px;
      `}
    }

    strong {
      p{
        margin-block-end: 0.1em;
        transition: all 0.3s ease;
      }
    }

    p {
      margin-block-start: 0.1em;
      font-size: 0.7em;
      transition: all 0.3s ease;
    }
  }
`

export const HeaderName = styled.p`
  font-size: 1.1em;
  margin-block-end: 0.1em;
  margin-block-start: 0.1em;
  transition: all 0.3s ease;
`

export const Status = styled.p`
  margin-block-start: 0.1em;
  margin-block-end: 0.1em;
  font-size: 0.7em;
  transition: all 0.3s ease;
`

export const Image = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7.6px;
  padding: 5px;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #F5F5F5;
    transition: all 0.3s ease;
  }

  img[name]{
    border: 1px solid #D81212;
    border-radius: 50%;
  }

  svg {
    width: 36px;
    height: 36px;
    transition: all 0.3s ease;
  }
`

export const HeaderOnline = styled.div`
  display: flex;
  flex-direction: column;
  height: 36px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  margin-left: 10px;
  transition: all 0.3s ease;

  ${props => props.theme?.rtl && css`
    margin-right: 10px;
    margin-left: 0px;
    text-align: right;
  `}

  h1,
  span {
    margin: 0px;
    transition: all 0.3s ease;
  }

  h1 {
    font-weight: 600;
    font-size: 14px;
  }

  span {
    font-size: 10px;
    font-weight: 300;
  }
`

export const Chat = styled.div`
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 490px);
  min-height: 400px;
  flex-direction: column;
  padding: 0 20px;
  transition: all 0.3s ease;

  > :first-child{
    margin-top: 10px;
  }

  @media (min-width: 769px){
    min-height: 160px;
    height: calc(60vh - 90px);
    ${({ profileMessages }) => profileMessages && css`
      height: calc(100vh - 295px);
    `};
  }
`

export const MessageConsole = styled.div`
  width: 100%;
  display: inline-flex;
  justify-content: center;
  font-size: 0.8em;
  border-radius: 60px;
  transition: all 0.3s ease;
`

export const MessageBusiness = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 0.8em;
  transition: all 0.3s ease;
`

export const MessageCustomer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-wrap: wrap;
  font-size: 0.8em;
  transition: all 0.3s ease;
`

export const BubbleConsole = styled.div`
  border-radius: 5px;
  padding: 5px 15px;
  max-width: 40%;
  margin-bottom: 15px;
  background: ${props => props.theme?.colors.gray300};
  text-align: center;
  height: auto;
  overflow: hidden;
  overflow-wrap: break-word;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  @media (min-width: 1024px){
    max-width: 30%
  }
`

export const BubbleBusines = styled.div`
  border-radius: 32px 32px 32px 4px;
  padding: 10px 25px 10px 25px;
  max-width: 60%;
  min-width: 80px;
  margin-bottom: 10px;
  background: ${props => props.theme?.colors.gray300};
  overflow: hidden;
  overflow-wrap: break-word;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  &[name=image]{
    border-radius: 32px 32px 32px 4px;
    width: 100%;
  }

  ${props => props.theme?.rtl && css`
    border-radius: 32px 32px 4px 32px;
  `}

  @media (min-width: 480px) {
    border-radius: 32px 32px 32px 4px;

    ${props => props.theme?.rtl && css`
      border-radius: 32px 32px 4px 32px;
      &[name=image]{
        border-radius: 32px 32px 4px 32px;
       }
    `}
  }

  @media (min-width: 1024px){
    max-width: 40%;
  }
`

export const BubbleCustomer = styled.div`
  border-radius: 32px 32px 4px 32px;
  padding: 10px 25px 10px 25px;
  max-width: 60%;
  min-width: 80px;
  height: auto;
  margin-bottom: 10px;
  background: ${props => props.theme?.colors.primary};
  color: ${props => props.theme?.colors.primaryContrast};
  overflow-wrap: break-word;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  p:last-child {
    left: 10px;
    transition: all 0.3s ease;
  }

  &[name=image]{
    border-radius: 32px 32px 4px 32px;
    width: 100%;
  }

  ${props => props.theme?.rtl && css`
    border-radius: 32px 32px 32px 4px;

    p:last-child {
      left: initial;
      right: 10px;
    }

    &[name=image]{
      border-radius: 32px 32px 32px 4px;
     }
  `}

  @media (min-width: 480px){
    border-radius: 32px 32px 4px 32px;

    ${props => props.theme?.rtl && css`
      border-radius: 32px 32px 32px 4px;
    `}
  }

  @media (min-width: 1024px){
    max-width: 40%
  }
`

export const SkeletonBubbleCustomer = styled.div`
  transition: all 0.3s ease;

  span{
    border-radius: 7.6px 7.6px 0px 7.6px;
    transition: all 0.3s ease;
    ${props => props.theme?.rtl && css`
    border-radius: 7.6px 7.6px 7.6px 0px;
    `}
  }
`

export const SkeletonBubbleBusiness = styled.div`
  transition: all 0.3s ease;

  span{
    border-radius: 7.6px 7.6px 7.6px 0px;
    transition: all 0.3s ease;
    ${props => props.theme?.rtl && css`
    border-radius: 7.6px 7.6px 0px 7.6px;
    `}
  }
`

export const ChatImage = styled.div`
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  transition: all 0.3s ease;

  img{
    width: 100%;
    height: auto;
    max-height: 300px;
    aspect-ratio: attr(width) / attr(height);
    vertical-align: middle;
    object-fit: contain;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`

export const PartnerName = styled.p`
  margin-block-start: 0;
  margin-block-end: 0.6em;
  font-size: 1.1em;
  transition: all 0.3s ease;
`

export const MyName = styled.p`
  margin-block-start: 0;
  margin-block-end: 0.6em;
  font-size: 1.1em;
  text-align: right;
  transition: all 0.3s ease;

  ${props => props.theme?.rtl && css`
    text-align: left;
  `}
`

export const TimeofSent = styled.p`
  position: relative;
  text-align: right;
  font-size: 0.8em;
  margin-block-start: 0.2em;
  margin-block-end: initial;
  transition: all 0.3s ease;

  ${props => props.theme?.rtl && css`
    text-align: left;
  `}
`

export const TimeofSentByAdmin = styled.p`
  position: relative;
  text-align: left;
  font-size: 0.8em;
  margin-block-start: 0.2em;
  margin-block-end: initial;
  transition: all 0.3s ease;

  ${props => props.theme?.rtl && css`
    text-align: right;
  `}
`

export const SendForm = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);
  transition: all 0.3s ease;

  @media (min-width: 480px){
    padding: 5px 20px;
  }

  @media (min-width: 769px) {
    padding: 10px 20px;
    position: sticky;
    width: auto;
    background-color: white;
  }
`

export const Send = styled.form`
  align-items: center;
  display: flex;
  margin-top: 3px;
  height: auto;
  width: 100%;
  transition: all 0.3s ease;

  input {
    padding-top: 13px;
    padding-bottom: 13px;
    width: 100%;
    background: #F8F9FA;
    border-radius: 15px;
    border: none;
    font-size: 14px;
    box-sizing: border-box;
    transition: all 0.3s ease;

    &:focus {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }

    ${props => props.theme?.rtl
      ? css`
        padding-left: 30px;
        padding-right: 15px;
      `
      : css`
        padding-left: 15px;
        padding-right: 30px;
      `}
  }
`

export const SendImage = styled.label`
  width: 15px;
  height: 15px;
  position: ${props => props.hidden ? 'fixed' : 'absolute'};
  opacity: ${props => props.hidden && '0'};
  right: 16px;
  top: 11px;
  transition: all 0.3s ease;
  cursor: pointer;

  ${props => props.theme?.rtl && css`
    left: 16px;
    right: initial;
  `}

  input {
    display: none;
  }

  svg {
    color: #CFD0D0;
    width: 15px;
    height: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  &:hover {
    svg {
      transform: scale(1.1);
    }
  }
`

export const WrapperDeleteImage = styled.div`
  width: 25px;
  height: 25px;
  position: absolute;
  top: 9px;
  transition: all 0.3s ease;
  ${props => props.theme?.rtl
    ? css`
      left: 12px;
    `
    : css`
      right: 12px;
    `}

  > div {
    position: relative;
    transition: all 0.3s ease;

    img{
      width: 25px;
      height: 25px;
      transition: all 0.3s ease;
      &:disabled {
        cursor: not-allowed;
      }
      border-radius: 8px;
    }

    svg{
      margin-bottom: 5px;
      color: black;
      transition: all 0.3s ease;
    }

    button{
      position: absolute;
      background: white;
      width: 18px;
      height: 18px;
      transform: translate(100%, -50%);
      transition: all 0.3s ease;
      border-radius: 50%;

      &:hover {
        transform: translate(100%, -50%) scale(1.1);
      }
    }
  }
`

export const WrapperSendMessageButton = styled.div`
  white-space: nowrap;
  margin-left: 20px;
  transition: all 0.3s ease;
  ${props => props.theme?.rtl && css`
    margin-right: 20px;
    margin-left: 0;
  `}

  button{
    padding-top: 6px;
    padding-bottom: 6px;
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    svg {
      display: inline;
      width: 20px;
      height: 20px;
      vertical-align: middle;
      color: white;
      transition: all 0.3s ease;
      ${props => props.theme?.rtl && css`
        transform: rotate(270deg);
      `}
    }

    span {
      display: none;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  @media (min-width: 480px){
    button{
      span {
        display: inline;
      }
    }
  }
`

export const ImageContainer = styled.div`
  max-height: 500px;
  transition: all 0.3s ease;

  img{
    width: 100%;
    height: auto;
    aspect-ratio: attr(width) / attr(height);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    transition: all 0.3s ease;
  }
`

export const ModalIcon = styled.span`
  display: flex;
  position: absolute;
  width: 30px;
  height: 30px;
  font-size: 30px;
  cursor: pointer;
  color: white;
  border-radius: 50%;
  right: 5px;
  top: 5px;
  z-index: 1;
  background: rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  ${props => props.theme?.rtl && css`
    left: 5px;
    right: initial;
  `}

  &:hover {
    transform: scale(1.1);
  }

  @media (min-width: 578px){
    right: 10px;
    ${props => props.theme?.rtl && css`
      left: 10px;
      right: initial;
    `}
  }

  @media (min-width: 769px){
    right: 5px;
    ${props => props.theme?.rtl && css`
      left: 5px;
      right: initial;
    `}
  }
`

export const MessagesLayoutWrapper = styled.div`
  display: flex;
  border-left: 1px solid #E9ECEF;
  position: relative;
  flex-direction: column;
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    flex-direction: row;
  }
`

export const MessagesLeftLayout = styled.div`
  width: 100%;
  border-right: 1px solid ${props => props.theme?.colors.darkGray};
  min-width: 250px;
  transition: all 0.3s ease;

  ${props => props.theme?.rtl && css`
    border-left: 1px solid ${props => props.theme?.colors.darkGray};
    border-right: none;
  `}

  @media (min-width: 769px) {
    width: 30%;
  }
`

export const MessagesRightLayout = styled.div`
  width: 100%;
  margin-top: 30px;
  transition: all 0.3s ease;
  ${({ profileMessages }) => profileMessages && css`
    margin-top: 0px;
  `}

  @media (min-width: 769px) {
    width: 70%;
    border: none;
    margin-top: 0;
    ${({ profileMessages }) => profileMessages && css`
      width: 100%;
    `}
  }
`

export const MessagesTitle = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme?.colors.darkGray};
  padding: 15px 20px;
  height: 70px;
  box-sizing: border-box;
  transition: all 0.3s ease;

  h1 {
    font-weight: 600;
    font-size: 20px;
    color: ${props => props.theme?.colors.headingColor};
    margin: 0;
    transition: all 0.3s ease;
  }
`

export const CustomerList = styled.div`
  transition: all 0.3s ease;

  > div {
    border: none;
    transition: all 0.3s ease;
  }
`

export const MessagesClose = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  transition: all 0.3s ease;
  ${props => props.theme?.rtl && css`
    left: 10px;
    right: initial;
  `}
  cursor: pointer;

  svg {
    font-size: 24px;
    transition: all 0.3s ease;
  }

  &:hover {
    svg {
      transform: scale(1.1);
    }
  }
`

export const InputWrapper = styled.div`
  width: 60%;
  flex: 1;
  position: relative;
  transition: all 0.3s ease;
`

export const MessageContentWrapper = styled.div`
  font-family: ${props => props.theme?.fonts?.special?.name};
  transition: all 0.3s ease;
`

export const MessageCreatedDate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: all 0.3s ease;

  span {
    font-size: 12px;
    color: ${props => props.theme?.colors.darkGray};
    transition: all 0.3s ease;
  }
`

export const NotSendMessage = styled(SendForm)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  color: ${props => props.theme?.colors.darkGray};
  background: #F8F9FA;
  transition: all 0.3s ease;

  svg {
    font-size: 20px;
    transition: all 0.3s ease;
  }

  p {
    font-size: 14px;
    color: ${props => props.theme?.colors.darkGray};
    margin: 6px 0;
    transition: all 0.3s ease;
  }
`

export const QuickMessageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  transition: all 0.3s ease;

  button {
    margin-bottom: 5px;
    border-radius: 50px;
    color: black;
    border: 1px solid #E9ECEF;
    background: white;
    margin-right: 12px;
    font-size: 12px;
    line-height: 25px;
    padding: 0px 12px;
    transition: all 0.3s ease;
    ${props => props.theme.rtl && css`
      margin-right: 0px;
      margin-left: 12px;
    `}

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
      background: ${() => darken(0.05, '#E9ECEF')};
    }
  }
`

export const ProfileMessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 25px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);
  box-sizing: border-box;
  transition: all 0.3s ease;
`

export const MessagesTypes = styled.div`
  display: flex;
  transition: all 0.3s ease;
`

export const OrderData = styled.div`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  h1 {
    margin: 0;
    transition: all 0.3s ease;
  }

  p {
    margin: 0;
    font-size: 14px;
    transition: all 0.3s ease;
  }
`

export const MessageType = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;

  >div {
    margin-right: 5px;
    box-shadow: none;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-1px);
  }

  ${({ active }) => active && css`
    >div {
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
  `}
`
