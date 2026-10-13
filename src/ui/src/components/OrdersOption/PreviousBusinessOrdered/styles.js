import styled, { css } from 'styled-components'

export const BusinessListWrapper = styled.div`
  overflow: auto hidden;
  width: 100%;

  ${({ isLoading }) => isLoading
? css`
    ::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
  `
: css`
      ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
      }
  `}
`

export const BusinessList = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  align-items: center;
  ${({ noResults }) => noResults && css`
    justify-content: center;
  `}
  @media (min-width: 480px){
    flex-direction: row;
  }
  ${({ horizontal }) => horizontal && css`
    #searchlistorder {
      > div {
        width: calc(100% - 40px);
        min-width: calc(100% - 40px);

        @media (min-width: 681px) {
          width: calc(50% - 40px);
          min-width: calc(50% - 40px);
        }
        @media (min-width: 993px) {
          width: calc(33% - 40px);
          min-width: calc(33% - 40px);
        }
        @media (min-width: 1200px) {
          width: calc(25% - 40px);
          min-width: calc(25% - 40px);
        }
      }
    }
  `}
  .vertical {
    padding: 4px 0;
    width: 100%;

    > div {
      padding: 5px 20px 20px;
    }

    .card-wrapper {
      height: 120px;
      > div {
        height: 100px;

        > div:first-child {
          justify-content: space-between;
        }
      }
    }
  }
`
