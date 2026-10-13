import styled, { css } from 'styled-components'

export const GiftCardContainer = styled.div`
  width: 100%;
  max-width: 820px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0 20px 40px;
  box-sizing: border-box;
  min-height: calc(100vh - 280px);
  transition: all 0.3s ease;

  ${props => props.noPadding && css`
    padding: 0;
  `}
`

export const Title = styled.h1`
  font-weight: 600;
  font-size: 28px;
  margin: 8px 0 24px;
  text-align: center;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`

/* Centered hero block: a clean CSS gift-card visual + the intro copy. */
export const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
`

export const HeroCard = styled.div`
  width: 300px;
  max-width: 80%;
  aspect-ratio: 1.6 / 1;
  border-radius: 18px;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: 22px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  /* soft decorative sheen — not a cartoon */
  &::after {
    content: '';
    position: absolute;
    top: -40%;
    right: -20%;
    width: 70%;
    height: 160%;
    background: rgba(255, 255, 255, 0.08);
    transform: rotate(20deg);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .brand {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    svg {
      font-size: 26px;
    }
  }

  .card-label {
    font-size: 22px;
    font-weight: 600;
    z-index: 1;
  }
`

export const HeroCopy = styled.div`
  max-width: 560px;
  margin: 0 auto;

  h2 {
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 12px;
  }

  p {
    font-size: 15px;
    line-height: 1.6;
    color: ${props => props.theme.colors.darkGray};
    margin: 0;
  }
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${props => props.theme.colors.gray200};
  margin: 36px 0;
  transition: all 0.3s ease;
`

export const Container = styled.div`
  margin-top: 48px;
  transition: all 0.3s ease;
`

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  transition: all 0.3s ease;

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }

  svg {
    font-size: 20px;
  }
`

export const ActionWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px 20px;
  background-color: ${props => props.theme.colors.gray300};
  border: 1px solid ${props => props.theme.colors.gray200};
  justify-content: space-between;
  border-radius: 12px;
  transition: all 0.25s ease;

  .gift-card-text {
    display: flex;
    flex-direction: column;
    gap: 2px;

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: ${props => props.theme.colors.darkGray};
    }
  }

  /* Brand-pill button: neutral by default, primary on hover */
  > button {
    height: 40px;
    min-width: 120px;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.25s ease;

    &.light {
      background: ${props => props.theme.colors.backgroundPage};
      color: ${props => props.theme.colors.black};
      border: 1px solid ${props => props.theme.colors.gray200};
      border-radius: 8px;

      &:hover {
        color: ${props => props.theme.colors.primary};
        border-color: ${props => props.theme.colors.primary};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
      }
    }

    @media (max-width: 853px) {
      font-size: 12px;
      min-width: 96px;
    }
  }

  @media (min-width: 768px) {
    padding: 24px 40px;
  }
`
