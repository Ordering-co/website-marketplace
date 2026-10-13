import styled from 'styled-components'

export const Container = styled.div`
  border-top: 1px solid ${({ theme }) => theme?.colors?.borderColor || '#E9ECEF'};
  margin-top: 20px;
  padding-top: 16px;
`

export const SelectWrapper = styled.div`
  margin-bottom: 12px;

  #select-input {
    position: relative;
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

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 6px 0 4px;
  font-family: ${({ theme }) => theme?.fonts?.special?.name || 'Georgia'};

  p {
    margin: 0;
    font-size: 16px;
    color: ${({ theme }) => theme?.colors?.darkTextColor || '#454545'};
  }
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin: 4px 0 10px;
`

export const EditLink = styled.button`
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  user-select: none;
  font-family: ${({ theme }) => theme?.fonts?.special?.name || 'Georgia'};
  font-size: 13px;
  color: ${({ theme }) => theme?.colors?.primary || '#1907C7'};

  &:hover {
    text-decoration: underline;
  }
`
