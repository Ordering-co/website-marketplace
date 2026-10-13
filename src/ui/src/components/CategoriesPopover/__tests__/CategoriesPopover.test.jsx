import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CategoriesPopover } from '../index'

vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children, title }) => (open ? <div data-testid='modal' data-title={title}>{children}</div> : null)
}))

describe('CategoriesPopover', () => {
  it('renders popover content when open', () => {
    const { getByText } = renderWithProviders(
      <CategoriesPopover
        open
        onClose={vi.fn()}
        CategoriesPopoverUI={() => <div>Category filters</div>}
      />
    )
    expect(getByText('Category filters')).toBeInTheDocument()
  })
})
