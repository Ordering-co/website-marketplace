import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { productFixture } from '../../__tests__/helpers/menuTestMocks'
import { ProductItemAccordion } from '../index'

const onEditProduct = vi.hoisted(() => vi.fn())

vi.mock('~components/components/ProductItemAccordion', () => ({
  ProductItemAccordion: ({ UIComponent, ...rest }) => (
    <UIComponent
      product={{ ...productFixture, quantity: 2, price: 9.5, valid_quantity: true, valid_menu: true }}
      productInfo={{ ingredients: [], options: [] }}
      changeQuantity={vi.fn()}
      onDeleteProduct={vi.fn()}
      onEditProduct={onEditProduct}
      isCheckout={false}
      isCartProduct
      getProductMax={vi.fn()}
      {...rest}
    />
  )
}))

describe('ProductItemAccordion', () => {
  it('renders product name', () => {
    const { getByText } = renderWithProviders(<ProductItemAccordion />)
    expect(getByText('Burger')).toBeInTheDocument()
  })

  it('calls onEditProduct when edit is triggered', () => {
    onEditProduct.mockClear()
    const { getAllByTestId } = renderWithProviders(<ProductItemAccordion />)
    fireEvent.click(getAllByTestId('icon-pencil')[0])
    expect(onEditProduct).toHaveBeenCalled()
  })
})
