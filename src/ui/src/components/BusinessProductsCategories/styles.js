import styled, { css } from 'styled-components'

export const CategoriesContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 0px 0px 0px 0px;
  border-radius: 30px;
  z-index: 1000;
  position: absolute;
  top: 0;
  text-align: center;
  width: ${props => props.w || '100%'};
  box-sizing: border-box;

  .category-lists-tabs {
    width: 100%;
    min-width: max-content;
  }

  div.category {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 13px 15px;
    margin: 0 5px;

    &:nth-of-type(1) {
      margin-left: 0;
      ${props => props.theme.rtl && css`
        margin-left: 15px;
        margin-right: 15px;
      `}
    }

    &:nth-last-child(1) {
      margin: 0 0 0 5px;
      ${props => props.theme.rtl && css`
        margin: 0 5px 0 0;
      `}
    }
  }


  .list {
    padding: 6px 10px 0px 3px !important;
    min-width: 30px !important;
    margin: 0 12px 0 0 !important;
    overflow: visible !important;
    text-overflow: clip !important;

    svg {
      font-size: 30px;
      border-radius: 10px;
      box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.12);
      color: ${props => props.theme.colors.black};
      background-color: ${props => props.theme.colors.white};
    }
  }

  div.special {
    ${props => !props.featured && css`
      display: none
    `}
  }

  @media (min-width: 769px) {
    ${({ isProfessional }) => isProfessional && css`
      width: 100%;
    `}
  }
  @media (min-width: 992px) {
    ${(props) => props.w && css`
      width: ${props.w};
    `}
  }
`
