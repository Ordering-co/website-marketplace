import styled, { css } from 'styled-components'

export const OrderTypeSelectorContainer = styled.div`
  padding-right: 10px;
  display: flex;
  justify-content: center;
  max-width: 380px;
  margin: 0 auto;

  > *:first-child {
    border-radius: ${({ theme }) => `${theme?.utils?.radius.m}px 0px 0px ${theme?.utils?.radius.m}px`};
  }
  > *:nth-child(2) {
    border-radius: ${({ theme }) => `0px ${theme?.utils?.radius.m}px ${theme?.utils?.radius.m}px 0px`};
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme?.colors?.black} !important;
    background: ${({ theme }) => theme?.colors?.gray300} !important;
    border-color: ${({ theme }) => theme?.colors?.primaryContrast};
    height: 45px;
    flex: 0 0 auto;
    padding: 0 18px;
    overflow: visible;
    white-space: nowrap;
    font-weight: 600;
    border-width: 0px;
    transition: all 0.25s ease;
    p {
      flex-shrink: 0;
      margin: 0;
      display: flex;
      align-items: center;
    }
    .ot-label {
      display: inline-block;
      flex-shrink: 0;
      max-width: 140px;
      padding-left: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:not(.selected):hover {
      background: ${({ theme }) => theme?.colors?.gray200} !important;
      color: ${({ theme }) => theme?.colors?.primary} !important;
    }
  }

  .selected {
    background: ${({ theme }) => theme?.colors?.primary} !important;
    color: ${({ theme }) => theme?.colors?.primaryContrast} !important;
    img {
      filter: invert(1);
    }
  }

  .pickup-dropdown-container {
    position: absolute;
    min-width: 100px;
    width: 18vw;
    max-width: 200px;
    top: 65px;
    right: 10px;
    background-color: #F8F9FA;
    border-radius: 0px 10px 10px 10px;
    z-index: 9999;
  }

  .dropdown-item {
    color: ${({ theme }) => theme?.colors?.black};
    padding: 10px;
    cursor: pointer;
    transition: color 0.2s;
    border-radius: 8px;

    &:hover {
      color: ${({ theme }) => theme?.colors?.darkGreen};
    }

    &.selected {
      color: ${({ theme }) => theme?.colors?.darkGreen};
    }
  }

  .dropdown-arrow {
    margin-left: 5px;
    flex-shrink: 0;
  }
`

export const OrderTypeTitle = styled.h2`
  font-weight: 600;
  font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
  color: ${({ theme }) => theme?.colors?.white};
  margin-top: 0;
  margin-bottom: 5px;
  z-index: 2;
  position: relative;
`

export const OrderTypeDescription = styled.p`
  font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
  color: ${({ theme }) => theme?.colors?.white};
  margin-top: 0;
  margin-bottom: 17px;
  z-index: 2;
  position: relative;
`

export const OrderStartWrapper = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
  z-index: 2;
  position: relative;

  span {
    font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
    color: ${({ theme }) => theme?.colors?.white};
    ${props => props.theme?.rtl
    ? css`
      margin-left: 10px;
    `
    : css`
      margin-right: 10px;
    `}
  }

  svg {
    font-size: ${({ theme }) => theme?.utils?.tsize?.s + 'px'};
    color: ${({ theme }) => theme?.colors?.white};
  }
`

export const OrderTypeListTitle = styled.h1`
  text-align: center;
  font-weight: 600;
  font-size: ${({ theme }) => theme?.utils?.tsize?.l + 'px'};
  color: ${props => props.theme.colors.darkTextColor};
  margin: 0 0 30px;

  @media (max-width: 450px) {
    padding-left: 30px;
    ${props => props.theme.rtl && css`
      padding-right: 30px;
      padding-left: 0;
    `}
  }
`

export const OrderTypesContainer = styled.div`
  text-align: center;
  padding: 10px 0px;
  position: relative;

  h2 {
    font-size: ${({ theme }) => theme?.utils?.tsize?.l + 'px'};
    font-weight: 700;
    margin: 0px;
  }
  h3 {
    margin-top: 0px;
    font-size: 18px;
    font-weight: 400;
  }

  @media (min-width: 1200px) {
    display: flex;
    flex-direction: column;
    align-items:  center;
    position: relative;

    h2 {
      font-size: 46px;
    }

    h3 {
      font-size: ${({ theme }) => theme?.utils?.tsize?.l + 'px'};
    }
  }
`

export const AddressMenu = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${props => props?.theme?.utils?.radius?.m}px;
  span {
    padding-left: 20px;
    text-align: left;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: ${props => props.theme?.utils?.tsize?.m + 'px'};
    font-weight: 600;
  }
  svg {
    color: ${({ theme }) => theme?.colors?.lightGray};
    position: relative;
    margin-right: 20px;
    margin-left: 10px;
    top: 1px;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: ${props => props.theme?.utils?.tsize?.s + 'px'};
      font-weight: 400;
    }
  }
`

export const AddressOrderTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: normal;
  border-radius: ${props => props.theme?.utils?.radius.m}px;

  @media (min-width: 578px) {
    flex-direction: row;
    justify-content: space-between;
  }
`

export const AddressContainer = styled.div`
  display: flex;
  cursor: pointer;
  ${({ hideOrderTypes }) => hideOrderTypes && css`
    width: 100%;
    justify-content: space-between;
  `}
  svg {
    min-width: max-content;
    padding-top: 5px;
  }
`
