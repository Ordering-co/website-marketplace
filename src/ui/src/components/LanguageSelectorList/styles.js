import styled from 'styled-components'

export const LanguageSelectorListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  transition: all 0.3s ease;

  .language-item {
    font-family: ${props => props.theme?.fonts?.special?.name};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 12px;
    margin: 2px 0;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.05);

    &:hover {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      transform: translateY(-2px);
      box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.12);
    }

    &:active {
      transform: translateY(-1px);
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    }

    .language-info {
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.3s ease;

      .flag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        overflow: hidden;
        border-radius: 6px;
        transition: all 0.3s ease;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);

        &:hover {
          transform: scale(1.1);
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s ease;
        }
      }

      .language-name {
        font-size: 16px;
        color: ${props => props.theme.colors.textPrimary};
        font-weight: 500;
      }
    }

    &:hover .language-name {
      color: ${props => props.theme?.colors?.primary || props.theme.colors.textPrimary};
      font-weight: 600;
    }

    .language-code {
      font-size: 12px;
      color: ${props => props.theme.colors.textSecondary};
      background-color: ${props => props.theme.colors.primary};
      padding: 2px 8px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .radio-icon {
      font-size: 22px;
      color: #ccc;
      transition: all 0.3s ease;

      &.selected {
        color: ${props => props.theme.colors.primary};
        transform: scale(1.1);
      }
    }

    &:hover .radio-icon {
      transform: scale(1.05);
      color: ${props => props.theme?.colors?.primary || '#000'};
    }

    &:hover .radio-icon.selected {
      transform: scale(1.15);
    }
  }
`
