import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { MomentPopover } from '../index'

vi.mock('react-popper', () => ({
  usePopper: () => ({
    styles: { popper: {}, arrow: {} },
    attributes: { popper: {}, arrow: {} }
  })
}))
vi.mock('~ui/src/components/MomentContent', () => ({
  MomentContent: () => <div data-testid='moment-content' />
}))

describe('MomentPopover', () => {
  it('renders ASAP label when no moment is set', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <MomentPopover open onClose={vi.fn()} onClick={vi.fn()} />
    )
    expect(getByText('ASAP')).toBeInTheDocument()
    expect(getByTestId('moment-content')).toBeInTheDocument()
  })
})
