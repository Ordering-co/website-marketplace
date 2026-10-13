import styled, { css } from 'styled-components'

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 45px 0 20px;
  overflow-x: hidden;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
  @media (min-width: 740px) {
    margin: 20px 0;
  }
`

export const WrapperContainer = styled.div`
  width: 90%;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: auto;
  position: relative;
  @media (min-width: 993px) {
    min-height: calc(100vh - 337px);
  }
`

export const HeaderContent = styled.div`
  margin-bottom: 40px;

  p.order-status {
    text-align: center;
    color: ${({ theme }) => theme.colors.primary || 'black'};
    font-size: 1.5rem;
    margin: 0;
    padding: 0;
  }

  p.eta-range {
    font-size: 15px;
    font-weight: 400;
    margin: 28px 0 0;
    text-align: left;
    color: ${({ theme }) => theme.colors.primary || 'black'};
  }

  @media (max-width: 480px) {
    p.order-status {
      font-size: 1rem;
    }
  }
`

export const StatusBarContainer = styled.div`
  position: relative;
  height: 12px;
  margin: 25px 0px 8px;
  background: ${({ theme, percentage }) => `linear-gradient(to right, ${theme.colors.primary} ${percentage}%, ${theme.colors.disabled || '#CBCBCB'} ${percentage}%)`};
  ${({ theme, percentage }) => theme?.rtl && css`
    background: linear-gradient(to left, ${theme.colors.primary} ${percentage}%, ${theme.colors.disabled || '#CBCBCB'} ${percentage}%);
  `}
`

export const StageIcon = styled.span`
  position: absolute;
  top: 50%;
  font-size: 35px;
  transform: translateY(-50%);
  color: #FFFFFF;
  left: calc(${({ position }) => position}% - 25px);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ active, theme }) => active ? theme.colors.primary : (theme.colors.disabled || '#CBCBCB')};

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }
`

export const ReviewedText = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 7.6px;
  padding: 20px;
  box-shadow: 0px 4px 10px 0px #0000001F;
  margin: 55px 0 30px;

  p {
    font-weight: bold;
    text-align: center;
  }
`

export const MapWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
`

export const Map = styled.div`
  margin-bottom: 10px;
  width: 100%;
  height: 350px;

  > div {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const MapTrackingWrapper = styled.div`
  position: relative;
  width: 100%;
  ${({ expanded }) => !expanded && css`
    width: min(100vw, 1800px);
    max-width: 1800px;
    left: 50%;
    transform: translateX(-50%);
  `}
  ${({ expanded }) => expanded && css`
    position: fixed;
    inset: 0;
    z-index: 1050;
    width: 100vw;
    height: 100vh;
    background: #fff;
    display: flex;
    flex-direction: column;
    ${Map} {
      flex: 1;
      height: auto;
      margin-bottom: 0;
    }
  `}
`

export const MapExpandToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  margin: 0 0 15px 0;
  padding: 10px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme?.colors?.primary || '#1907e2'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  svg {
    font-size: 18px;
  }

  &:hover {
    opacity: 0.75;
  }

  ${({ expanded }) => expanded && css`
    position: absolute;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 100px);
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    margin: 0;
    padding: 10px 20px;
    background: #fff;
    border-radius: 25px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 2;
  `}
`

export const InfoCard = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: 7.6px;
  padding: 20px;
  box-shadow: 0px 4px 10px 0px #0000001F;
  margin-bottom: 30px;

  h1,
  p {
    margin: 0;
    color: #344050;
    overflow-wrap: anywhere;
  }

  h2 {
    font-weight: 500;
    font-size: 18px;
    margin: 0px 0px 5px 0px;
  }

  p {
    font-size: 14px;
    margin-bottom: 5px;
  }
`

export const SectionTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    font-weight: 500;
    margin: 0px 0px 5px 0px;
  }
`

export const PersonRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;

  div.photo {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 48px;
      height: 48px;
      margin-right: 10px;
      ${({ theme }) => theme?.rtl && css`
        margin-left: 10px;
        margin-right: 0;
      `}
    }
  }
`

export const PhotoBlock = styled.img`
  border-radius: 7.6px;
  width: 100px;
  height: 100px;
  margin-right: 40px;
  object-fit: cover;
`

export const SkeletonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 8px;
`

export const SkeletonCenter = styled.div`
  display: flex;
  justify-content: center;
`

export const TabsContainer = styled.div`
  width: 100%;
  margin: 16px 0;
`

export const Tabs = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors?.backgroundGray || '#F5F5F5'};
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
  box-sizing: border-box;
  margin: 0 -20px;
  width: calc(100% + 36px);
`

