import styled, { css } from 'styled-components'
import { rgba } from 'polished'

export const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  text-align: left;
  margin-bottom: 40px;
  color: ${props => props.theme.colors?.darkTextColor};

  @media (max-width: 450px) {
    ${props => props.theme.rtl && css`
      padding-right: 30px;
      padding-left: 0;
    `}
  }
`

export const CheckBoxWrapper = styled.div`
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;

  span {
    font-size: 14px;
    color: ${props => props.theme?.colors.darkGray};
  }

  svg {
    color: ${props => props.theme.colors.lightGray};
    font-size: 24px;
    margin-right: 10px;
    min-width: 24px;

    ${props => props.theme?.rtl && css`
      margin-left: 10px;
      margin-right: 0px;
    `}
  }

  ${({ highlight }) => highlight && css`
    span {
      font-weight: 600;
      color: ${props => props.theme.colors?.darkTextColor};
    }
    svg {
      color: ${props => props.theme.colors?.primary};
    }
  `}

  ${({ isLoading }) => isLoading && css`
    pointer-events: none;
  `}
`

export const DateWrapper = styled.div`
  margin: 15px 2px 25px;
`

export const TimeListWrapper = styled.div`
  font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
  display: flex;
  flex-direction: column;
  margin: 2px;
  margin-top: 15px;
  border-radius: 20px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);
`

export const CheckedIcon = styled.div`
  border-radius: 50%;
  width: 20px;
  min-width: 20px;
  height: 20px;
  box-sizing: border-box;
  border: 6px solid ${props => props.theme.colors?.primary};
  margin: 2px 12px 2px 2px;
  ${props => props.theme.rtl && css`
    margin: 2px 2px 2px 12px;
  `}
  ${({ cateringPreorder }) => cateringPreorder && css`
    width: 21px;
    min-width: 21px;
    height: 21px;
    margin: 0;
    margin-left: 1px;
  `}
`
export const ButtonWrapper = styled.div`
  margin-top: 25px;
  position: sticky;
  bottom: 0;
  z-index: 1;
  padding-top: 12px;
  background: ${props => props.theme.colors.backgroundPage};

  button {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${props => props.theme.utils.radius.m}px;

    svg {
      position: absolute;
      font-size: 21px;
      ${props => props.theme?.rtl
? css`
        left: 17px;
      `
: css`
        right: 17px;
      `}
    }
  }
`

export const OrderTimeWrapper = styled.div`
  > p {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 5px;
  }
`

export const MonthYearLayer = styled.div`
  font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
  margin-top: 0px;
  margin-bottom: 13px;

  span {
    font-size: 14px;
    line-height: 24px;
  }
