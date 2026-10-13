import styled from 'styled-components'

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 2px 8px;

  input {
    width: 100%;
    height: 44px;
    box-sizing: border-box;
    box-shadow: 0px 1px 4px 0px #0000001A;
  }

  #select-input {
    position: relative;
    width: 100%;
    min-height: 44px;
    background-color: ${({ theme }) => theme?.colors?.backgroundPage || '#FFF'} !important;
    box-shadow: 0px 1px 4px 0px #0000001A;
    border: none !important;
    border-radius: ${({ theme }) => theme?.utils?.radius?.s ?? 8}px !important;
    color: ${({ theme }) => theme?.colors?.headingColor || '#263238'} !important;
  }

  #select-input > div:first-child {
    min-height: 44px;
    padding: 0 20px;
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
    box-shadow: 0px 1px 4px 0px #0000001A;
    font-size: 16px;
  }
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  > label {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme?.colors?.headingColor || '#263238'};
  }

  input {
    width: 100%;
    box-sizing: border-box;
  }
`

export const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const Chip = styled.button`
  padding: 7px 14px;
  font-size: 13px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid ${({ theme, active }) => active ? (theme?.colors?.primary || '#1907C7') : (theme?.colors?.borderColor || '#E9ECEF')};
  background: ${({ theme, active }) => active ? (theme?.colors?.primary || '#1907C7') : (theme?.colors?.backgroundPage || '#FFF')};
  color: ${({ theme, active }) => active ? (theme?.colors?.primaryContrast || '#FFF') : (theme?.colors?.headingColor || '#263238')};
`

export const Actions = styled.div`
  margin-top: 24px;
  width: 100%;

  button {
    border-radius: ${({ theme }) => theme?.utils?.radius?.m ?? 8}px;
    height: 44px;
    width: 100%;
    text-transform: lowercase;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:first-letter {
      text-transform: uppercase;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
    }
  }
`
