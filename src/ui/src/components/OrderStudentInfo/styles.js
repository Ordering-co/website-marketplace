import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  > h1 {
    margin: 20px 0 4px;
    font-size: 20px;
    font-weight: 600;
  }

  .name {
    font-family: ${({ theme }) => theme?.fonts?.special?.name || 'Georgia'};
    font-size: 16px;
    color: ${({ theme }) => theme?.colors?.headingColor || '#263238'};
  }

  .meta {
    margin-top: 2px;
    font-family: ${({ theme }) => theme?.fonts?.special?.name || 'Georgia'};
    font-size: 16px;
    color: ${({ theme }) => theme?.colors?.secundaryText || '#748194'};
  }
`
