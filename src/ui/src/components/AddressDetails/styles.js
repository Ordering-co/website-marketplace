import styled, { css } from 'styled-components'

export const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  > h1 {
    margin-top: 20px;
    margin-bottom: 0px;
    font-size: 17px;
    font-weight: 600;
  }
`

export const Header = styled.div``

export const WrappMap = styled.div`
  width: 100%;
  margin: auto;
  height: auto;
`

export const Map = styled.div`
  font-size: 100%;

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 15px;
    -webkit-user-drag: none;
    aspect-ratio: attr(width) / attr(height);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }
`

export const Text = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  h1 {
    white-space: normal;
    width: 100%;
    font-weight: 400;
    font-size: 16px;
  }

  span {
    font-size: 13px!important;
    cursor: pointer;
    user-select: none;
    color: ${props => props.theme.colors.primary};
    margin-left: 10px;
    font-weight: normal;
    transition: all 0.3s ease;

    &:hover {
      text-decoration: underline;
      transform: translateY(-1px);
    }

    ${props => props.green && css`
      color: ${props => props.theme.colors.primary};
    `}

    ${props => props.theme?.rtl && css`
      margin-right: 10px;
      margin-left: initial;
    `}
  }

  svg {
    font-size: 22px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }
  }
`

export const ToggleMap = styled.div`
  span {
    margin: 0;
  }
`
