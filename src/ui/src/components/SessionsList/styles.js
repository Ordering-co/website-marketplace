import styled from 'styled-components'

export const SessionsListContainer = styled.div`
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
export const Title = styled.h1`
  font-size: 36px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 10px;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    padding: 0 15px;
  }
`
export const SessionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10px;
  margin-bottom: 20px;
  border: 1px solid #E9ECEF;
  border-radius: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  .current-session {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    transition: all 0.3s ease;

    p.current {
      color: ${props => props.theme.colors.primary};
      font-weight: 700;
      font-size: 14px;
      margin: 0 15px;
      transition: all 0.3s ease;
    }
  }

  @media (min-width: 768px) {
    padding: 25px;
  }
`
export const DurationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  p {
    margin: 0;
    font-size: 14px;
    color: #909BA9;
    transition: all 0.3s ease;
  }

  p.bold {
    margin-top: 5px;
    color: ${props => props.theme.colors.black};
    transition: all 0.3s ease;
  }

  > span {
    display: none;
    margin: 0 10px;
    transition: all 0.3s ease;
  }
`
export const SeessionDelete = styled.span`
  display: flex;
  cursor: pointer;
  border-radius: 10px;
  padding: 3px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;

  svg {
    font-size: 28px;
    color: ${props => props.theme.colors.black};
    transition: all 0.3s ease;
  }

  &:hover {
    background-color: ${props => props.theme.colors.grayDividerColor};
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);

    svg {
      color: ${props => props.theme.colors.darkGray};
    }
  }
`
export const NoMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  padding: 40px 20px;

  svg {
    transition: all 0.3s ease;
    margin-bottom: 15px;
  }
`
export const SessionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
`
export const NoSessionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;

  > button {
    height: 44px;
    margin-top: 50px;
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`
export const ButtonsGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  transition: all 0.3s ease;

  > button {
    height: 60px;
    border-radius: 30px;
    margin: 10px 0;
    max-width: 415px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
  }

  @media (min-width: 768px) {
    button {
      min-width: 400px;
    }
  }
`
