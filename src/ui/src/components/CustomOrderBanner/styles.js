import styled from 'styled-components'

export const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  overflow: hidden;
  border-radius: 12px;
  margin: 20px auto;
  max-width: calc(100% - 40px);

  @media (min-width: 768px) {
    flex-direction: row;
    max-height: ${props => props.maxHeight || '330px'};
  }
`

export const BannerImage = styled.div`
  width: 100%;
  height: 160px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 70%;
    display: block;
  }

  @media (min-width: 768px) {
    width: 50%;
    height: auto;
  }
`

export const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px 20px;

  @media (min-width: 768px) {
    width: 50%;
    padding: 16px 32px;
  }
`

export const BannerTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.theme.colors?.headingColor || '#1a1a2e'};

  @media (min-width: 768px) {
    font-size: 26px;
  }
`

export const BannerSubtitle = styled.p`
  margin: 0 0 24px;
  font-size: 15px;
  color: #888;
`

export const BannerButton = styled.button`
  padding: 12px 32px;
  background: #1a1a2e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`
