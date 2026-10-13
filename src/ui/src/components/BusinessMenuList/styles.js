import styled from 'styled-components'

export const BusinessMenuListContainer = styled.div`
  margin-bottom: 35px;

  > p {
    font-weight: 600;
    font-size: 20px;
    margin-top: 0px;
    margin-bottom: 13px;
  }
`

export const SelectWrapper = styled.div`
  width: 100%;
  font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
  > div {
    width: 100%;
    background-color: #F8F9FA!important;
    height: 55px;
    border: none;
    border-radius: 15px;
    color: ${props => props.theme?.colors?.black} !important;
    font-weight: 700;

    > div:first-child {
      padding: 11px 16px 11px 25px;
      justify-content: space-between;
      font-size: 16px;
    }
    > div#list {
      width: 100%;
      background-color: #F8F9FA!important;
      border: 1px solid #F8F9FA;
      border-radius: 7.6px;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    }
  }
`

export const Option = styled.div`
  white-space: nowrap;
  color: ${props => props.theme?.colors?.black};
  font-size: 16px;
`
