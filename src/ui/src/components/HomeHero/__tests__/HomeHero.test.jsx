import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders, defaultTheme } from '../../../../../__tests__/helpers/testUtils'
import { HomeHero } from '../index'

const sessionState = vi.hoisted(() => ({
  auth: false,
  loading: false,
  login: vi.fn()
}))

vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ auth: sessionState.auth, loading: sessionState.loading, user: {} }, { login: sessionState.login }]
}))

const orderState = vi.hoisted(() => ({
  current: { options: { address: {} }, loading: false, carts: {} }
}))

const orderActions = vi.hoisted(() => ({
  changeType: vi.fn(() => Promise.resolve())
}))

vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [orderState.current, { refreshOrderOptions: vi.fn(), changeType: orderActions.changeType }]
}))

const configState = vi.hoisted(() => ({
  current: {}
}))

vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{ configs: configState.current }]
}))

vi.mock('~ui/hooks/useWindowSize', () => ({
  useWindowSize: () => ({ width: 400, height: 800 })
}))

vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children, title, authModal }) => (
    open ? <div data-testid={authModal ? 'auth-modal' : 'modal'} data-title={title}>{children}</div> : null
  )
}))
vi.mock('~ui/src/components/AddressForm', () => ({
  AddressForm: () => <div data-testid='address-form' />
}))
vi.mock('~ui/src/components/AddressList', () => ({
  AddressList: () => <div data-testid='address-list' />
}))
vi.mock('~ui/src/components/LoginForm', () => ({
  LoginForm: ({ elementLinkToSignup, elementLinkToForgotPassword }) => (
    <div data-testid='login-form'>
      {elementLinkToSignup}
      {elementLinkToForgotPassword}
    </div>
  )
}))
vi.mock('~ui/src/components/SignUpForm', () => ({
  SignUpForm: () => <div data-testid='signup-form' />
}))
vi.mock('~ui/src/components/ForgotPasswordForm', () => ({
  ForgotPasswordForm: () => <div data-testid='forgot-form' />
}))

const heroTheme = {
  ...defaultTheme,
  images: { general: { homeHero: 'hero.jpg', homeHeroMobile: 'hero-m.jpg' }, logos: { logotypeInvert: 'logo.png' } },
  mobile_view_web: { components: { home: { components: { login_account: { hidden: false } } } } }
}

