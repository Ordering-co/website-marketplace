import styled from 'styled-components'

export const Container = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 30px 20px 60px;
`

export const HeaderWrapper = styled.div`
  margin-bottom: 20px;

  h1 {
    margin: 0 0 10px;
    font-size: 24px;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: ${props => props.theme.colors.lightGray};
  }
`

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
`

export const SkipButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px 0;
  font-size: 14px;
  color: ${props => props.theme.colors.primary};

  &:hover {
    text-decoration: underline;
  }
`
