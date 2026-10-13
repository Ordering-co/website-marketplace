import styled, { css } from 'styled-components'

export const Container = styled.div`
  min-height: 55vh;
  > h1 {
    width: 90%;
    margin: auto;
  }

  > p {
    width: 90%;
    margin: 10px auto;
    font-size: 15px;
    margin-top: 20px;
  }

  span.bold {
    font-weight: 600;
  }

  @media (min-width: 768px){
    > h1 {
      width: 63%;
      margin: auto;
    }

    > p {
      width: 63%;
      margin: 10px auto;
    }
  }

  @media (min-width: 1280px){
    > h1 {
      font-size: 36px;
    }

  }
`

export const UserProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 90%;
  margin: 25px auto ${props => props.mbottom ? `${props.mbottom}px` : 'auto'};
`

export const ProfileOptionsList = styled.div`
  width: 100%;

  a, div {
    font-weight: normal;
  }
`

const PopoverListItemStyles = css`
  display: flex;
  padding: 10px 0;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #000000;
  border-radius: 15px;

  svg {
    margin-right: 5px;
    ${props => props.theme?.rtl && css`
      margin-left: 5px;
      margin-right: 0px;
    `}
  }

  :hover {
    cursor: pointer;
    background-color: #f8f8f8;
  }

  :last-child {
    border-bottom: 0;
  }
`

export const ListItem = styled.div`
  ${PopoverListItemStyles}
  margin-bottom: 10px;
`

export const ListLink = styled.a`
  ${PopoverListItemStyles}
  text-decoration: none;

  ${({ active }) => active && css`
    background-color: #eee;
  `}
`

export const UserImage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  position: relative;
  background-color: ${props => props.theme.colors.gray300};
  border-radius: 15px;
  margin-bottom: 20px;
  p {
    font-size: 18px;
    margin: 20px;
  }

  @media (min-width: 768px){
    width: 70%;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`

export const Image = styled.div`
  width: 112px;
  height: 112px;
  border-radius: 15px;
  overflow: hidden;
  padding: 20px;
  cursor: -webkit-grab;
  cursor: grab;

  img,
  div {
    width: 100%;
    border-radius: 15px;
    height: 100%;
    border: none;
    overflow: hidden;
    background: #00000008;
  };

  img {
    object-fit: cover;
  }

  @media (min-width: 480px){
    width: 112px;
    height: 112px;
  }
`

export const SideForm = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 70%;
    display: flex;
    align-items: center;
  }
`

export const IconContainer = styled.div`
  position: absolute;
  right: 25px;
  bottom: 22px;

  svg {
    font-size: 22px;
    color: white;
  }
`

export const UserData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;

  h1 {
    font-size: 20px
  }

  > * {
    margin: 5px 0;
    width: 75%;
  }

  > button {
    width: auto;
    background: ${props => props.theme.colors.backgroundPage};
  }

  @media (min-width: 768px){
    align-items: flex-start;
    text-align: left;
    ${props => props.theme?.rtl && css`
     text-align: right;
    `}
  }

`

export const SavedPlaces = styled.div`
  width: 90%;
  text-align: center;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;

  > div{
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }

  button{
    width: 100%;
    align-self: center;
  }

  @media (min-width: 768px){
    width: 75%;
    margin-top: 10px;
    h1 {
      font-size: 24px;
      text-align: left;
    }
    ul{
      width: 100%;
    }
    button {
      width: 50%;
      align-self: flex-end;
    }
  }

`

export const UploadImageIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  span {
    margin: 0;
  }

  svg {
    width: 45px;
    height: 45px;
  }
`

export const SkeletonWrapper = styled.div`
  span {
    height: 100%;
    position: relative;
    top: -2.5px;
  }
`

export const WrapperForm = styled.div`
  @media (min-width: 768px) {
    width: 100%;
  }
`
