import styled from 'styled-components'

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 6px 4px 10px;
`

export const StudentButton = styled.button`
  width: 100%;
  text-align: start;
  padding: 14px 16px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme?.colors?.borderColor || '#E9ECEF'};
  background: ${({ theme }) => theme?.colors?.backgroundPage || '#FFF'};
  color: ${({ theme }) => theme?.colors?.headingColor || '#263238'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme?.colors?.primary || '#1907C7'};
    background: ${({ theme }) => theme?.colors?.lightPrimary || '#F4F6FF'};
  }
`

export const EmptyMessage = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme?.colors?.secundaryText || '#748194'};
  margin: 0;
  line-height: 1.5;
`

export const CreateButton = styled.button`
  align-self: flex-start;
  margin-top: 4px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.primary || '#1907C7'};

  &:hover {
    text-decoration: underline;
  }
`
