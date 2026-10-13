import styled, { css } from 'styled-components'

export const HelpContainer = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 15px 15px 15px;
  box-sizing: border-box;
  min-height: calc(100vh - 280px);
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    width: 70%;
  }
`

export const BreadCrumbContainer = styled.div`
  margin-bottom: 23px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  svg {
    font-size: 13px;
    color: ${props => props.theme?.colors.darkGray};
    margin: 0 7px;
    transition: all 0.3s ease;

    ${props => props.theme?.rtl && css`
      transform: rotateZ(180deg);
    `}
  }

  span {
    font-size: 12px;
    color: #344050;
    transition: all 0.3s ease;

    &.deactive {
      color: ${props => props.theme?.colors.darkGray};
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateX(2px);
      }
    }
  }
`

export const Title = styled.h1`
  font-weight: 600;
  font-size: 32px;
  margin-bottom: 30px;
  margin-top: 0;
  transition: all 0.3s ease;
`

export const SubTitle = styled.h1`
  font-weight: 600;
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 18px;
  transition: all 0.3s ease;
`

export const HelpContentWrapper = styled.div`
  transition: all 0.3s ease;
`

export const SubPageList = styled.div`
  padding-bottom: 20px;
  margin-bottom: 40px;
  border-bottom: 1px solid #E9ECEF;
  transition: all 0.3s ease;
`

export const SubPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);
  border-radius: 15px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

    .icon {
      svg {
        transform: translateX(3px);
      }
    }

    span {
      color: ${(props) => props.theme.colors.primary};
    }
  }

  span {
    font-size: 16px;
    font-weight: 600;
    user-select: none;
    transition: all 0.3s ease;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #E9ECEF;
    border-radius: 10px;
    padding: 5px;
    transition: all 0.3s ease;

    svg {
      font-size: 24px;
      color: black;
      transition: all 0.3s ease;
    }
  }
`

export const LastOrdersListWrapper = styled.div`
  margin-bottom: 60px;
  transition: all 0.3s ease;

  h2 {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 10px;
    margin-top: 0;
    transition: all 0.3s ease;
  }
`
