import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CartPopover } from '../index'

vi.mock('react-popper', () => ({
  usePopper: () => ({
    styles: { popper: {}, arrow: {} },
    attributes: { popper: {}, arrow: {} }
  })
}))
vi.mock('~ui/src/components/CartContent', () => ({
  CartContent: () => <div data-testid='cart-content' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null)
}))

describe('CartPopover', () => {
  it('renders cart trigger and popover body', () => {
    const { getByTestId } = renderWithProviders(
      <CartPopover open auth location={{ pathname: '/' }} onClose={vi.fn()} />
    )
    expect(getByTestId('cart-content')).toBeInTheDocument()
  })
})
