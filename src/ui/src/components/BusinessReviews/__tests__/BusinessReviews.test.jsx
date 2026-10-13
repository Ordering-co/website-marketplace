import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { BusinessReviews } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))

vi.mock('~components/components/BusinessReviews', () => ({
  BusinessReviews: ({ UIComponent, ...rest }) => (
    <UIComponent
      reviewsList={{ loading: false, reviews: [{ id: 1, name: 'Jane', quality: 5, created_at: '2026-01-01', comment: 'Great' }] }}
      totalReviews={1}
      stars={5}
      onChangeReview={vi.fn()}
      handleClickOption={vi.fn()}
      {...rest}
    />
  )
}))

describe('BusinessReviews', () => {
  it('renders review author name', () => {
    const { getByText } = renderWithProviders(<BusinessReviews />)
    expect(getByText('Jane')).toBeInTheDocument()
  })
})
