import React from 'react'
import styled, { css } from 'styled-components'

export const BusinessInformationContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: auto;
`

export const BussinessTitle = styled.div`
  z-index: 1000;
  display: inline-flex;
  width: 50%;
  background: ${(props) => props.theme?.colors?.backgroundPage};
  align-items: center;
  margin-left: 10px;
  margin-bottom: 10px;
  border-radius: 16px;
  padding: 10px;
  ${props => props.theme?.rtl && css`
    margin-right: 10px;
    margin-left: 0px;
  `}
`

export const HeaderImage = styled.div`
  width: 20%;
  margin-top: auto;
  > img {
    width: 100%;
    height: 100%;
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
  min-height: 75px;
  border-radius: 10px;
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

export const Information = styled.div`
  display: inline-flex;
  flex-direction: column;
  flex: 1;
  > h5 {
    margin-block-end: 0.8em;
    margin-block-start: 0.8em;
  }
  > p {
    margin-block-end: 0;
    margin-block-start: 0.3em;
    > svg {
      vertical-align: middle;
    }
  }
`

export const BusinessContent = styled.div`
  background: ${props => props.theme.colors.backgroundPage};

  .business-location-container {
    padding: 0 10px;

    @media(min-width: 768px){
      padding: 0 20px;
    }
  }
`

export const SectionTitle = styled.h3`
  font-weight: 700;
  font-size: 16px;
  color: ${props => props.theme.colors.darkTextColor};
  margin: 15px 0 15px 0;
`

export const Map = styled.div`
  width: calc(100% + 20px);
  margin-left: -10px;
  height: 135px;
  margin-bottom: 20px;

  > div {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: 30px;
  }
  @media(min-width: 768px){
    width: calc(100% + 40px);
    margin-left: -20px;
  }
`

export const ScheduleSection = styled.div`
  width: 100%;
  margin-bottom: 35px;
`

export const ScheduleContainer = styled.div`
  width: 100%;
  background: ${props => props?.theme?.colors?.gray300};
  border-radius: 20px;
  padding: 15px 0;
`

export const ScheduleBlock = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  justify-content: space-between;

  h4 {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: ${props => props.theme.colors.darkTextColor};
    margin: 0;
  }

  p {
    font-size: 14px;
    margin: 0;
    color: ${props => props.theme.colors.darkTextColor};

    &.close {
      color: #E63757;
      margin-right: 20px;
      ${props => props.theme?.rtl && css`
        margin-left: 20px;
        margin-left: 0;
      `}
    }
  }

  > div {
    display: flex;
    align-items: center;

    > div {
      margin: 0 5px;
    }
  }
`

export const DeliveryInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 10px 0 10px;

  h5 {
    margin: 0;
    font-size: 16px;
  }

  > div {
    padding: 10px 0;
    width: 100%;
    display: flex;
    flex-direction: column;

    > div {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 25px;

      &:nth-last-child(1) {
        margin-top: 10px;
      }

      svg {
        font-size: 16px;
        margin-bottom: -3px;
        margin-right: 10px;
      }

      > div {
        min-width: 75px;
        display: flex;
        justify-content: flex-start;
      }
    }
  }
`
export const BusinessMediaContent = styled.div`
  padding-bottom: 20px;
  overflow: auto hidden;
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  > div {
    display: flex;
    box-sizing: border-box;
    > span {
      > img,
      > iframe {
        object-fit: cover;
        border-radius: 10px;
        margin: 10px 10px;
        width: 215px;
        height: 140px;
        border-radius: 20px;
        cursor: pointer;
      }
    }
  }
`

export const ModalIcon = styled.span`
  display: flex;
  position: absolute;
  width: 30px;
  height: 30px;
  font-size: 30px;
  cursor: pointer;
  color: ${props => props.theme?.colors.headingColor};
  border-radius: 50%;
  left: 5px;
  top: 5px;
  z-index: 1;
  ${props => props.theme?.rtl && css`
    left: 5px;
    right: initial;
  `}
  @media (min-width: 578px){
    right: 10px;
    ${props => props.theme?.rtl && css`
    left: 10px;
    right: initial;
  `}
  }
  @media (min-width: 768px){
    left: 25px;
    top: 30px;
    ${props => props.theme?.rtl && css`
    right: 25px;
    left: initial;
  `}
  }
`

export const Description = styled.p`
  margin: 10px 0 0px;
  font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};;
  font-size: 14px;
`

export const ImageContainer = styled.div`
  max-height: 85%;
  img {
    margin-bottom: -2px;
    width: 100%;
    height: auto;
    aspect-ratio: attr(width) / attr(height);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  @media (max-width: 768px) {
    height: 85vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

export const BusinessTitle = styled.h2`
  font-weight: 600;
  font-size: 24px;
  color: ${props => props.theme.colors.darkTextColor};
  margin-top: 0;
  margin-bottom: 0;
  ${props => props.theme?.rtl && css`
    padding-right: 30px;
    padding-left: 0;
  `}
`

export const BusinessAddress = styled.p`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => props.theme.colors.darkTextColor};
  margin: 35px 0 15px;

  svg {
    color: ${props => props.theme.colors?.primary};
    font-size: 16px;
    margin-right: 10px;
  }
`
export const BusinessAddressNotes = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.darkTextColor};
  margin: 15px 0 25px 0;
`

export const Divider = styled.div`
  background: #E9ECEF;
  height: 2px;
`
