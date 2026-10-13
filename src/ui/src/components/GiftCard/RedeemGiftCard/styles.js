import styled from 'styled-components'

export const Container = styled.div`
  transition: all 0.3s ease;

  h2 {
    font-size: 24px;
    font-weight: 600;
    text-align: left;
    margin-top: 0;
    margin-bottom: 48px;
    transition: all 0.3s ease;
  }

  p {
    font-size: 14px;
    line-height: 18px;
    margin: 6px 0;
    color: ${props => props.theme.colors.darkGray};
    transition: all 0.3s ease;
  }

  button {
    height: 60px;
    border-radius: 30px;
    font-size: 18px;
    font-weight: 600;
    margin-top: 30px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
  }
`
export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
`
export const FormController = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 28px;
  transition: all 0.3s ease;

  label {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  input {
    border-width: 0px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.10);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:focus {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
  }
`
export const GiftCardInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`
