import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { createLanguageWrapper } from '../../../../../__tests__/helpers/languageTestUtils'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { customerFixture } from '../../__tests__/helpers/shellTestMocks'
import { SidebarMenu } from '../index'

const windowSize = vi.hoisted(() => ({ width: 1024, height: 768 }))

vi.mock('~ui/hooks/useWindowSize', () => ({
  useWindowSize: () => windowSize
}))
vi.mock('../../../../config', () => ({
  default: { franchiseSlug: null, businessSlug: null }
}))
vi.mock('../../../hooks/useEnabledLanguages', () => ({
  useEnabledLanguages: () => ({ hasMultiple: true })
}))
vi.mock('../../SavedCards/useSavedCardsGateway', () => ({
  useSavedCardsGateway: () => ({ isAvailable: true })
}))
vi.mock('~ui/src/components/LogoutButton', () => ({
  LogoutButton: ({ onCustomClick }) => (
    <button type='button' data-testid='logout-button' onClick={onCustomClick}>Logout</button>
  )
}))
vi.mock('~ui/src/components/LoginForm', () => ({
  LoginForm: () => <div data-testid='login-form'>LoginForm</div>
}))
vi.mock('~ui/src/components/SignUpForm', () => ({
  SignUpForm: () => <div data-testid='signup-form'>SignUpForm</div>
}))
vi.mock('~ui/src/components/ForgotPasswordForm', () => ({
  ForgotPasswordForm: () => <div data-testid='forgot-form'>ForgotPasswordForm</div>
}))

const emit = vi.hoisted(() => vi.fn())
const schoolModuleValue = vi.hoisted(() => ({ value: '1' }))

vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit, on: vi.fn(), off: vi.fn() }]
}))

const sessionState = vi.hoisted(() => ({
  auth: false,
  user: { id: 1, name: 'Jane', lastname: 'Doe', loyalty_level: { name: 'Gold' } },
  token: 'test-token'
}))

vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [sessionState, { login: vi.fn() }]
}))

vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{
    configs: {
      cash_wallet: { value: '1' },
      wallet_cash_enabled: { value: '1' },
      wallet_credit_point_enabled: { value: '1' },
      platform_store_giftcard_enabled: { value: '1' },
      advanced_offers_module: { value: '1' },
      plan_enterprise: { value: '1' },
      school_module_enabled: { value: schoolModuleValue.value }
    }
  }]
}))

