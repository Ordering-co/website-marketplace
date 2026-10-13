import styled from 'styled-components'

export const HighestRatedContainer = styled.div`
  padding-bottom: 30px;
`

export const ErrorMessage = styled.span`
  padding: 20px;
  width: 100%;
  background-color: #CCCCCC;
  margin: 0px 15px;
  color: #D81313;
  font-weight: bold;
`

export const BusinessList = styled.div`
  display: flex;
  box-sizing: border-box;

  #${({ id }) => id} {
    > div {
      width: calc(70vw - 40px);
      min-width: 214px;
      max-width: 230px;
      @media (min-width: 681px) {
        width: calc(33vw - 40px);
        min-width: calc(33vw - 40px);
      }
      @media (min-width: 993px) {
        width: calc(25vw - 40px);
        min-width: calc(25vw - 40px);
      }
      @media (min-width: 1200px) {
        width: calc(20vw - 40px);
        min-width: calc(20vw - 40px);
      }
    }
  }
`

export const Title = styled.h2`
  font-weight: 600;
  font-size: 24px;
  color: ${props => props.theme?.colors.headingColor};
  margin: 10px 20px 0px 20px;
`

export const Description = styled.p`
  font-size: 14px;
  color: ${props => props.theme?.colors.headingColor};
  margin: 0px 20px 10px 20px;
`

export const BusinessListWrapper = styled.div`
  overflow: auto hidden;
  width: 100%;
`
