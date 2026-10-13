import React from 'react'
import styled, { css } from 'styled-components'
import { Button } from '../../styles/Buttons'

export const Wrapper = styled.div`
  transition: all 0.3s ease;

  .subtitle {
    margin: 0 0 30px;
    font-size: 16px;
    transition: all 0.3s ease;
  }
`

export const ReviewOrderContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  transition: all 0.3s ease;

  .extra-comment-title {
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
  }
`

export const Comments = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  transition: all 0.3s ease;

  p {
    text-transform: capitalize;
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 15px;
    color: ${props => props.theme?.colors.darkTextColor};
    transition: all 0.3s ease;
  }

  textarea {
    min-height: 80px;
    transition: all 0.3s ease;

    &:focus {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
`

export const Send = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  width: 100%;
  transition: all 0.3s ease;

  /* keep the primary CTA visible while the review scrolls on mobile */
  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    background-color: ${props => props.theme?.colors?.backgroundPage};
    padding: 10px 0;
    z-index: 10;
  }

  ${({ useSimpleRating }) => useSimpleRating && css`
    justify-content: space-between;
  `}

  span {
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    user-select: none;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }

  button {
    font-size: 14px;
    padding: 6px 20px;
    width: 300px;
    height: 45px;
    line-height: 0;
    transition: all 0.3s ease;
    svg {
      color: white;
      font-size: 21px;
      vertical-align: middle;
      margin-left: 8px;
      transition: all 0.3s ease;
      ${props => props.theme?.rtl && css`
        margin-left: 0;
        margin-right: 8px;
        transform: rotateZ(180deg);
      `}
    }
    ${({ useSimpleRating }) => useSimpleRating && css`
      width: 100%;
      height: 60px;
      font-size: 18px;
      font-weight: 600;
      border-radius: 30px;
    `}

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  @media (max-width: 512px) {
    button {
      width: 200px;
    }
  }
`

const BusinessLogoStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  min-height: 45px;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (min-width: 481px){
    min-height: 45px;
    ${({ isMulti }) => isMulti && css`
      width: 124px;
      height: 124px;
    `}
  }
`

export const BusinessLogo = (props) => {
  const style = {}
  if (props.bgimage) {
    style.backgroundImage = `url(${props.bgimage})`
  }

  return (
    <BusinessLogoStyled {...props} style={style}>
      {props.children}
    </BusinessLogoStyled>
  )
}

export const WrapperBusinessLogo = styled.div`
  align-self: center;
  width: 45px;
  height: 45px;
  min-height: 45px;
  max-width: 45px;
  ${({ isMulti }) => isMulti && css`
    max-width: initial;
    width: 100%;
  `}
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

export const ReviewsProgressWrapper = styled.div`
  width: 100%;
  margin-top: 50px;
  transition: all 0.3s ease;

  ${({ useSimpleRating }) => useSimpleRating && css`
    margin-top: 20px;
  `}

  p {
    margin-top: 0;
    margin-bottom: 17px;
    font-size: 15px;
    color: ${props => props.theme?.colors.darkTextColor};
    transition: all 0.3s ease;
  }

  .rating-container {
    display: flex;
    gap: 20px;
    justify-content: flex-start;
    transition: all 0.3s ease;

    div {
      box-shadow: 0px 1px 4px rgba(0,0,0,0.1);
      cursor: pointer;
      font-size: 30px;
      padding: 10px;
      padding: 9px 12px 0px 14px;
      border-radius: 15px;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }
`

export const ReviewsProgressContent = styled.div`
  background: #E9ECEF;
  border-radius: 50px;
  width: 100%;
  height: 6px;
  position: relative;
  margin-bottom: 30px;
  transition: all 0.3s ease;
`

export const ReviewsProgressBar = styled.div`
  height: 6px;
  border-radius: 50px;
  background: #344050;
  transition: all 0.3s ease;
`

export const ReviewsMarkPoint = styled.div`
  position: absolute;
  top: 15px;
  font-size: 12px;
  color: #CED4DA;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  ${({ active }) => active && css`
    > span {
      color: #344050;
    }
  `}

  &.mark-point {
    span {
      position: relative;
      margin-left: -50%;
      transition: all 0.3s ease;
      ${props => props.theme?.rtl && css`
        margin-right: -50%;
        margin-left: 0;
      `}

      > span {
        position: absolute;
        height: 6px;
        top: -15px;
        width: 2px;
        background: #CED4DA;
        transition: all 0.3s ease;
      }
    }
  }

  ${({ pass }) => pass && css`
    span {
      > span {
        background: transparent !important;
      }
    }
  `}
`

export const LogoAndReviewWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  .comments-title {
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .business-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;

    .business-text {
      p {
        margin: 0;
        font-size: 14px;
        transition: all 0.3s ease;
      }
      .bold {
        font-size: 20px;
        font-weight: 600;
        transition: all 0.3s ease;
      }
    }
  }
`

export const CommentsList = styled.div`
  padding: 2px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 10px 0;
  transition: all 0.3s ease;

  button {
    transition: all 0.3s ease;

    ${props => props.theme?.rtl && css`
      margin-left: 40px;
      margin-right: 0;
    `}

    svg {
      vertical-align: middle;
      margin-left: 5px;
      transition: all 0.3s ease;

      ${props => props.theme?.rtl && css`
        margin-right: 5px;
        margin-left: 0;
      `}
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`

export const CommentButton = styled(Button)`
  height: 45px;
  margin-right: 0px;
  border-radius: 50px;
  margin-bottom: 0px;
  font-size: ${props => props.theme?.utils?.tsize?.xs}px;
  font-weight: 600;
  background: ${props => props.theme?.colors.gray300};
  border: 1px solid ${props => props.theme?.colors.gray200};
  color: ${props => props.theme?.colors.black};
  transition: all 0.25s ease;

  ${props => props.theme?.rtl && css`
    margin-left: 18px;
    margin-right: 0;
  `}

  svg {
    vertical-align: middle;
    margin-left: 5px;
    transition: all 0.25s ease;

    ${props => props.theme?.rtl && css`
      margin-right: 5px;
      margin-left: 0;
    `}
  }

  &:hover {
    background: ${props => props.theme?.colors.backgroundPage};
    border-color: ${props => props.theme?.colors.primary};
    color: ${props => props.theme?.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
  }

  ${({ active }) => active && css`
    background: ${props => props.theme?.colors.primary};
    border: 1px solid ${props => props.theme?.colors.primary};
    color: ${props => props.theme?.colors.white};

    &:hover {
      background: ${props => props.theme?.colors.primary};
      border-color: ${props => props.theme?.colors.primary};
      color: ${props => props.theme?.colors.white};
    }
  `}
`

export const ContinueContainer = styled.div`
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  p {
    flex: 1;
    margin: 0;
    transition: all 0.3s ease;
  }
`

export const MultiLogosContainer = styled.div`
  display: flex;
  justify-content: space-around;
  transition: all 0.3s ease;
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #E9ECEF;
  margin: 20px 0;
  transition: all 0.3s ease;
`
