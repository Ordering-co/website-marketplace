import styled, { css } from 'styled-components'
import React from 'react'

export const LastOrdersContainer = styled.div`
  margin-bottom: 10px;
`

export const OrderCard = styled.div`
  min-height: 70px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  border-radius: 15px;
  border: 1px solid #E9ECEF;
  margin-bottom: 20px;
  padding: 15px 20px;

  .order-container {
    display: flex;
    gap: 20px;
    position: relative;
  }

  &:hover {
    border: 1px solid ${props => props.theme.colors.primary};
  }

  ${({ active }) => active && css`
    border: 1px solid ${props => props.theme.colors.primary};
  `}

  p,
  h2 {
    color: ${props => props.theme.colors.headingColor};
    margin: 0px;
  }

  h2 {
    font-size: 16px;
    font-weight: 600;
  }

  .order-type-status {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    p {
      color: ${props => props.theme.colors.black};
    }
    .green {
      color: ${props => props.theme.colors.primary};
    }
    button {
      max-width: 150px;
      min-height: 32px;
      padding: 4px 10px;
      font-size: ${props => props.theme?.utils?.tsize?.xs}px;
      border-radius: ${props => props.theme?.utils?.radius?.s}px;
    }
  }

  .order-header-left {
    display: flex;
    align-items: center;
  }

  .order-header-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .order-price {
    display: flex;
    justify-content: flex-end;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
export const WrapperImage = styled.div`
  max-width: 45px;
  max-height: 45px;
  height: 45px;
  width: 45px;
  ${({ isSkeleton }) => !isSkeleton && css`
    border: 1px solid #E3E3E3;
    border-radius: 10px;
  `}
  ${({ hideContent }) => hideContent && css`
    max-width: 70px;
    max-height: 70px;
    height: 70px;
    width: 70px;
  `}
  svg {
    width: 100%;
    height: 100%;
    padding: 7px;
    box-sizing: border-box;
    border-radius: 50%;
  }
`

const ImageStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  border-radius: 10px;
`
export const Image = (props) => {
  return (
    <ImageStyled
      {...props}
      style={{ backgroundImage: `url(${props.bgimage})` }}
    >
      {props.children}
    </ImageStyled>
  )
}

export const OrderHeader = styled.div`
  > div {
    display: flex;
    margin: 5px 0 10px;
  }

  > p {
    margin-top: 5px;
    color: ${props => props.theme.colors.darkGray};
  }
`