export const Tab = styled.button`
  flex: 1;
  border: none;
  cursor: pointer;
  padding: 12px 8px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  transition: all .2s ease;
  background: ${({ active, theme }) => active ? theme.colors?.primary : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors?.primaryContrast : theme.colors?.primary};
`

export const Panel = styled.div`
  padding: 16px 4px;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.borderColor || '#EEE'};

  .label {
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.textPrimary || '#1A1A1A'};
    margin-bottom: 2px;
  }

  .value {
    font-size: 14px;
    color: ${({ theme }) => theme.colors?.gray600 || '#555'};
  }
`

export const DriverRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0 4px;

  .info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    svg {
      width: 22px;
      height: 22px;
    }

    &:not(.has-photo) {
      background: ${({ theme }) => theme.colors?.primary};
      color: #fff;
    }
  }

  .texts {
    h3 {
      margin: 0;
      font-size: 15px;
    }

    p {
      margin: 2px 0 0;
      font-size: 13px;
      color: ${({ theme }) => theme.colors?.gray600 || '#555'};
    }
  }

  .call {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: #2ecc71;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`

export const SummaryTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
`

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;

  &.total {
    font-weight: 700;
    font-size: 16px;
    border-top: 1px solid #eee;
    margin-top: 4px;
    padding-top: 12px;
  }
`

export const ProductsBlock = styled.div`
  margin-top: 16px;
  overflow-x: hidden;
  ${({ scroll }) => scroll && css`
    overflow-y: auto;
  `}
`

export const PaymentBlock = styled.div`
  margin-top: 20px;
  padding-top: 16px;

  p {
    margin: 0;
    font-size: 14px;
  }
`

export const OrderNoteBlock = styled.div`
  margin-top: 20px;

  &:first-child {
    margin-top: 0;
  }

  p {
    margin: 0;
    font-size: 14px;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
`

export const SurveyContainer = styled.div`
  width: 100%;
  margin: 8px 0 24px;
`

export const IntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px 16px 24px;
`

export const BagImage = styled.img`
  width: 160px;
  max-width: 55%;
  height: auto;
  margin: 8px 0 18px;
  object-fit: contain;
`

export const IntroText = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors?.gray600 || '#555'};
  margin: 0 0 20px;
  max-width: 420px;

  &.highlight {
    color: ${({ theme }) => theme.colors?.primary};
    font-weight: 600;
  }
`

export const RateButton = styled.button`
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.colors?.primary};
  color: ${({ theme }) => theme.colors?.primaryContrast || '#fff'};
  font-size: 16px;
  font-weight: 600;
  padding: 14px 48px;
  border-radius: 8px;
  transition: opacity .2s ease;

  &:hover {
    opacity: .9;
  }
`

export const SkipLink = styled.span`
  display: inline-block;
  margin-top: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.gray500 || '#9aa0a6'};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const QuestionsWrapper = styled.div`
  padding: 8px 4px 4px;
`

export const QuestionBlock = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.borderColor || '#EEE'};

  &:last-of-type {
    border-bottom: none;
  }
`

export const QuestionLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors?.gray500 || '#9aa0a6'};
  margin-bottom: 6px;
`

export const QuestionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.textPrimary || '#1A1A1A'};
`

export const Stars = styled.div`
  display: flex;
  gap: 6px;

  span {
    display: flex;
    cursor: pointer;
  }

  svg {
    width: 30px;
    height: 30px;
    color: ${({ theme }) => theme.colors?.primary};
  }
`

export const Thumbs = styled.div`
  display: flex;
  gap: 16px;

  button {
    border: 1px solid ${({ theme }) => theme.colors?.borderColor || '#DDD'};
    background: transparent;
    cursor: pointer;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s ease;

    svg {
      width: 24px;
      height: 24px;
      color: ${({ theme }) => theme.colors?.gray600 || '#555'};
    }

    &.active {
      border-color: ${({ theme }) => theme.colors?.primary};
      background: ${({ theme }) => theme.colors?.primary};

      svg {
        color: ${({ theme }) => theme.colors?.primaryContrast || '#fff'};
      }
    }
  }
`

export const SubQuestion = styled.div`
  margin-top: 14px;

  p.sub-title {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 10px;
    color: ${({ theme }) => theme.colors?.textPrimary || '#1A1A1A'};
  }
`

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const Chip = styled.button`
  border: 1px solid ${({ active, theme }) => active ? theme.colors?.primary : (theme.colors?.borderColor || '#DDD')};
  background: ${({ active, theme }) => active ? `${theme.colors?.primary}15` : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors?.primary : (theme.colors?.gray600 || '#555')};
  cursor: pointer;
  font-size: 13px;
  padding: 8px 14px;
  border-radius: 20px;
  transition: all .15s ease;
`

