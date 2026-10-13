import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PostLoginHomeGate } from '../index'

vi.mock('../../SpinnerLoader', () => ({
  SpinnerLoader: () => <div data-testid='spinner-loader'>loading</div>
}))

describe('PostLoginHomeGate', () => {
  it('renders children when user has an address', () => {
    const { getByText, queryByTestId } = renderWithProviders(
      <PostLoginHomeGate auth loading={false} hasAddress>
        <span>home-content</span>
      </PostLoginHomeGate>
    )
    expect(getByText('home-content')).toBeInTheDocument()
    expect(queryByTestId('spinner-loader')).not.toBeInTheDocument()
  })

  it('shows spinner while post-login order options settle', () => {
    const { getByTestId, queryByText } = renderWithProviders(
      <PostLoginHomeGate auth loading hasAddress={false}>
        <span>home-content</span>
      </PostLoginHomeGate>
    )
    expect(getByTestId('spinner-loader')).toBeInTheDocument()
    expect(queryByText('home-content')).not.toBeInTheDocument()
  })
})
