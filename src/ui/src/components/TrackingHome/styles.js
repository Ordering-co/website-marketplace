import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  min-height: calc(100vh - 65px);
  padding: 32px 24px;
  background: ${({ theme }) => theme.colors.backgroundPage};
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
`

export const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.headingColor};
`

export const Message = styled.p`
  margin: 0;
  max-width: 420px;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.darkTextColor};
`
