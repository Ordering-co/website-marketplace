import styled from 'styled-components'

export const WrapperMap = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .business-name-map {
    color: ${props => props.colorTitle ?? props.theme?.colors?.primary};
  }

  .business-tel-map {
    a {
      color: ${props => props.colorTitle ?? props.theme?.colors?.primary};
      text-decoration: none;
    }
  }

  /* Clean, UberEats-style info card: rounded, soft shadow, no default chrome */
  .gm-style .gm-style-iw-c {
    padding: 0 !important;
    border-radius: 14px !important;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18) !important;
  }

  .gm-style-iw-d {
    overflow: auto !important;
  }
  .gm-style-iw-chr {
    height: 18px !important;
  }

  .bold {
    font-weight: 400;
    color: ${props => props.theme?.colors?.darkGray};
  }

  .custom-marker-icon {
    border-radius: 50%;
  }
`

export const ContainerCard = styled.div`
  padding: 14px 16px 16px;
  font-family: inherit;
`

export const WrapperBusinessCard = styled.div`
  max-width: 280px;
`

export const BusinessHero = styled.div`
`

export const BusinessContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const BusinessInfo = styled.div`
  font-size: 13px;
  line-height: 1.4;
  color: ${props => props.theme?.colors?.black};

  .bold {
    font-weight: 400;
    color: ${props => props.theme?.colors?.darkGray};
  }
`

export const BusinessInfoItem = styled.div`
  font-size: 13px;
`

export const BusinessName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
  margin: 0 0 8px !important;
  width: 100%;
`

export const BusinessAddress = styled.p`
  margin: 0;
  font-size: 13px;
`
