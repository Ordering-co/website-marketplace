import styled from 'styled-components'

export const Container = styled.div`
  transition: all 0.3s ease;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 40px 0 20px 0;
    transition: all 0.3s ease;
    color: ${(props) => props.theme.colors.darkTextColor};
  }
`

export const Divider = styled.div`
  margin-top: 25px;
  background: #F8F9FA;
  height: 8px;
  width: 100%;
  border-radius: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

export const NoOrdersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0px;
  position: absolute;
  box-sizing: border-box;
  min-height: calc(100% - 120px);
  width: 100%;
  transition: all 0.3s ease;

  > p {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    margin-top: 0px;
    margin-bottom: 25px;
    color: ${(props) => props.theme.colors.darkGray};
    transition: all 0.3s ease;
    text-align: center;
  }
`
