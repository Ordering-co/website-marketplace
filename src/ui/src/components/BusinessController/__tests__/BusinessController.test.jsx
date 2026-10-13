import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { BusinessController } from '../index'

const businessFixture = vi.hoisted(() => ({
  id: 1,
  name: 'Demo Store',
  slug: 'demo-store',
  logo: 'logo.png',
  enabled: true
}))

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/components/LoginForm', () => ({ LoginForm: () => null }))
vi.mock('~ui/src/components/SignUpForm', () => ({ SignUpForm: () => null }))
vi.mock('~ui/src/components/ForgotPasswordForm', () => ({ ForgotPasswordForm: () => null }))

vi.mock('~components/components/BusinessController', () => ({
  BusinessController: ({ UIComponent, ...rest }) => (
    <UIComponent
      business={businessFixture}
      isBusinessOpen
      handleClick={vi.fn()}
      getBusinessOffer={vi.fn(() => null)}
      businessState={{ business: businessFixture, loading: false }}
      orderType={1}
      isSkeleton={false}
      {...rest}
    />
  )
}))

describe('BusinessController', () => {
  it('renders business name', () => {
    const { getByText } = renderWithProviders(<BusinessController />)
    expect(getByText('Demo Store')).toBeInTheDocument()
  })

  it('handles click in simple view', () => {
    const handleClick = vi.fn()
    const { getByText } = renderWithProviders(
      <BusinessController simpleView handleClick={handleClick} />
    )
    fireEvent.click(getByText('Demo Store'))
    expect(handleClick).toHaveBeenCalled()
  })
})
