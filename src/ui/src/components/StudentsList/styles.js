import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 90%;
  margin: 25px auto;

  @media (min-width: 768px) {
    width: 63%;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  h1 {
    margin: 0;
    font-size: 22px;
    color: ${({ theme }) => theme?.colors?.headingColor || '#263238'};
  }
`

export const AddButton = styled.button`
  background: ${({ theme }) => theme?.colors?.primary || '#1907C7'};
  color: ${({ theme }) => theme?.colors?.primaryContrast || '#FFF'};
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`

export const StudentCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme?.colors?.borderColor || '#E9ECEF'};
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme?.colors?.primary || '#1907C7'};
  }

  strong {
    font-size: 16px;
    color: ${({ theme }) => theme?.colors?.headingColor || '#263238'};
  }

  span {
    font-size: 13px;
    color: ${({ theme }) => theme?.colors?.secundaryText || '#748194'};
  }
`

export const Empty = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme?.colors?.secundaryText || '#748194'};
`
