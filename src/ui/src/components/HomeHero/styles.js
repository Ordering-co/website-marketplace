import React from 'react'
import styled, { css } from 'styled-components'

export const HeroContainerStyled = styled.div`
  width: 100%;
  height: fit-content;
  min-height: 374px;
  position:relative;
  ${({ mb }) => mb && css`
    margin-bottom: ${mb};
  `}


  ${({ bgimage }) => bgimage && css`
    background-repeat: no-repeat, repeat;
    background-size: cover;
    object-fit: cover;
    background-position: center;
  `}

  @media (min-width: 375px) {
    min-height: 374px;
  }

  @media (min-width: 567px) {
    height: calc(100vh - 65px);
    height: calc(100dvh - 65px); /* dvh = visible viewport under mobile URL bars (vh fallback above) */
    ${({ isFullScreen }) => !isFullScreen && css`
      height: calc(60vh - 65px);
      height: calc(60dvh - 65px);
    `}
    margin-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.15);
    z-index: 1;
  }

  & > * {
    position: relative;
    z-index: 2;
  }
`

export const HeroContainer = (props) => {
  const style = { backgroundImage: `url(${props.bgimage})` }

  return (
    <HeroContainerStyled {...props} style={style}>
      {props.children}
    </HeroContainerStyled>
  )
}

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    min-height: 100%;
    padding: 0px 10vw 0px;

    input {
      width: 90%;
      margin-bottom: 15px;
    }

    @media (min-width: 576px) {
      justify-content: center;
      padding: 0px 40px 0px;
      input {
        width: 97%;
      }
    }

    @media (min-width: 768px) {
      ${props => props.theme?.rtl && css`
        padding: 0px 40px 0px;
      `}
    }
`

export const Title = styled.h1`
  margin: 0px 0px 10px 0px;
  text-align: left;
  font-weight: 400;
  font-size: 26px;
  line-height: 36px;
  letter-spacing: 0px;
  color: #FFFFFF;
  text-shadow: 0px 3px 6px #2c2e33;
  opacity: 1;

  span.highlight {
    font-weight: 900;
    text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  }

  ${props => props.theme?.rtl && css`
    text-align: right;
  `}

  @media (min-width: 381px) {
    font-size: 35px;
  }


  @media (min-width: 576px) {
    font-size: 40px;
    line-height: initial;
  }

  @media (min-width: 850px) {
    font-size: 60px;
  }
`

export const Slogan = styled.p`
  margin: 0px;
  text-align: left;
  font-size: .96rem;
  line-height: 24px;
  letter-spacing: 0px;
  color: #FFFFFF;
  opacity: 1;
  text-shadow: 0px 3px 6px #2c2e33;
  margin-bottom: 30px;

  ${props => props.theme?.rtl && css`
      text-align: right;
  `}

  @media (min-width: 480px) {
    font-size: 24px;
    line-height: initial;
    margin-bottom: 37px;
  }
`

export const WrapInput = styled.div`
  position: relative;
  cursor: pointer;
  background: #FFFFFF;
  padding: 8px 16px;
  border: 1px solid ${props => props.theme?.colors.darkGray};
  box-sizing: border-box;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.12);
  border-radius: ${props => props.theme?.utils?.radius?.s}px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.12);
    box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.1);
  }

  ${({ $withIcon }) => $withIcon && css`
    width: calc(100%);
    box-sizing: border-box;

    &::before {
      content: "";
      position: absolute;
      right: 5px;
      top: 0;
      bottom: 18px;
      width: 15px;

      ${props => props.theme?.rtl && css`
        left: 5px;
        right: initial;
     `}
    }

    @media (min-width: 576px) {
      padding: 15px 25px;
    }

    @media (min-width: 1024px) {
      width: calc(70% - 20px);
      max-width: 765px;
    }
  `}

  p {
    color: ${props => props.theme.colors.darkTextColor};
    position: relative;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    line-height: 18px;
    @media (min-width: 576px) {
      font-size: 1rem;
      line-height: initial;
    }
  }

  svg {
    color: ${props => props?.theme?.colors?.primary};
    font-size: 22px;
    transition: all 0.3s ease;
    ${props => props.theme?.rtl
? css`
      margin-left: 12px;
    `
: css`
      margin-right: 12px;
    `}

    @media (min-width: 576px) {
      ${props => props.theme?.rtl
? css`
        margin-left: 20px;
      `
: css`
        margin-right: 20px;
      `}
    }
  }
  &:hover svg {
    transform: scale(1.1);
  }
`

export const UseAccount = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  min-height: 30vh;
  padding: 10vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > button {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 14px;
    line-height: 24px;
  }

  > *:last-child {
    margin-top: 14px;
    background-color: #E9F2FE;
    color: ${props => props.theme.colors.primary};
  }

  @media (min-width: 576px) {
    display: none;
  }
`

export const SectionHeader = styled.div`
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  color: #344050;
  margin: 0;
  margin-bottom: 27px;
  width: 100%;
`

export const LogoWrapper = styled.div`
  width: 150px;
  margin: 53px auto;
  display: flex;
  justify-content: center;
  img {
    width: 100%;
    object-fit: fill;
  }
`
export const HeroContent = styled.div`
  padding-left: 0;

  @media (min-width: 768px) {
    padding-left: 20px;
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  button {
    font-size: 14px;
    line-height: 18px;
    padding: 15px 16px;
    white-space: nowrap;
    border-radius: ${props => props.theme?.utils?.radius?.m}px;
    margin-bottom: 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      filter: brightness(1.1);
    }

    &:active {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 768px) {
      width: 100%;
      height: 100%;
      font-size: 18px;
      max-width: 254px;
      margin-bottom: 0;
      line-height: initial;
    }
  }
`
