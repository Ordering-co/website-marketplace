import styled from 'styled-components'

export const Container = styled.form`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 25px 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 32px;
    transition: all 0.3s ease;
  }

  > button {
    height: 44px;
    margin-top: 30px;
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
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

  input, textarea {
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;

    &:focus {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    &:hover {
      transform: scale(1.02);
    }
  }
`
