import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { QueryLoginSpoonity } from '../index'

const emit = vi.fn()
const login = vi.fn()
const setAuthModalOpen = vi.fn()
const setModalPageToShow = vi.fn()

const { spoonityPropsRef } = vi.hoisted(() => ({
  spoonityPropsRef: { current: null }
}))

vi.mock('~components/components/QueryLoginSpoonity', () => ({
  QueryLoginSpoonity: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...spoonityPropsRef.current} />
  )
}))
vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ auth: false }, { login }]
}))
vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~components/contexts/SiteContext', () => ({
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('~ui/src/components/SpinnerLoader', () => ({
  SpinnerLoader: ({ content }) => <div data-testid='spinner-loader'>{content}</div>
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ children, open, onClose }) => (
    open
      ? (
        <div data-testid='auth-modal'>
          <button type='button' onClick={onClose}>close</button>
          {children}
        </div>
        )
      : null
  )
}))
vi.mock('~ui/src/components/LoginForm', () => ({
  LoginForm: ({ elementLinkToSignup, elementLinkToForgotPassword, handleSuccessLogin }) => (
    <div data-testid='login-form'>
      {elementLinkToSignup}
      {elementLinkToForgotPassword}
      <button type='button' onClick={() => handleSuccessLogin({ id: 1 })}>success-login</button>
    </div>
  )
}))
vi.mock('~ui/src/components/SignUpForm', () => ({
  SignUpForm: ({ elementLinkToLogin, handleSuccessSignup, closeModal }) => (
    <div data-testid='signup-form'>
      {elementLinkToLogin}
      <button type='button' onClick={() => handleSuccessSignup({ session: { access_token: 'tok' } })}>success-signup</button>
      <button type='button' onClick={closeModal}>close-signup</button>
    </div>
  )
}))
vi.mock('~ui/src/components/ForgotPasswordForm', () => ({
  ForgotPasswordForm: ({ elementLinkToLogin }) => (
    <div data-testid='forgot-form'>{elementLinkToLogin}</div>
  )
}))

describe('QueryLoginSpoonity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    spoonityPropsRef.current = {
      userState: { loading: false },
      notificationState: {},
      authModalOpen: true,
      setAuthModalOpen,
      modalPageToShow: 'login',
      setModalPageToShow
    }
    delete window.location
    window.location = { pathname: '/store/demo-store' }
  })

  it('renders auth modal with login form', () => {
    const { getByTestId } = renderWithProviders(<QueryLoginSpoonity />)
    expect(getByTestId('auth-modal')).toBeInTheDocument()
    expect(getByTestId('login-form')).toBeInTheDocument()
  })

  it('renders signup and forgot-password modal pages', () => {
    spoonityPropsRef.current = {
      ...spoonityPropsRef.current,
      modalPageToShow: 'signup'
    }
    const { getByTestId, rerender } = renderWithProviders(<QueryLoginSpoonity />)
    expect(getByTestId('signup-form')).toBeInTheDocument()

    spoonityPropsRef.current = {
      ...spoonityPropsRef.current,
      modalPageToShow: 'forgotpassword'
    }
    rerender(<QueryLoginSpoonity />)
    expect(getByTestId('forgot-form')).toBeInTheDocument()
  })

  it('shows loading spinner while user state loads', () => {
    spoonityPropsRef.current = {
      ...spoonityPropsRef.current,
      userState: { loading: true }
    }
    const { getByTestId } = renderWithProviders(<QueryLoginSpoonity />)
    expect(getByTestId('spinner-loader')).toBeInTheDocument()
  })

  it('switches modal pages from login links', () => {
    const { getByText } = renderWithProviders(<QueryLoginSpoonity />)
    fireEvent.click(getByText('Create account'))
    expect(setModalPageToShow).toHaveBeenCalledWith('signup')
    fireEvent.click(getByText('Reset password'))
    expect(setModalPageToShow).toHaveBeenCalledWith('forgotpassword')
  })

  it('closes modal and redirects to business page', () => {
    const { getByText } = renderWithProviders(<QueryLoginSpoonity />)
    fireEvent.click(getByText('close'))
    expect(setAuthModalOpen).toHaveBeenCalledWith(false)
    expect(setModalPageToShow).toHaveBeenCalledWith(null)
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'demo-store' }
    })
  })

  it('handles successful login and signup flows', () => {
    spoonityPropsRef.current = {
      ...spoonityPropsRef.current,
      modalPageToShow: 'signup'
    }
    const { getByText } = renderWithProviders(<QueryLoginSpoonity />)
    fireEvent.click(getByText('success-signup'))
    expect(login).toHaveBeenCalledWith({
      user: { session: { access_token: 'tok' } },
      token: 'tok'
    })
    fireEvent.click(getByText('close-signup'))
    expect(setAuthModalOpen).toHaveBeenCalledWith(false)
  })
})
