import styled, { css } from 'styled-components'

export const AccordionSection = styled.div`

  .info-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 25px;
    font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};;

    div {
      display: flex;
      justify-content: space-evenly;
      min-width: 40%;
    }

    h4 {
      margin: 0px;
      font-size: 15px;
      font-weight: 400;

      ${({ isClosed }) => isClosed && css`
        font-weight: 700;
      `}
    }

    p {
      margin: 0px 0 10px;
      font-size: 15px;
    }

    p:last-child {
      margin: 0px;
    }
  }
`

export const Accordion = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const DropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  > h4 {
    font-size: 16px;
  }
`
export const HoursWrappers = styled.div`
  flex-direction: column;
  padding-left: 60px;

  p {
    margin: 0px 0px 10px 0px;
  }
`

export const ClosedSchedule = styled.p`
  margin: 0px !important;
  font-size: 15px;
  font-weight: 700;
`
