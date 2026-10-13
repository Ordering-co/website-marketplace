import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 10px 0 18px;
  max-width: 280px;

  #select-input {
    width: 100%;
    min-height: 44px;
    background-color: ${({ theme }) => theme?.colors?.backgroundPage || '#FFF'} !important;
    border: 1px solid ${({ theme }) => theme?.colors?.gray200 || '#E9ECEF'} !important;
    border-radius: 15px !important;
    color: ${({ theme }) => theme?.colors?.headingColor || '#263238'} !important;
  }

  #select-input > div:first-child {
    min-height: 44px;
    padding: 0 16px;
    display: flex;
    align-items: center;
  }

  #select-input div {
    font-size: 16px;
  }

  #list {
    width: 100% !important;
    left: 0 !important;
    right: auto !important;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme?.colors?.backgroundPage || '#FFF'} !important;
    border: 1px solid ${({ theme }) => theme?.colors?.gray200 || '#E9ECEF'};
    font-size: 16px;
  }
`

export const AddStudentLink = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  padding: 0;
  margin-top: 4px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.primary || '#3C64F4'};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const Label = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.headingColor || '#263238'};
`

export const Notice = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin: 0 0 18px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.45;
  background: ${({ theme }) => theme?.colors?.lightPrimary || '#EEF1FF'};
  color: ${({ theme }) => theme?.colors?.headingColor || '#263238'};

  strong {
    font-weight: 600;
  }
`

export const Warning = styled.div`
  margin-top: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
  background: #FFF4E5;
  border: 1px solid #FFD8A8;
  color: #8A5300;
`
