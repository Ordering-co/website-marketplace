import styled from 'styled-components'

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 2px 8px;
`

export const Intro = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.45;
  color: ${({ theme }) => theme?.colors?.headingColor || '#263238'};

  strong {
    font-weight: 600;
  }
`

export const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Item = styled.li`
  padding: 10px 12px;
  border-radius: 8px;
  background: #FFF4E5;
  border: 1px solid #FFD8A8;

  .name {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme?.colors?.headingColor || '#263238'};
  }

  .reason {
    font-size: 13px;
    color: #8A5300;
  }
`

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;

  button {
    width: 100%;
    height: 44px;
  }
`
