import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { cartFixture } from '../../__tests__/helpers/cartTestMocks'
import { CartSidebar } from '../index'

vi.mock('~ui/src/components/CartContent', () => ({
  CartContent: ({ isOpenCart }) => <div data-testid='cart-content' data-open={String(isOpenCart)} />
}))

describe('CartSidebar', () => {
  it('marks persistent cart content inactive until the drawer opens', () => {
    const { getByTestId, getByText, getByLabelText } = renderWithProviders(<CartSidebar carts={[{ uuid: 'test-cart' }]} onClose={vi.fn()} />)
    expect(getByTestId('cart-content')).toHaveAttribute('data-open', 'false')
    fireEvent.click(getByText('1'))
    expect(getByTestId('cart-content')).toHaveAttribute('data-open', 'true')
    fireEvent.click(getByLabelText('close'))
    expect(getByTestId('cart-content')).toHaveAttribute('data-open', 'false')
  })
  it('opens sidebar and shows cart title', () => {
    const onClose = vi.fn()
    const { getByText, container } = renderWithProviders(
      <CartSidebar open carts={[cartFixture]} onClose={onClose} />
    )
    const icon = container.querySelector('[class*="IconContent"]') || container.firstChild?.firstChild
    if (icon) fireEvent.click(icon)
    expect(getByText('My cart')).toBeInTheDocument()
  })
})
