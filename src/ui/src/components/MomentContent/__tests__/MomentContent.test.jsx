import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture } from '../../__tests__/helpers/cartTestMocks'
import { MomentContent } from '../index'

vi.mock('~ui/src/components/MomentControl', () => ({
  MomentControl: () => <div data-testid='moment-control' />
}))

describe('MomentContent', () => {
  it('renders moment control when config is loaded', () => {
    const { getByTestId } = renderWithProviders(
      <MomentContent business={businessFixture} onClose={vi.fn()} />
    )
    expect(getByTestId('moment-control')).toBeInTheDocument()
  })
})