export const CommentBox = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  margin-top: 12px;
  min-height: 44px;
  max-height: 120px;
  resize: vertical;
  border: 1px solid ${({ theme }) => theme.colors?.borderColor || '#DDD'};
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors?.primary};
  }
`

export const SurveyHint = styled.p`
  color: ${({ theme }) => theme.colors?.gray600 || '#555'};
  font-size: 13px;
  text-align: center;
  margin: 12px 0 0;

  &.error {
    color: ${({ theme }) => theme.colors?.danger500 || '#e74c3c'};
    font-size: 14px;
  }
`

export const SubmitButton = styled.button`
  width: 100%;
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.colors?.primary};
  color: ${({ theme }) => theme.colors?.primaryContrast || '#fff'};
  font-size: 16px;
  font-weight: 600;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  transition: opacity .2s ease;

  &:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
`

export const SkipRow = styled.div`
  text-align: center;
`

export const ProductSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 0px;
  background: #FFF;
  border-bottom: 1px solid #D9D9D9;
`

export const ProductAccordion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: ${({ clickable }) => clickable ? 'pointer' : 'default'};
  transition: background-color 0.6s ease;
  margin: 0px 10px;
  position: relative;

  @media (min-width: 411px) {
    &.active .price-inline {
      position: absolute;
      top: 10px;
      right: 0;
      margin: 0;
    }
  }

  .rotate {
    transform: rotate(180deg);
  }

  .accordion__icon {
    margin-left: auto;
    transition: transform 0.6s ease;
    ${({ theme }) => theme?.rtl && css`
      margin-right: auto;
      margin-left: initial;
    `}
  }

  @media (min-width: 411px) {
    flex-direction: row;
  }
`

export const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding-right: 88px;
  overflow: hidden;

  h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    word-break: break-word;
  }

  > div {
    min-width: 0;
  }

  .price-inline {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    margin: 0;
    text-align: right;
    white-space: nowrap;
  }
`

export const ProductImageWrapper = styled.div`
  flex-shrink: 0;
  max-width: 50px;
  max-height: 50px;
  height: 50px;
  width: 50px;
  margin-right: 10px;

  @media (min-width: 361px) {
    max-width: 55px;
    max-height: 55px;
    height: 55px;
    width: 55px;
  }

  @media (min-width: 411px) {
    max-width: 65px;
    max-height: 65px;
    height: 65px;
    width: 65px;
  }
`

export const ProductImage = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: contain;
  background-position: center;
  border-radius: 7.6px;
`

export const ProductQuantity = styled.span`
  align-self: flex-start;
  flex-shrink: 0;
  min-width: 30px;
  height: 30px;
  padding: 0 6px;
  margin: 0 10px 0 0;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme?.colors?.borderColor || '#DDD'};
  border-radius: 6px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
`

export const ProductContentInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-transform: capitalize;
  flex: 1;
  min-width: 0;

  ${({ theme }) => theme?.rtl && css`
    margin-right: 10px;
    margin-left: 0px;
  `}

  h3 {
    font-size: 14px;
    margin: 0px;
    font-weight: 600;
  }

  > div {
    > p {
      font-size: 10px;
      margin: 0;
      color: #909BA9;
      overflow-wrap: break-word;
    }

    .price-inline {
      display: block;
      margin-top: 4px;
      font-size: 14px;
      font-weight: 700;
      color: ${({ theme }) => theme?.colors?.textPrimary || '#1A1A1A'};

      s {
        color: #9aa0a6;
        font-weight: 400;
        margin-right: 6px;
      }
    }
  }
`

export const ProductAccordionContent = styled.div`
  overflow: hidden;
  transition: max-height 0.6s ease;
  width: 100%;
  margin: auto;

  @media (min-width: 481px) {
    width: 80%;
  }
`

export const ProductOptionsList = styled.ul`
  list-style-type: none;

  .suboption {
    margin-left: -25px;
    ${({ theme }) => theme?.rtl && css`
      margin-right: -25px;
      margin-left: 0px;
    `}
  }

  p:nth-child(1) {
    margin-bottom: 0;
  }

  p {
    font-weight: 400;
    margin: 0px;
  }

  li span {
    font-weight: 300;
  }

  li.ingredient {
    padding-left: 15px;
    ${({ theme }) => theme?.rtl && css`
      padding-right: 15px;
      padding-left: 0px;
    `}
  }
`
