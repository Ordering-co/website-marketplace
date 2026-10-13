import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { productFixture } from '../../__tests__/helpers/menuTestMocks'
import { SingleProductCard } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => [{ current: null }, true]
}))
vi.mock('~ui/src/components/LoginForm', () => ({ LoginForm: () => null }))
vi.mock('~ui/src/components/SignUpForm', () => ({ SignUpForm: () => null }))
vi.mock('~ui/src/components/ForgotPasswordForm', () => ({ ForgotPasswordForm: () => null }))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null)
}))

const onProductClick = vi.hoisted(() => vi.fn())

vi.mock('~components/components/SingleProductCard', () => ({
  SingleProductCard: ({ UIComponent, ...rest }) => (
    <UIComponent
      product={productFixture}
      onProductClick={onProductClick}
      isSoldOut={false}
      isSkeleton={false}
      productAddedToCartLength={0}
      handleFavoriteProduct={vi.fn()}
      {...rest}
    />
  )
}))

describe('SingleProductCard', () => {
  it('renders product name', () => {
    const { getByText } = renderWithProviders(<SingleProductCard />)
    expect(getByText('Burger')).toBeInTheDocument()
  })

  it('calls onProductClick when card is clicked', () => {
    onProductClick.mockClear()
    const { getByText } = renderWithProviders(<SingleProductCard />)
    fireEvent.click(getByText('Burger'))
    expect(onProductClick).toHaveBeenCalled()
  })
})
