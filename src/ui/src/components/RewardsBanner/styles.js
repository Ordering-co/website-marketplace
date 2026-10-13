import styled, { css, keyframes } from 'styled-components'

const rewardsReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const rewardsShimmer = keyframes`
  0% {
    transform: translateX(-120%) skewX(-12deg);
  }
  100% {
    transform: translateX(220%) skewX(-12deg);
  }
`

const rewardIconFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(12deg);
  }
  50% {
    transform: translateY(-4px) rotate(8deg);
  }
`

export const RewardsBannerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 440px;
  margin: ${({ $compact }) => ($compact ? '20px 6px 0' : '20px auto 0')};
  padding: 14px 12px 12px;
  box-sizing: border-box;
  border-radius: ${props => props.theme?.utils?.radius?.m ?? 12}px;
  background: linear-gradient(
    135deg,
    ${props => props.theme?.colors?.primary || '#000000'}12 0%,
    ${props => props.theme?.colors?.yellow || '#FFC107'}22 55%,
    ${props => props.theme?.colors?.white || '#FFFFFF'} 100%
  );
  border: 1px solid ${props => props.theme?.colors?.primary || '#000000'}18;
  box-shadow: 0 8px 24px ${props => props.theme?.colors?.primary || '#000000'}14;
  overflow: hidden;
  animation: ${rewardsReveal} 0.45s cubic-bezier(0.25, 1, 0.5, 1) both;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme?.colors?.white || '#FFFFFF'}55,
      transparent
    );
    animation: ${rewardsShimmer} 2.8s cubic-bezier(0.25, 1, 0.5, 1) 0.6s infinite;
    pointer-events: none;
  }

  .rewards-kicker {
    position: relative;
    z-index: 1;
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    color: ${props => props.theme?.colors?.primary || '#000000'};
  }

  .rewards-footnote {
    position: relative;
    z-index: 1;
    margin: 10px 0 0;
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    opacity: 0.75;
    color: ${props => props.theme?.colors?.primary || '#000000'};
  }

  ${({ $compact }) => $compact && css`
    @media (max-width: 480px) {
      margin: 16px 8px 0;
      padding: 16px 14px 14px;
    }
  `}

  ${({ $compact, theme }) => !$compact && css`
    @media (max-width: 768px) {
      max-width: none;
      width: 100%;
      margin: 12px 0 16px;
      padding: 14px 12px 12px;
      box-shadow: 0 4px 16px ${theme?.colors?.primary || '#000000'}12;
    }
  `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;

    &::before {
      display: none;
    }
  }
`

export const RewardsBannerRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 8px;
  align-items: stretch;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: ${({ $compact }) => ($compact ? '12px' : '10px')};
  }
`

export const RewardsBannerCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  padding: ${({ $compact }) => ($compact ? '14px 12px' : '12px 8px')};
  text-align: center;
  background-color: ${props => props.theme?.colors?.white || '#FFFFFF'};
  border-radius: ${props => props.theme?.utils?.radius?.m ?? 8}px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s cubic-bezier(0.25, 1, 0.5, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px ${props => props.theme?.colors?.primary || '#000000'}18;
  }

  .icon {
    flex-shrink: 0;
    color: ${props => props.theme?.colors?.yellow || '#FFC107'};
    line-height: 1;
    animation: ${rewardIconFloat} 3.2s ease-in-out infinite;

    svg {
      width: 40px;
      height: 40px;
      display: block;
    }
  }

  span {
    display: block;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.35;
  }

  .red {
    color: ${props => props.theme?.colors?.primary};
  }

  ${({ $compact }) => $compact && css`
    @media (max-width: 480px) {
      padding: 16px 14px;
    }
  `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }

    .icon {
      animation: none;
    }
  }
`
