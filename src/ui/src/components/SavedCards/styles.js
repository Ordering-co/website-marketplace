import styled from 'styled-components'

export const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 20px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  h1 {
    margin: 0;
    font-size: 22px;
  }
`

export const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const CardItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme?.colors?.borderColor || '#e9e9e9'};
  border-radius: 10px;
  padding: 14px 16px;
`

export const CardData = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    font-size: 24px;
    color: ${({ theme }) => theme?.colors?.primary};
  }
`

export const CardBrand = styled.span`
  text-transform: capitalize;
  font-weight: 600;
`

export const CardNumber = styled.span`
  color: ${({ theme }) => theme?.colors?.disabled || '#808080'};
`

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme?.colors?.danger || '#d9534f'};
  display: flex;
  align-items: center;
  font-size: 18px;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme?.colors?.disabled || '#808080'};
`

export const IframeWrapper = styled.div`
  width: 100%;
  min-height: 480px;

  iframe {
    width: 100%;
    min-height: 480px;
    border: none;
  }
`
