import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { ProductShare } from '../index'

const updateShowValue = vi.hoisted(() => vi.fn())

vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))
vi.mock('../ProductCopyURL', () => ({
  ProductCopyURL: () => <div data-testid='copy-url' />
}))

vi.mock('~components/components/ProductShare', () => ({
  ProductShare: ({ UIComponent, ...rest }) => (
    <UIComponent
      urlToShare='https://example.com/product/1'
      showShareButton={false}
      updateShowValue={updateShowValue}
      withBtn={false}
      product={{ id: 1, name: 'Burger' }}
      {...rest}
    />
  )
}))

describe('ProductShare', () => {
  it('opens share controls when icon is clicked', () => {
    updateShowValue.mockClear()
    const { getByTestId } = renderWithProviders(<ProductShare />)
    fireEvent.click(getByTestId('icon-share'))
    expect(updateShowValue).toHaveBeenCalledWith(true)
  })
})
