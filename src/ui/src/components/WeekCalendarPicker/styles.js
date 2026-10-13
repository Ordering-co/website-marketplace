import styled from 'styled-components'
import { rgba } from 'polished'

export const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 17px 15px 3px 15px;
  border: 1px solid #E9ECEF;
  box-sizing: border-box;
  border-radius: 7.6px;
  margin: 15px 2px 25px;

  .react-calendar {
    border: none;
    width: 100%;

    .react-calendar__tile--active,
    .react-calendar__tile--active:enabled:hover,
    .react-calendar__tile--active:enabled:focus {
      background: transparent;

      abbr {
        background-color: ${props => props.theme?.colors?.primary} !important;
        color: ${props => props.theme?.colors?.white};
      }
    }

    .react-calendar__tile:enabled:focus {
      background: transparent;
    }

    .react-calendar__tile:enabled:hover:not(.react-calendar__tile--active) {
      background: transparent;

      abbr {
        background: ${props => rgba(props.theme?.colors?.primary, 0.12)};
        color: ${props => props.theme?.colors?.primary};
        border: 2px solid ${props => props.theme?.colors?.primary};
      }
    }

    .react-calendar__tile--now {
      background: transparent;
    }

    .react-calendar__month-view__weekdays {
      font-size: 16px;
      color: ${props => props.theme?.colors?.black};
      font-weight: 600;
      text-transform: capitalize;
      abbr {
        text-decoration: none;
        font-family: ${props => props.theme?.fonts?.special?.name};
      }
    }

    button.react-calendar__tile {
      border: 0;
      margin: 0;
      box-sizing: border-box;
    }

    .react-calendar__month-view__weekdays__weekday,
    .react-calendar__month-view__days__day {
      padding: 6px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }

    .react-calendar__month-view__days__day {
      font-size: 14px;
      color: ${props => props.theme?.colors?.black};
      abbr {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background-color: ${props => props.theme?.colors?.gray300};

        @media (min-width: 350px) {
          width: 34px;
          height: 32px;
        }
      }
    }

    .react-calendar__tile:disabled {
      background-color: transparent;
      color: ${props => props.theme?.colors.disabled};
      cursor: not-allowed;
    }

    .react-calendar__navigation {
      button {
        background: transparent!important;
        color: ${props => props.theme?.colors?.black};

        svg {
          fill: ${props => props.theme?.colors?.black};
          font-size: 24px;
        }

        &:disabled {
          cursor: not-allowed;
        }

        span {
          font-size: 20px;
          font-family: ${props => props.theme?.fonts?.special?.name};
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          width: 100%;
          display: inline-block;

          @media (min-width: 768px) {
            width: auto;
            display: initial;
          }
        }
      }

      .react-calendar__navigation__prev2-button,
      .react-calendar__navigation__next2-button {
        display: none;
      }
    }
  }
`