describe('SidebarMenu', () => {

  it.each([
    ['es', 'Inicio', 'Casa'],
    ['bg', 'Начало', 'Дом']
  ])('keeps the legacy Home navigation translation in %s', async (code, nav, address) => {
    const { getByLabelText, findByText, queryByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />,
      { wrapper: createLanguageWrapper({ WEBSITE_HOME: nav, WEBSITE_ADDRESS_HOME: address }, code) }
    )
    fireEvent.click(getByLabelText('menu'))
    expect(await findByText(nav)).toBeInTheDocument()
    expect(queryByText(address)).not.toBeInTheDocument()
  })

  beforeEach(() => {
    emit.mockClear()
    schoolModuleValue.value = '1'
    windowSize.width = 1024
    sessionState.auth = false
    sessionState.user = { id: 1, name: 'Jane', lastname: 'Doe', loyalty_level: { name: 'Gold' } }
    const sidebar = document.createElement('div')
    sidebar.id = 'sidebar_menu'
    document.body.appendChild(sidebar)
    delete window.location
    window.location = new URL('http://localhost/home')
  })

  afterEach(() => {
    document.getElementById('sidebar_menu')?.remove()
  })

  it('renders menu toggle for guests', () => {
    const { getByLabelText } = renderWithProviders(
      <SidebarMenu auth={false} isHideSignup={false} />
    )
    expect(getByLabelText('menu')).toBeInTheDocument()
  })

  it('opens sidebar content when menu is clicked', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth={false} isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    expect(getByText('Sign in')).toBeInTheDocument()
    expect(getByText('Sign up')).toBeInTheDocument()
  })

  it('opens login modal from Sign in', () => {
    const { getByLabelText, getByText, getByTestId } = renderWithProviders(
      <SidebarMenu auth={false} isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('Sign in'))
    expect(getByTestId('login-form')).toBeInTheDocument()
  })

  it('opens signup modal from Sign up', () => {
    const { getByLabelText, getByText, getByTestId } = renderWithProviders(
      <SidebarMenu auth={false} isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('Sign up'))
    expect(getByTestId('signup-form')).toBeInTheDocument()
  })

  it('renders authenticated navigation links', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    expect(getByText('Orders')).toBeInTheDocument()
    expect(getByText('View account')).toBeInTheDocument()
    expect(getByText('Cash wallet')).toBeInTheDocument()
    expect(getByText('My addresses')).toBeInTheDocument()
  })

  it('navigates to orders when orders link is clicked', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('Orders'))
    expect(emit).toHaveBeenCalledWith('go_to_page', expect.objectContaining({ page: 'orders' }))
  })

  it('shows customer greeting when userCustomer is provided', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu
        auth={false}
        isHideSignup={false}
        userCustomer={customerFixture}
      />
    )
    fireEvent.click(getByLabelText('menu'))
    expect(getByText(/Hi/)).toBeInTheDocument()
    expect(getByText(/Alex Customer/)).toBeInTheDocument()
  })

  it('closes sidebar from close control', () => {
    const sidebar = document.getElementById('sidebar_menu')
    sidebar.style.width = '340px'
    const { getByLabelText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByLabelText('close'))
    expect(sidebar.style.width).toMatch(/^0/)
  })

  it('renders logout control for authenticated users', () => {
    const { getByLabelText, getByTestId } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    expect(getByTestId('logout-button')).toBeInTheDocument()
  })

  it('navigates home when home link is clicked', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('Home'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'home' })
  })

  it('navigates to loyalty points wallet', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('Loyalty points'))
    expect(emit).toHaveBeenCalledWith('go_to_page', expect.objectContaining({
      page: 'wallets',
      search: '?wallet=credit_point'
    }))
  })

  it('navigates to gift cards wallet', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('Gift cards'))
    expect(emit).toHaveBeenCalledWith('go_to_page', expect.objectContaining({
      page: 'wallets',
      search: '?wallet=gift_card'
    }))
  })

  it('navigates to offers when promotions are enabled', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('Offers'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'promotions' })
  })

  it('navigates to my students when school module is enabled', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('My students'))
    expect(emit).toHaveBeenCalledWith('go_to_page', expect.objectContaining({
      page: 'profile',
      search: '?view=students'
    }))
  })

  it('hides my students when school module is off', () => {
    schoolModuleValue.value = '0'
    const { getByLabelText, queryByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    expect(queryByText('My students')).not.toBeInTheDocument()
  })

  it('navigates to saved cards', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('My cards'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'cards' })
  })

  it('navigates to messages', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('Messages'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'messages' })
  })

  it('navigates to language settings', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('Language'))
    expect(emit).toHaveBeenCalledWith('go_to_page', expect.objectContaining({
      page: 'profile',
      search: '?view=language'
    }))
  })

  it('navigates to notifications settings', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('Notifications'))
    expect(emit).toHaveBeenCalledWith('go_to_page', expect.objectContaining({
      page: 'profile',
      search: '?view=notifications'
    }))
  })

  it('navigates to help', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('help'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'help' })
  })

  it('navigates to sessions for enterprise users', () => {
    const { getByLabelText, getByText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    fireEvent.click(getByText('Sessions'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'sessions' })
  })

  it('hides signup for guests when isHideSignup is true', () => {
    const { getByLabelText, queryByText } = renderWithProviders(
      <SidebarMenu auth={false} isHideSignup />
    )
    fireEvent.click(getByLabelText('menu'))
    expect(queryByText('Sign up')).not.toBeInTheDocument()
  })

  it('closes sidebar when clicking outside', () => {
    const sidebar = document.getElementById('sidebar_menu')
    const { getByLabelText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    expect(sidebar.style.width).not.toMatch(/^0/)
    fireEvent.mouseDown(document.body)
    expect(sidebar.style.width).toMatch(/^0/)
  })

  it('uses full viewport width on small screens when menu opens', () => {
    windowSize.width = 400
    const sidebar = document.getElementById('sidebar_menu')
    const { getByLabelText } = renderWithProviders(
      <SidebarMenu auth isHideSignup={false} />
    )
    fireEvent.click(getByLabelText('menu'))
    expect(sidebar.style.width).toMatch(/100v/)
  })
})
