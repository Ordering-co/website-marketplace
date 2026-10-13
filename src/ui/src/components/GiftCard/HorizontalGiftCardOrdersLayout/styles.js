import styled from 'styled-components'

export const ProductsListContainer = styled.div`
  margin-top: 10px;
  display: flex;
  overflow: scroll hidden;
  transition: all 0.3s ease;
  border-radius: 12px;
  padding: 8px 0;
`

export const ProductsList = styled.div`
  display: flex;
  box-sizing: border-box;
  transition: all 0.3s ease;

  .product-card {
    width: 270px;
    max-width: 270px;
    margin: 10px;
    border: 1px solid #E9ECEF;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border-color: ${(props) => props.theme.colors.primary};
    }
  }

  @media(min-width: 480px){
    .product-card {
      width: 400px;
      max-width: 400px;
    }
  }
`

export const PaginationWrapper = styled.div`
  margin: 20px 0;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
`
