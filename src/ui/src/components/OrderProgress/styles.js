import styled, { css } from 'styled-components'
import React from 'react'

export const OrderProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 15px;
  > div {
    width: 100%;
  }

  @media (min-width: 768px) {
    > div {
      width: 50%;
    }
  }

  > a {
    font-weight: 500;
    border-radius: ${props => props.theme.utils.radius.s}px;
    padding-top: 2px;
    padding-bottom: 2px;
  }
`

export const OrderProgressWrapper = styled.div`
  padding: 45px 20px;
  margin: 10px 10px 20px;
  background: #FFFFFF;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${props => props.theme.utils.radius.s}px;
  padding: 15px;

  @media (min-width: 768px) {
    margin: 0 20px 30px;
    padding: 10px 20px;
  }
`

export const OrderInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  @media (min-width: 768px) {
    margin-bottom: 0px;
  }
`

export const ProgressLogoStyled = styled.div`
  width: 48px;
  min-width: 48px;
  height: 48px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${props => props.theme.utils.radius.s}px;

  ${({ bgimage }) => bgimage && css`
    background-repeat: no-repeat, repeat;
    background-size: cover;
    object-fit: cover;
    background-position: center;
  `}

  @media (min-width: 576px) {
    width: 48px;
    min-width: 48px;
    height: 48px;
  }
`

export const ProgressLogo = (props) => {
  const style = {}
  style.backgroundImage = `url(${props.bgimage})`
  style.backgroundSize = 'contain'

  return (
    <ProgressLogoStyled {...props} style={style}>
      {props.children}
    </ProgressLogoStyled>
  )
}

export const ProgressDescriptionWrapper = styled.div`
  margin-left: 20px;
  ${props => props.theme.rtl && css`
    margin-left: 0px;
    margin-right: 20px;
  `}

  h2 {
    font-weight: 600;
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 0px;
  }

  p {
    font-size: 12px;
    margin: 0;
  }

  a {
    display: flex;
    align-items: center;
    padding: 0px;
    margin-top: 0px;
    font-size: 12px;
    line-height: 25px;
    svg {
      margin-left: 5px;
      ${props => props.theme.rtl && css`
        margin-left: 0px;
        margin-right: 5px;
      `}
    }
    &:hover {
      text-decoration: underline;
    }
  }

  @media (min-width: 576px) {
    h2 {
      font-size: 20px;
    }
    p {
      font-size: 16px;
    }
    a {
      font-size: 16px;
      margin-top: 2px;
      line-height: 30px;
    }
  }

  @media (min-width: 768px) {
    margin-left: 35px;

    ${props => props.theme.rtl && css`
      margin-left: 0px;
      margin-right: 35px;
    `}
  }
`

export const ProgressBarWrapper = styled.div`
  padding: 0px;
  box-sizing: border-box;
`

export const ProgressContentWrapper = styled.div`
  width: 100%;
  height: 12px;
  background: ${props => props?.theme?.colors?.lightGreen};
  border-radius: ${props => props?.theme?.utils?.radius?.m}px;
`

export const ProgressBar = styled.div`
  height: 12px;
  background: ${props => props?.theme?.colors?.darkGreen};
  width: 0px;
  border-radius: ${props => props?.theme?.utils?.radius?.m}px 0px 0px ${props => props?.theme?.utils?.radius?.m}px;
`

export const ProgressTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
`

export const StatusWrapper = styled.p`
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 14px;
  margin-right: 10px;

  ${props => props.theme.rtl && css`
    margin-right: 0px;
    margin-left: 10px;
  `}
`

export const TimeWrapper = styled.div`
  font-size: 12px;
  color: ${props => props.theme?.colors.black};
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex-direction: column;

  .time-wrapper {
    font-weight: 600;
  }

  @media (min-width: 576px) {
    flex-direction: row;
    font-size: 14px;
  }
`

export const Divider = styled.div`
  height: 5px;
  background: ${props => props.theme?.colors.gray200};
  margin: 10px 10px 15px;
`