describe('HomeHero', () => {
  beforeEach(() => {
    sessionState.auth = false
    sessionState.loading = false
    orderState.current = { options: { address: {} }, loading: false, carts: {} }
    orderActions.changeType.mockClear()
    configState.current = {}
  })

  it('goes straight to pickup businesses when pickup works without an address', async () => {
    configState.current = {
      order_types_allowed: { value: '1|2' },
      unaddressed_order_types_allowed: { value: '3|2' }
    }
    orderState.current = { options: { type: 1, address: {} }, loading: false, carts: {} }
    const onFindBusiness = vi.fn()
    const { getByText, queryByTestId } = renderWithProviders(
      <HomeHero onFindBusiness={onFindBusiness} />,
      { theme: heroTheme }
    )
    fireEvent.click(getByText('Search'))
    await waitFor(() => expect(onFindBusiness).toHaveBeenCalled())
    expect(orderActions.changeType).toHaveBeenCalledWith(2)
    expect(queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('keeps the order type when it already works without an address', async () => {
    configState.current = {
      order_types_allowed: { value: '1|2|3' },
      unaddressed_order_types_allowed: { value: '3|2' }
    }
    orderState.current = { options: { type: 3, address: {} }, loading: false, carts: {} }
    const onFindBusiness = vi.fn()
    const { getByText } = renderWithProviders(
      <HomeHero onFindBusiness={onFindBusiness} />,
      { theme: heroTheme }
    )
    fireEvent.click(getByText('Search'))
    await waitFor(() => expect(onFindBusiness).toHaveBeenCalled())
    expect(orderActions.changeType).not.toHaveBeenCalled()
  })

  it('asks for the address when pickup still requires one', () => {
    configState.current = {
      order_types_allowed: { value: '1|2' },
      unaddressed_order_types_allowed: { value: '3' }
    }
    const onFindBusiness = vi.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <HomeHero onFindBusiness={onFindBusiness} />,
      { theme: heroTheme }
    )
    fireEvent.click(getByText('Search'))
    expect(getByTestId('address-form')).toBeInTheDocument()
    expect(orderActions.changeType).not.toHaveBeenCalled()
    expect(onFindBusiness).not.toHaveBeenCalled()
  })

  it('keeps the address input opening the address form when pickup works without an address', () => {
    configState.current = {
      order_types_allowed: { value: '1|2' },
      unaddressed_order_types_allowed: { value: '2' }
    }
    const onFindBusiness = vi.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <HomeHero onFindBusiness={onFindBusiness} />,
      { theme: heroTheme }
    )
    fireEvent.click(getByText('Enter where you want your order delivered.'))
    expect(getByTestId('address-form')).toBeInTheDocument()
    expect(onFindBusiness).not.toHaveBeenCalled()
  })

  it('uses the saved address instead of switching to pickup', () => {
    configState.current = {
      order_types_allowed: { value: '1|2' },
      unaddressed_order_types_allowed: { value: '2' }
    }
    orderState.current = {
      options: { type: 1, address: { address: '1 Main', location: { lat: 1, lng: 2 } } },
      loading: false,
      carts: {}
    }
    const onFindBusiness = vi.fn()
    const { getByText } = renderWithProviders(
      <HomeHero onFindBusiness={onFindBusiness} />,
      { theme: heroTheme }
    )
    fireEvent.click(getByText('Search'))
    expect(onFindBusiness).toHaveBeenCalled()
    expect(orderActions.changeType).not.toHaveBeenCalled()
  })

  it('renders search CTA and opens address modal without location', () => {
    const onFindBusiness = vi.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <HomeHero onFindBusiness={onFindBusiness} />,
      { theme: heroTheme }
    )
    expect(getByText('Search')).toBeInTheDocument()
    fireEvent.click(getByText('Search'))
    expect(getByTestId('modal')).toBeInTheDocument()
    expect(getByTestId('address-form')).toBeInTheDocument()
    expect(onFindBusiness).not.toHaveBeenCalled()
  })

  it('calls onFindBusiness when address location exists', () => {
    orderState.current = {
      options: { address: { address: '1 Main', location: { lat: 1, lng: 2 } } },
      loading: false,
      carts: {}
    }
    const onFindBusiness = vi.fn()
    const { getByText, queryByTestId } = renderWithProviders(
      <HomeHero onFindBusiness={onFindBusiness} />,
      { theme: heroTheme }
    )
    fireEvent.click(getByText('Search'))
    expect(onFindBusiness).toHaveBeenCalled()
    expect(queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('shows mobile login account actions', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <HomeHero onFindBusiness={vi.fn()} />,
      { theme: heroTheme }
    )
    expect(getByText('Use your account')).toBeInTheDocument()
    fireEvent.click(getByText('login'))
    expect(getByTestId('auth-modal')).toBeInTheDocument()
    expect(getByTestId('login-form')).toBeInTheDocument()
  })

  it('switches auth modal to signup from login link', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <HomeHero onFindBusiness={vi.fn()} />,
      { theme: heroTheme }
    )
    fireEvent.click(getByText('login'))
    fireEvent.click(getByText('Create account'))
    expect(getByTestId('signup-form')).toBeInTheDocument()
  })

  it('renders signup button path', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <HomeHero onFindBusiness={vi.fn()} />,
      { theme: heroTheme }
    )
    fireEvent.click(getByText('signUp'))
    expect(getByTestId('signup-form')).toBeInTheDocument()
  })
})
