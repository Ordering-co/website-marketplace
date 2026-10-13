import styled from 'styled-components'
import { darken } from 'polished'

export const ProductsListContainer = styled.div`
  margin-top: 10px;
  transition: all 0.3s ease;

`

export const SingleGiftCardWrapper = styled.div`
  padding: 20px 0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`

export const WrappButton = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  margin: 20px auto;
  transition: all 0.3s ease;

  button {
    padding: 10px 0px;
    width: 100%;
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      color: ${props => darken(0.07, props.theme.colors.primary)};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  @media (min-width: 768px) {
    button {
      width: 60%;
    }
  }
`
