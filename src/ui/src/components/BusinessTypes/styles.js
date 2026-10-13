import styled, { css } from 'styled-components'

export const TypeContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  justify-content: flex-start;
  text-align: center;
  padding: 0 10px;
  box-sizing: border-box;

  ::-webkit-scrollbar {
      opacity: 0
  }

  ${({ $pillMode }) => $pillMode && css`
    padding: 8px 10px 12px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  `}

  /* Override Tabs component styling to ensure proper alignment */
  > div {
    margin: 0;
    width: 100% !important;
    justify-content: flex-start !important;

    > div {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;
      justify-content: flex-start !important;
    }
  }

  ${({ $pillMode }) => $pillMode && css`
    > div > div {
      flex-direction: row;
      align-items: center;
    }
  `}

  .category {
    padding: 10px 12px;
    margin: 0 4px;
    transition: all 0.3s ease;
    cursor: pointer;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 82px;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      transform: translateY(-2px);
      background: rgba(0, 0, 0, 0.02);
    }

    > span {
      margin: 0 10px;
      transition: color 0.3s ease;
    }

    .category-name:only-child {
      font-weight: 600;
      font-size: 16px;
      color: ${props => props.theme?.colors?.primary || '#333'};
      text-align: center;
      margin-top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 54px;
    }
  }


  .category-name {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 8px 0 0 0 !important;
    font-size: 12px;
    font-weight: 500;
    text-align: center;

    &:only-child {
      margin: 0 !important;
    }
  }

  @media (min-width: 480px){
    .category {
      padding: 10px 16px;
      margin: 0 6px;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
`

export const PillCategoriesRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  width: max-content;

  button {
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    line-height: 24px;
    white-space: nowrap;
    flex-shrink: 0;
    padding-left: 16px;
    padding-right: 16px;
    min-height: 36px;
  }
`

export const PillSkeletonRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  width: max-content;
`

export const ImageContainer = styled.div`
  transition: all 0.3s ease;

  img {
    width: 54px;
    height: 54px;
    border-radius: ${props => props.theme?.utils?.radius?.m || 12}px;
    padding: 4px 5px 0px 5px;
    transition: all 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  ${({ load }) => !load && css`
      opacity: 0;
  `}

  ${({ active }) => active && css`
    img {
      transform: scale(1.05);
    }
  `}
`
