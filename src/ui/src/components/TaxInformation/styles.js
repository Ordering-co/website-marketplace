import styled from 'styled-components'

export const TaxInformationContainer = styled.div`
  h2{
    font-size: 22px;
    margin: 10px;
    text-align: center;
  }
  h3{
    font-size: 18px;
  }
`

export const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  > div {
    padding-right: 10px;
    padding-left: 10px;
    border: 1px solid #E9ECEF;
    cursor: initial;
    @media (min-width: 681px){
      width: calc(100% - 45px);
    }

  }
`
