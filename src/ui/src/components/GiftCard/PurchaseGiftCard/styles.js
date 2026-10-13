import styled, { css } from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  h2 {
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    margin-top: 0;
    margin-bottom: 24px;
    transition: all 0.3s ease;
    color: ${(props) => props.theme.colors.darkTextColor};
  }

  > p {
    font-size: 16px;
    line-height: 24px;
    margin-top: 0;
    transition: all 0.3s ease;
    color: ${(props) => props.theme.colors.darkGray};
  }
`

export const GiftCardsListContainer = styled.div`
  padding: 0px;
  transition: all 0.3s ease;

  > p {
    font-size: 20px;
    font-weight: 600;
    margin-top: 0px;
    transition: all 0.3s ease;
  }
`

export const GiftCardsWrapper = styled.div`
  margin-bottom: 10px;
  transition: all 0.3s ease;

  ${({ isPage }) => isPage && css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    @media (min-width: 600px) {
      grid-template-columns: 1fr 1fr;
    }
  `}
`

export const GiftCardItem = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid ${props => props.theme.colors.gray200};
  border-radius: 14px;
  background: ${props => props.theme.colors.backgroundPage};
  transition: all 0.25s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.10);
  }

  /* Modal list (non-page): simpler row with a divider instead of a card */
  ${({ isPage }) => !isPage && css`
    border: none;
    border-radius: 0;
    border-bottom: 1px solid ${props => props.theme.colors.gray200};
    margin-bottom: 8px;

    &:hover {
      transform: none;
      box-shadow: none;
      border-color: transparent;
      border-bottom-color: ${props => props.theme.colors.gray200};
      background-color: ${props => props.theme.colors.gray100};
    }
  `}

  .left-content {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  button {
    font-size: 14px;
    font-weight: 600;
    min-width: fit-content;
    border-radius: 8px;
    transition: all 0.25s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .name {
    font-size: 15px;
    font-weight: 500;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const IconControl = styled.div`
  display: flex;
  color: ${props => props.theme.colors.primary};
  transition: all 0.3s ease;

  svg {
    font-size: 24px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  svg[disabled] {
    color: ${props => props.theme.colors.lightGray};
  }
`

export const ActionButtonContainer = styled.div`
  position: sticky;
  bottom: 0px;
  background-color: ${props => props.theme.colors.backgroundPage};
  padding: 20px 20px;
  transition: all 0.3s ease;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);

  > button {
    height: 44px;
    width: 100%;
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`

/* Clean denomination "mini gift card" badge — replaces the old dummy image. */
export const CardChip = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 96px;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

  .chip-icon {
    font-size: 16px;
    opacity: 0.9;
  }

  .chip-value {
    font-size: 16px;
    font-weight: 700;
    white-space: nowrap;
  }
`
