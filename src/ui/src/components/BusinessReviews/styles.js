import styled, { css } from 'styled-components'

export const BusinessReviewsContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  padding: 0px;
  box-sizing: border-box;
  .reviews-container-column {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`

export const ReviewOf = styled.div``

export const Content = styled.div`
  overflow: auto hidden;
  width: 100%;
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  > div {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    align-items: center;

    h3 {
      display: none;
    }

    @media (min-width: 480px) {
      h3 {
        display: block;
        color: ${props => props.theme.colors.primary};
        margin: 0px;
        svg {
          font-size: 26px;
          vertical-align: text-top;
        }
      }
    }

    #reviews > div {
      border-radius: 15px;
      border-left: 1px solid #E9ECEF;
      margin-right: 20px;
      transition: all 0.3s ease;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
      }
    }

    ${({ isColumnMode }) => isColumnMode && css`
      justify-content: center;

      #reviews > div {
        margin-right: 0;
      }
    `}
  }
`

export const Review = styled.div`
  padding: 15px;
  margin: 10px 0;
  width: 350px;
  height: 165px;
  /* transition: all 0.3s ease;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  } */

  @media (min-width: 480px) {
    margin: 20px 0;
  }

  ${({ reviewName }) => !reviewName && css`
    height: 130px;
  `}

  ${({ isColumnMode }) => isColumnMode && css`
    height: unset;
  `}
`

export const ReviewsNotFound = styled.h2`
  margin: 0;
  font-size: 14px;
  color: ${props => props.theme.colors.lightGray};
  text-align: center;
`

export const SkeletonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex: 1;

    > div {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
`

export const ReviewsHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  svg {
    font-size: 30px;
    color: ${props => props.theme?.colors.primary};
    margin-right: 13px;
    ${props => props.theme?.rtl && css`
       margin-left: 13px;
       margin-right: 0;
    `}
  }
  h1 {
    margin: 20px 0 0 0;
  }
  h2 {
    z-index: 9999;
    font-weight: 400;
    font-size: 20px;
    margin: 0;
    color: ${props => props.theme?.colors.darkTextColor};
    span {
      cursor: pointer;
    }
  }

  ${({ noReviews }) => noReviews && css`
    svg {
      color: ${props => props.theme.colors.lightGray};
    }
  `}

  ${({ isColumnMode }) => isColumnMode && css`
    h1 {
      margin: 0 0 0 28px;
    }
  `}

  ${({ isModal }) => isModal && css`
    h2 {
      margin: 0 0 40px 0;
      font-size: 24px;
      font-weight: 700;
    }
  `}
`

export const ReviewsProgressWrapper = styled.div`
  p {
    margin-top: 0;
    font-size: 14px;
    color: ${props => props.theme?.colors.darkTextColor};
  }
`

export const ReviewsProgressContent = styled.div`
  background: #E9ECEF;
  border-radius: 50px;
  width: 100%;
  height: 4px;
  position: relative;
  margin-bottom: 30px;
`

export const ReviewsProgressBar = styled.div`
  height: 4px;
  border-radius: 50px;
  background: #344050;
`

export const ReviewsMarkPoint = styled.span`
  position: absolute;
  top: 15px;
  font-size: 12px;
  color: #CED4DA;
  cursor: pointer;
`

export const ReviewTime = styled.p`
  font-size: 12px;
  color: ${props => props.theme?.colors.darkGray};
  margin: 0;
`

export const ReviewItemHeader = styled.div`
  display: flex;
  margin-bottom: 15px;

  p {
    font-size: 16px;
  }

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }

  .review-avatar {
    width: 75px;
    height: 75px;
    background-color: #000;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 40px;
    font-weight: bold;
    border-radius: ${props => props.theme?.utils?.radius?.s}px;
  }

  .review-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .review-time {
    margin-top: 5px;
  }

  ${({ isColumnMode }) => isColumnMode && css`
    .review-avatar {
      width: 50px;
      height: 50px;
      font-size: 28px;
    }
  `}
`

export const ReviewItemContent = styled.div`
  font-size: 16px;
  color: ${props => props.theme?.colors.darkTextColor};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  white-space: pre-wrap;

  ${({ isEmpty }) => isEmpty && css`
    color: ${props => props.theme?.colors.lightGray};
    font-style: italic;
  `}
`

export const SearchContainer = styled.div`
  margin: 35px 0;

  input {
    outline: none;
    border: none;
    border-bottom: 1px solid #E9ECEF;
    border-radius: 0px;
    width: 100%;
    background-repeat: no-repeat;
    background-size: 20px 18px;
    background-position: left center;
    box-sizing: border-box;
    padding: 7px 0 7px 30px;

    ${props => props.theme?.rtl && css`
      padding: 7px 30px 7px 0;
      background-position: right center;
    `}
  }
`

export const ReviewStars = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;

  .star {
    transition: color 0.2s ease;
  }

  ${({ reviewName }) => reviewName && css`
    > p {
      margin-left: 5px;
    }
  `}
`

export const ReviewRatingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    margin: 0;
    font-size: 96px;
    font-weight: 700;
    color: ${props => props.theme?.colors.black};

    p {
      margin: 0;
      font-size: 14px;
      font-weight: 400;
      color: ${props => props.theme?.colors.black};
      text-align: center;
    }
  }
`
