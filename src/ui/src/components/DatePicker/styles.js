import styled from 'styled-components'

export const DateContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: initial;
  border-bottom: 1px solid #E9ECEF;
  margin-bottom: 20px;

  input {
    border-radius: 20px;
    width: 140px;
    outline: none;
    padding: 10px 15px;
    border: 1px solid #E9ECEF;
  }

  .react-datepicker__triangle {
    transform: translate(40px, 0px) !important;
  }
`
