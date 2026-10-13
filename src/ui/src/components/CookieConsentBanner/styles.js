import styled, { css } from 'styled-components'

export const BannerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  /* below the modal backdrop (20002) so the banner never covers an
     open modal's action row; still above page bars (~1000-1006). */
  z-index: 20000;
  background-color: ${props => props.theme?.colors?.primary || '#2C7BE5'};
  color: ${props => props.theme?.colors?.primaryContrast || '#FFF'};
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
  max-width: 360px;

  @media (max-width: 576px) {
    bottom: 90px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`

export const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
`

export const BannerText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
`

export const BannerLink = styled.a`
  color: ${props => props.theme?.colors?.primaryContrast || '#FFF'};
  text-decoration: underline;
`

export const BannerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const BannerButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s ease;

  ${({ $primary, theme }) => $primary
    ? css`
      background-color: ${theme?.colors?.primaryContrast || '#FFF'};
      color: ${theme?.colors?.primary || '#2C7BE5'};
      border: 1px solid ${theme?.colors?.primaryContrast || '#FFF'};
    `
    : css`
      background-color: transparent;
      color: ${theme?.colors?.primaryContrast || '#FFF'};
      border: none;
      text-decoration: underline;
      padding: 10px 16px;
    `
  }

  &:hover {
    opacity: 0.85;
  }
`
