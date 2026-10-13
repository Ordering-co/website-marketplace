import styled, { css } from 'styled-components'

export const CategoriesWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  transition: all 0.3s ease;

  ${({ isPopover }) => !isPopover && css`
    border: 1px solid #ccc;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  `}

  @media (min-width: 993px) {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100vh - 75px);
    padding-bottom: 20px;

    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
`

export const CategoriesContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 15px 0 0 0;
  padding-bottom: 0;
  background: ${props => props.theme.colors.backgroundPage};
  z-index: 1000;
  text-align: center;
  width: 100%;
  top: 45px;
  position: sticky;
  transition: all 0.3s ease;

  div.category {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  ${({ isPopover }) => isPopover && css`
    width: unset;
  `}

  div.special {
    ${props => !props.featured && css`
      display: none;
    `}
  }

  @media (min-width: 381px) {
    padding: 5px;
  }

  @media (min-width: 993px) {
    overflow-x: hidden;
  }
`

export const CategoryTab = styled.div`
  padding: 12px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: ${props => props.categorySpace ?? 0}px;
  text-align: left;
  border-bottom: ${({ isSub }) => !isSub ? '1px solid #ccc' : ''};
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 2px 4px;
  margin-left: ${props => props.categorySpace ?? 0}px;

  &:hover {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  }

  span {
    width: 90%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  &:hover span {
    color: ${props => props.theme?.colors?.primary || '#000'};
    font-weight: 600;
  }

  ${({ active }) => active && css`
    background: linear-gradient(135deg, ${props => props.theme.colors.primaryContrast} 0%, ${props => props.theme.colors.primaryContrast}dd 100%);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);

    span {
      color: ${props => props.theme?.colors?.primary || '#000'};
      font-weight: 600;
    }
  `}
`

export const IterateCategoriesContainer = styled.div`
  transition: all 0.3s ease;

  div.level-1 {
    border-bottom: ${({ isSub }) => !isSub ? '1px solid #ccc' : ''} !important;
  }

  &:hover {
    transform: scale(1.01);
  }
`
