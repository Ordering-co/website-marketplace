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

  it('hides the quantity and delete controls for a pending cart', () => {
    const editable = renderWithProviders(<ProductItemAccordion />)
    expect(editable.getByTestId('icon-dashSquareFill')).toBeInTheDocument()
    expect(editable.getByTestId('icon-plusSquareFill')).toBeInTheDocument()
    editable.unmount()

    const pending = renderWithProviders(<ProductItemAccordion isCartPending />)
    expect(pending.queryByTestId('icon-dashSquareFill')).not.toBeInTheDocument()
    expect(pending.queryByTestId('icon-plusSquareFill')).not.toBeInTheDocument()
    expect(pending.queryByTestId('icon-trashFilled')).not.toBeInTheDocument()
    expect(pending.getByText('Burger')).toBeInTheDocument()
  })

  it('does not increment when the cart already holds maximum_per_order', () => {
    const changeQuantity = vi.fn()
    const product = { ...productFixture, quantity: 1, balance: 1, maximum_per_order: 1, valid_quantity: true, valid_menu: true }
    const { container } = renderWithProviders(<ProductItemAccordion product={product} changeQuantity={changeQuantity} />)
    fireEvent.click(container.querySelector('[data-doc-control="cart-product-increment"]'))
    expect(changeQuantity).not.toHaveBeenCalled()
  })

  it('counts other cart lines of the same product against maximum_per_order', () => {
    const changeQuantity = vi.fn()
    const product = { ...productFixture, quantity: 1, balance: 2, maximum_per_order: 2, valid_quantity: true, valid_menu: true }
    const { container } = renderWithProviders(<ProductItemAccordion product={product} changeQuantity={changeQuantity} />)
    fireEvent.click(container.querySelector('[data-doc-control="cart-product-increment"]'))
    expect(changeQuantity).not.toHaveBeenCalled()
  })

  it('increments while below maximum_per_order', () => {
    const changeQuantity = vi.fn()
    const product = { ...productFixture, quantity: 1, balance: 1, maximum_per_order: 2, valid_quantity: true, valid_menu: true }
    const { container } = renderWithProviders(<ProductItemAccordion product={product} changeQuantity={changeQuantity} />)
    fireEvent.click(container.querySelector('[data-doc-control="cart-product-increment"]'))
    expect(changeQuantity).toHaveBeenCalledWith(product, 2)
  })

  it('disables select quantities above maximum_per_order', () => {
    const product = { ...productFixture, quantity: 1, balance: 1, maximum_per_order: 2, valid_quantity: true, valid_menu: true }
    const { container } = renderWithProviders(
      <ProductItemAccordion
        product={product}
        hideQuantitySelector={false}
        getProductMax={() => 4}
        offsetDisabled={() => 4}
      />
    )
    const disabledByValue = Object.fromEntries(
      [...container.querySelectorAll('option')].map(option => [option.value, option.disabled])
    )
    expect(disabledByValue).toEqual({ 0: false, 1: false, 2: false, 3: true, 4: true })
  })

  it('calls onEditProduct when edit is triggered', () => {
    onEditProduct.mockClear()
    const { getAllByTestId } = renderWithProviders(<ProductItemAccordion />)
    fireEvent.click(getAllByTestId('icon-pencil')[0])
    expect(onEditProduct).toHaveBeenCalled()
  })
})
