import React from 'react'
import styled, { css } from 'styled-components'

export const CardContainer = styled.div`
  background: ${props => props.theme.colors?.backgroundPage};
  display: flex;
  flex-direction: row-reverse;
  cursor: pointer;
  padding: 15px 20px;
  border-radius: 15px;
  border: 1px solid #E9ECEF;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }
`

const CardLogoStyled = styled.div`
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: contain;
  background-position: center;
  object-fit: cover;
  height: 110px;
  width: 110px;
  min-width: 110px;
  min-height: 110px;
  border-radius: 12px;
  box-shadow: 0px 1px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

export const CardLogo = (props) => {
  const style = {}
  if (props.bgimage) {
    style.backgroundImage = `url(${props.bgimage})`
  }
  if (props.soldOut) {
    style.filter = 'brightness(70%)'
  }
  return (
    <CardLogoStyled {...props} style={style}>
      {props.children}
    </CardLogoStyled>
  )
}

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  color: ${props => props.theme.colors.black};
  transition: all 0.3s ease;
  ${props => !props.theme?.rtl
    ? css`margin-right: 15px;`
    : css`margin-left: 15px;`}

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    font-weight: 600;
    transition: all 0.3s ease;

    span.name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: all 0.3s ease;
    }
  }

  .status-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 40px;
    font-size: 16px;
    font-weight: 400;
    transition: all 0.3s ease;

    span {
      transition: all 0.3s ease;
    }
  }

  p.date {
    font-size: 16px;
    margin: 7px 0;
    line-height: 24px;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  }

  p.status {
    font-size: 16px;
    line-height: 24px;
    margin: 0;
    transition: all 0.3s ease;
  }
`
