import styled, { css, keyframes } from 'styled-components'
import { rgba } from 'polished'

const errorPulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(255, 80, 80, 0.55); }
  70%  { box-shadow: 0 0 0 12px rgba(255, 80, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 80, 80, 0); }
`

export const Container = styled.div`
  border-radius: 8px;
  &.error {
    background-color: orange;
  }
`

export const WrapHeader = styled.div`
  padding: 7px 0px;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme?.colors?.backgroundPage};
  transition: all 0.2s ease;
  border-radius: 8px;
  &:hover {
    transform: translateY(-2px);
  }
  [data-just-snapped='true'] > & {
    animation: ${errorPulse} 1.1s ease-out 1;
  }
`

export const TitleContainer = styled.div`
  margin: 0px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 60%;
  display: flex;
  align-items: center;

  *:first-child {
    margin-right: 8px;
  }

  .title-container {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 576px) {
    width: 70%;
  }
`

export const Title = styled.h3`
  font-weight: 600;
  font-size: 22px;
  line-height: 24px;
  display: flex;
  flex-direction: column;
  margin: 0px;
  white-space: normal;
  span {
    &:not(:first-child) {
      color: ${props => props.theme.colors.grayTextColor};
      font-size: 12px;
      font-weight: 400;
    }
  }
`

export const Flag = styled.span`
  font-size: 13px;
  width: fit-content;
  margin: 10px 0px 0px 0px;
  text-transform: capitalize;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.gray200};
  color: ${({ theme }) => theme.colors.black};
  font-weight: 500;
  padding: 10px;
  border-radius: 15px;

  ${({ required }) => required && css`
    background-color: ${({ theme }) => rgba(theme.colors.primary, 0.12)};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  `}
  @media (min-width: 381px) {
    font-size: 14px;
  }
`
export const OptionThumbnail = styled.div`
  display: inline-block;
  border-radius: 8px;
  background-image: url(${({ src }) => src});
  background-repeat: no-repeat, repeat;
  width: 65px;
  height: 65px;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  justify-content: center;
  align-items: center;
`

export const CollapseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  cursor: pointer;
  color: ${props => props?.theme?.colors?.black};
  background-color: ${props => props?.theme?.colors?.gray300};
  transition: transform 0.2s ease-in-out;
  border-radius: 15px;

  &:hover {
    color: ${props => props?.theme?.colors?.primary};
  }
`

export const CollapsibleContent = styled.div`
  max-height: ${({ isCollapsed }) => isCollapsed ? '0' : 'none'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`
