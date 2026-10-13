import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { HeaderOption } from '../index'

describe('HeaderOption', () => {
  it('renders cart count badge', () => {
    const onClick = vi.fn()
    const { getByText, container } = renderWithProviders(
      <HeaderOption variant='cart' totalCarts={2} onClick={onClick} />
    )
    expect(getByText('2')).toBeInTheDocument()
    fireEvent.click(container.firstChild)
    expect(onClick).toHaveBeenCalledWith('cart')
  })

  it('renders default address prompt when address state is empty', () => {
    const { getByText } = renderWithProviders(
      <HeaderOption variant='address' addressState='' onClick={vi.fn()} />
    )
    expect(getByText("What's your address?")).toBeInTheDocument()
  })
})
