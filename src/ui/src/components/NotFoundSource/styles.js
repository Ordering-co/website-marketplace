import styled, { css } from 'styled-components'

export const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  margin: 20px auto;
  text-align: center;

  h1 {
    font-size: 20px;
    opacity: 0.5;
    line-height: 24px;
    text-align: center;
    color: ${props => props.theme.colors?.headingColor};
  }

  ${({ $variant }) => $variant === 'empty' && css`
    max-width: 480px;
    padding: 32px 16px;

    h1 {
      opacity: 1;
      font-size: 18px;
      font-weight: 600;
      line-height: 26px;
      margin: 0;
    }
  `}

  @media (min-width: 768px) {
    h1 {
      font-size: 24px;
      line-height: 32px;
    }

    ${({ $variant }) => $variant === 'empty' && css`
      max-width: 560px;
      min-height: 360px;
      padding: 56px 32px;
    `}
  }
`

export const NotFoundImage = styled.div`
  svg {
    width: 150px;
    height: 120px;
    opacity: 0.5;
  }
`

export const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin-bottom: 16px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors?.gray100 || '#f8f9fa'};

  svg {
    width: 32px;
    height: 32px;
    color: ${props => props.theme.colors?.gray200 || '#adb5bd'};
  }

  @media (min-width: 768px) {
    width: 96px;
    height: 96px;
    margin-bottom: 24px;

    svg {
      width: 44px;
      height: 44px;
    }
  }
`

export const EmptySubtitle = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: ${props => props.theme.colors?.gray200 || '#6c757d'};

  @media (min-width: 768px) {
    font-size: 16px;
    line-height: 24px;
  }
`

export const ButtonWrapper = styled.div`
  margin-top: 20px;

  button {
    height: 44px;
  }
`