`

export const DaysSwiper = styled.div`
  width: 100%;
  position: relative;
  border-top: 1px solid #E9ECEF;
  border-bottom: 1px solid #E9ECEF;

  .swiper-datelist {
    padding: 0 20px;
    .swiper-button-prev {
      background-image: url("data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 16 16' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 00-1.659-.753l-5.48 4.796a1 1 0 000 1.506z'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-size: 100% auto;
      background-position: center;
      width: 20px;
    }

    .swiper-button-prev::after {
      display: none;
    }
    .swiper-button-next {
      background-image: url("data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 16 16' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 011.659-.753l5.48 4.796a1 1 0 010 1.506z'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-size: 100% auto;
      background-position: center;
      width: 18px;
    }

    .swiper-button-next::after {
      display: none;
    }

    .swiper-button-next, .swiper-container-rtl .swiper-button-prev {
      right: 0px;
      left: auto;
    }
    .swiper-button-prev, .swiper-container-rtl .swiper-button-next {
      left: 0px;
      right: auto;
    }
    .swiper-wrapper {
      display: flex;
      justify-content: space-between;
    }
  }
`

export const Day = styled.div`
  display: flex;
  flex-grow: 1;
  color: ${props => props.theme.colors.lightGray};
  cursor: pointer;
  padding: 14px 0 13px 0;
  flex-direction: column;
  align-items: center;
  transition: background-color .16s ease -0.01s;

  ${({ selected }) => selected && css`
    color: ${props => props.theme.colors.primary};
    background: ${props => rgba(props.theme.colors.primary, 0.12)};
    border-color: ${props => props.theme.colors.primary};
  `}

  &:hover {
    background: ${props => rgba(props.theme.colors.primary, 0.12)};
    opacity: 0.8;
  }
`

export const DayName = styled.div`
  display: flex;
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 10px;
  &:first-letter {
    text-transform: uppercase;
  }

  ${({ isAppoint }) => isAppoint && css`
    font-size: 12px;
    line-height: 22px;
  `}
`

export const DayNumber = styled.div`
  display: flex;
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;

  ${({ isAppoint }) => isAppoint && css`
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
  `}
`

export const TimeItem = styled.div`
  cursor: pointer;
  display: flex;
  padding: 20px 35px;
  transition: all 0.3s ease;
  border-top: 1px solid #E9ECEF;
  border-bottom: 1px solid #E9ECEF;

  &:hover {
    background: ${props => rgba(props.theme.colors.primary, 0.12)};
    opacity: 0.8;
  }

  span {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 20px;
    justify-content: ${props => props?.is12hours ? 'space-between' : 'center'};

    .time-container {
      display: flex;
      align-items: center;
      gap: 8px;

      p#hours, p#minutes {
        margin: 0;
        padding: 0 4px;
      }

      p#separator {
        margin: 0;
        padding: 0 4px;
      }
    }

    p#period {
      margin: 0;
    }
  }

  ${({ active }) => active && css`
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};

    &:hover {
      background: ${props => props.theme.colors.primary};
      opacity: 1;
    }
  `}

  ${({ isDisabled }) => isDisabled && css`
    pointer-events: none;
    opacity: 0.7;
  `}

  ${({ cateringPreorder }) => cateringPreorder && css`
    background: ${(props) => props.theme?.colors?.backgroundPage};
    width: 100%;
    min-width: 100%;
    height: 50px;
    margin: 0;
    border: 1px solid ${props => props.theme.colors.grayDividerColor};

    span {
      font-size: 18px;
      display: flex;
      align-items: center;
      margin: 10px 0;
      margin-left: 15px;
      p{
        position: relative;
        bottom: 2px;
      }
    }
    ${({ active }) => active && css`
      background: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.white};
      border-color: ${props => props.theme.colors.primary};
      span {
        p{
          bottom: 0;
          margin-left: 2px;
        }
      }
    `}
  `}

  ${({ isAppoint }) => isAppoint && css`
    @media (min-width: 769px) {
      span {
        font-size: 12px;
      }
    }
  `}
`

export const ClosedBusinessMsg = styled.div`
  text-align: center;
  font-size: 16px;
  width: 100%;
`

export const SelectContainer = styled.div`
  #list {
    width: 100%;
  }

  > div {
    width: 100%;
    background-color: #F8F9FA!important;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    min-height: 44px;
    border: none;
    border-radius: 7.6px;
    color: ${props => props.theme?.colors.darkGray} !important;

    > div:first-child {
      padding-top: 5px;
      padding-bottom: 5px;
      justify-content: space-between;
    }
    > div#list {
      width: 100%;
      background-color: #F8F9FA!important;
      border: 1px solid #F8F9FA;
      border-radius: 7.6px;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    }
  }

  ${({ theme }) => theme?.layouts?.checkout?.components?.layout?.type === 'pfchangs' && css`
    background: #000;
    #select-input {
      margin-bottom: 0px;
    }
    div {
      white-space: pre-wrap;
    }
    > div {
      background-color: #000!important;
      border: 1px solid #fff;
      border-radius: 0px;
      color: #fff !important;
      padding: 0px 10px;
      box-sizing: border-box;
      height: auto;
      > div#list {
        background-color: #000 !important;
        border: 1px solid #fff;
        border-radius: 0px;
      }
    }
  `}
`

export const CheckIcon = styled.div`
  margin-right: 20px;
  svg {
    width: 24px;
    height: 24px;
  }
`

export const Divider = styled.div`
  background: #E9ECEF;
  height: 2px;
`

export const ScheduleBody = styled.div`
  overflow: visible;
`

export const AccordionSection = styled.div`
  margin-bottom: 15px;
  border-radius: 15px;
  overflow: hidden;
`

export const AccordionHeader = styled.div`
  font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #F8F9FA!important;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  span {
    font-weight: 600;
    font-size: 16px;
    color: ${props => props.theme.colors.black};
  }

  svg {
    transition: transform 0.3s ease;
    transform: ${props => props.active ? 'rotate(180deg)' : 'rotate(0)'};
  }

  &:hover {
    background-color: ${props => props.theme.colors.grayDividerColor};
  }
`

export const AccordionContent = styled.div`
  max-height: ${props => props.active ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background-color: ${props => props.theme.colors.backgroundPage};
`
