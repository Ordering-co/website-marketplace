import styled, { css } from 'styled-components'

export const BusinessSearch = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  position: relative;

  input {
    border: none;
    border-bottom: 1px solid #E9ECEF;
    border-radius: 0px;
    width: 100%;
    background-repeat: no-repeat;
    background-size: 60px 18px;
    box-sizing: border-box;
    padding-left: 20px;
    padding-right: 30px;
    background-color: ${props => props.theme?.colors?.backgroundPage};
    /* Canonical focus/hover states — single source of truth for all search fields.
       Keeps the flat bottom-underline look (no radius); only the underline color
       and a subtle soft shadow respond to interaction. */
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder {
      color: ${props => props.theme?.colors?.black};
    }

    &:hover {
      border-bottom-color: ${props => props.theme?.colors?.gray || '#CED4DA'};
    }

    &:focus {
      border-bottom-color: ${props => props.theme?.colors?.primary};
      box-shadow: 0 1px 0 0 ${props => props.theme?.colors?.primary};
    }

    ${({ hasValue }) => hasValue && css`
      padding-right: 50px;
    `}

    ${props => !props.theme?.rtl
? css`
      background-position: right center;
    `
: css`
      background-position: left center;
    `}

    ${({ isCustomLayout }) => !isCustomLayout && css`
      justify-content: center;
      -webkit-transition: width 0.4s ease-in-out;
      transition: width 0.4s ease-in-out;
    `}

    ${({ starbucksStyle }) => starbucksStyle && css`
        background-color: #F8F9FA;
        box-shadow: 0px 1px 4px 0px #0000001A;
        font-size: 14px;
        color: #000;
        border-radius: ${props => props.theme?.utils?.radius?.s}px;
    `}

    @media (min-width: 681px) {
      width: 80%;
      ${({ isCustomLayout, starbucksStyle }) => !isCustomLayout && !starbucksStyle && css`
        width: 50%;
      `}
    }
    @media (min-width: 1390px) {
      width: 100%;
    }
  }
`

export const DeleteContent = styled.span`
  position: absolute;
  font-weight: 300;
  padding: 10px 0;
  color: #333;
  font-size: 14px;
  transform: translate(-30%, 0%);
  border-radius: 25%;
  max-height: 100%;
  ${props => props.theme?.rtl && css`
    transform: translate(30%, 0%);
  `}
  span{
    cursor: pointer;
  }
  img{
    width: 20px;
    transform: translate(-25%, 0%);
    ${props => props.theme?.rtl && css`
      transform: translate(25%, 0%);
    `}
  }
`
export const SearchIcon = styled.div`
  background-image: url(${props => props.theme?.images?.general?.searchIcon});
  background-position: right 10px center;
  background-repeat: no-repeat;
  background-size: 15px;
  background-color: ${props => props.theme?.colors?.backgroundPage};

`
