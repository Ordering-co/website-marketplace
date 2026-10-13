import styled, { css } from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${(props) => props.isBottomBorder && css`
    border-bottom: 1px solid #E9ECEF;
  `}
  padding: 10px 0;
  font-family: ${props => props.theme?.fonts?.special?.name || 'Georgia'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:has(.checkbox-wallet:disabled) {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover {
      transform: none;
    }

    label {
      cursor: not-allowed;

      &:hover {
        transform: none;
      }
    }
  }

  .checkbox-wallet {
    transition: all 0.2s ease;

    &:before {
      width: 18px;
      height: 18px;
      border: 2px solid ${props => props.theme.colors.black};
      border-radius: 2px;
      background-color: #FFF;
      transition: all 0.2s ease;
    }

    &:hover:before {
      transform: scale(1.05);
    }

    &:checked:before {
      width: 19px;
      height: 19px;
      top: 0;
      background-color: ${props => props.theme.colors.primary};
      border: 1px solid ${props => props.theme.colors.primary};
    }

    &:checked:hover:before {
      transform: scale(1.05);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &:disabled:before {
      border-color: #CCC;
      background-color: #F2F2F2;
      filter: grayscale(1);
    }

    &:disabled:hover:before,
    &:disabled:checked:hover:before {
      transform: none;
    }

    &:checked:after {
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
      position: absolute;
      top: 3px;
      transition: all 0.2s ease;
    }
  }
`

export const SectionLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const SectionLeftText = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;


  &:hover {
    transform: scale(1.05);
  }

  .bold {
    font-weight: 600;
  }
  @media (max-width: 360px) {
  .wallet-name {
      width: 30%;
    }
  }
`

export const SectionWrapper = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
`
