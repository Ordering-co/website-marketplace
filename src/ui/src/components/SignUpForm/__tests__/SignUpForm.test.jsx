import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { baseSignupUIProps } from '../../__tests__/helpers/authTestUtils'

const { Primitive, Input, signupUIPropsRef, optimizationTuple, configTuple } = vi.hoisted(() => {
  const { createAuthUiPrimitives } = require('../../__tests__/helpers/authUiTestMocks.js')
  const { Primitive, Input } = createAuthUiPrimitives()
  const optimizationConfigs = {
    google_login_enabled: { value: '0' },
    facebook_login_enabled: { value: '0' },
    apple_login_enabled: { value: '0' }
  }
  const configs = {
    business_signup_allow: { value: '1' },
    driver_signup_allow: { value: '0' },
    terms_and_conditions: { value: 'true' }
  }
  return {
    Primitive,
    Input,
    signupUIPropsRef: { current: null },
    optimizationTuple: [{ loading: false, result: { configs: optimizationConfigs } }],
    configTuple: [{ configs }]
  }
})

vi.mock('~ui/src/styles/Tabs', () => ({ Tabs: Primitive, Tab: Primitive }))
vi.mock('~ui/src/styles/Buttons', () => {
  const { createAuthUiPrimitives } = require('../../__tests__/helpers/authUiTestMocks.js')
  return { Button: createAuthUiPrimitives().Button }
})
vi.mock('~ui/src/styles/Inputs', () => ({ Input }))
vi.mock('~ui/src/styles/Checkbox', () => ({ Checkbox: Primitive }))
vi.mock('react-hook-form', () => {
  const { createStableUseFormMock } = require('../../__tests__/helpers/authUiTestMocks.js')
  return createStableUseFormMock()
})
vi.mock('~components/components/SignupForm', () => ({
  SignupForm: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...signupUIPropsRef.current} />
  )
}))
vi.mock('~components/contexts/OptimizationLoadContext', () => ({
  useOptimizationLoad: () => optimizationTuple
}))
vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => configTuple
}))
vi.mock('~ui/src/components/FacebookLogin', () => ({
  FacebookLoginButton: () => <button type='button'>fb</button>
}))
vi.mock('~ui/src/components/GoogleLogin', () => ({
  GoogleLoginButton: () => <button type='button'>google</button>
}))
vi.mock('~ui/src/components/AppleLogin', () => ({
  AppleLogin: () => <button type='button'>apple</button>
}))

import { SignUpForm } from '../index'

const setSocialLoginConfigs = ({ facebookFlag, googleFlag }) => {
  const configs = {
    business_signup_allow: { value: '1' },
    driver_signup_allow: { value: '0' },
    terms_and_conditions: { value: 'true' },
    google_login_client_id: { value: 'google-id' },
    google_login_auth_domain: { value: 'google.example.com' },
    google_login_api_key: { value: 'google-api-key' },
    facebook_id: { value: 'facebook-id' },
    apple_login_enabled: { value: '0', enabled: true }
  }

  if (facebookFlag !== undefined) configs.facebook_login_enabled = facebookFlag
  if (googleFlag !== undefined) configs.google_login_enabled = googleFlag

  configTuple[0].configs = configs
}

describe('SignUpForm', () => {
  afterEach(() => {
    delete window.__FIRST_LOAD__
    delete window.__CONFIG__
    setSocialLoginConfigs({
      facebookFlag: { value: '0' },
      googleFlag: { value: '0' }
    })
  })

  it('renders signup form title', async () => {
    signupUIPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }
    const { getByText } = renderWithProviders(<SignUpForm />)
    await waitFor(() => {
      expect(getByText('Sign up')).toBeInTheDocument()
    })
  })

  it('shows alert on signup error', async () => {
    signupUIPropsRef.current = {
      ...baseSignupUIProps,
      isCustomerMode: false,
      formState: { loading: false, result: { error: true, result: ['Email taken'] } }
    }
    const { getByTestId } = renderWithProviders(<SignUpForm />)
    await waitFor(() => {
      expect(getByTestId('alert')).toBeInTheDocument()
    })
  })

  it('renders business signup link when allowed', async () => {
    signupUIPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false, isGuest: false }
    const { getByText } = renderWithProviders(<SignUpForm />)
    await waitFor(() => {
      expect(getByText('Sign up for business')).toBeInTheDocument()
    })
  })

  it('submits signup and calls handler', async () => {
    const handleButtonSignupClick = vi.fn()
    signupUIPropsRef.current = {
      ...baseSignupUIProps,
      isCustomerMode: false,
      handleButtonSignupClick
    }
    const { getByText } = renderWithProviders(<SignUpForm />)
    fireEvent.click(getByText('Create an account'))
    await waitFor(() => {
      expect(handleButtonSignupClick).toHaveBeenCalled()
    })
  })

  it('changes email input and toggles password visibility', async () => {
    const handleChangeInput = vi.fn()
    signupUIPropsRef.current = {
      ...baseSignupUIProps,
      isCustomerMode: false,
      handleChangeInput
    }
    const { getByLabelText, getAllByLabelText, getByTestId } = renderWithProviders(<SignUpForm />)
    fireEvent.change(getByLabelText('email'), { target: { value: 'user@test.com' } })
    expect(handleChangeInput).toHaveBeenCalled()
    fireEvent.click(getByTestId('icon-eyeFilled'))
    const passwordFields = getAllByLabelText('password')
    expect(passwordFields[passwordFields.length - 1]).toHaveAttribute('type', 'text')
  })

  it('renders signup method tabs when multiple flows enabled', () => {
    const setSignUpTab = vi.fn()
    signupUIPropsRef.current = {
      ...baseSignupUIProps,
      isCustomerMode: false,
      setSignUpTab,
      useSignUpFullDetails: true,
      useSignUpOtpEmail: true,
      useSignUpOtpCellphone: false
    }
    const { getByText } = renderWithProviders(<SignUpForm />)
    expect(getByText('Default')).toBeInTheDocument()
    expect(getByText('by Otp Email')).toBeInTheDocument()
    fireEvent.click(getByText('by Otp Email'))
    expect(setSignUpTab).toHaveBeenCalledWith('otpEmail')
  })

  it('shows OTP verification UI when willVerifyOtpState is true', () => {
    signupUIPropsRef.current = {
      ...baseSignupUIProps,
      isCustomerMode: false,
      willVerifyOtpState: true,
      checkPhoneCodeState: { loading: false }
    }
    const { getByTestId } = renderWithProviders(<SignUpForm />)
    expect(getByTestId('otp-input')).toBeInTheDocument()
  })

  it('shows spinner when phone code check is loading', () => {
    signupUIPropsRef.current = {
      ...baseSignupUIProps,
      isCustomerMode: false,
      checkPhoneCodeState: { loading: true }
    }
    const { getByTestId } = renderWithProviders(<SignUpForm />)
    expect(getByTestId('spinner')).toBeInTheDocument()
  })

  it('renders login redirect when elementLinkToLogin is provided', () => {
    signupUIPropsRef.current = {
      ...baseSignupUIProps,
      isCustomerMode: false,
      elementLinkToLogin: <a href='/login'>Login</a>
    }
    const { getByText } = renderWithProviders(<SignUpForm />)
    expect(getByText('Already have an account?')).toBeInTheDocument()
    expect(getByText('Login')).toBeInTheDocument()
  })

  it('renders terms and promotions checkboxes', () => {
    signupUIPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }
    const { getByText } = renderWithProviders(<SignUpForm />)
    expect(getByText('Terms & Conditions')).toBeInTheDocument()
    expect(getByText('Receive newsletters and exclusive promotions')).toBeInTheDocument()
  })

  it('shows recaptcha error alert for verification code failure', async () => {
    configTuple[0].configs = {
      ...configTuple[0].configs,
      security_recaptcha_site_key: { value: 'site-key' }
    }
    signupUIPropsRef.current = {
      ...baseSignupUIProps,
      isCustomerMode: false,
      formState: {
        loading: false,
        result: { error: true, result: ['ERROR_AUTH_VERIFICATION_CODE'] }
      }
    }
    const { getByTestId } = renderWithProviders(<SignUpForm />)
    await waitFor(() => {
      expect(getByTestId('alert')).toBeInTheDocument()
    })
  })

  it('renders social login buttons when worker-injected configs enable them', () => {
    window.__CONFIG__ = { project: 'buzzgrabit' }
    window.__FIRST_LOAD__ = { result: { configs: {} } }
    configTuple[0].configs = {
      ...configTuple[0].configs,
      google_login_enabled: { value: '1' },
      facebook_login_enabled: { value: '1' },
      apple_login_enabled: { value: '1' },
      google_login_client_id: { value: 'g-id' },
      google_login_auth_domain: { value: 'domain' },
      google_login_api_key: { value: 'api-key' },
      facebook_id: { value: 'fb-id' },
      apple_login_client_id: { value: 'apple-id' }
    }
    signupUIPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }
    const { getByText } = renderWithProviders(<SignUpForm />)
    expect(getByText('google')).toBeInTheDocument()
    expect(getByText('fb')).toBeInTheDocument()
    expect(getByText('apple')).toBeInTheDocument()
  })

  it.each([
    ['0', '0', false, false],
    ['0', '1', false, true],
    ['1', '0', true, false],
    ['1', '1', true, true]
  ])("gates Facebook and Google independently for flags %s/%s", (facebookValue, googleValue, showFacebook, showGoogle) => {
    setSocialLoginConfigs({
      facebookFlag: { value: facebookValue },
      googleFlag: { value: googleValue }
    })
    signupUIPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }

    const { queryByText } = renderWithProviders(<SignUpForm />)

    expect(Boolean(queryByText('fb'))).toBe(showFacebook)
    expect(Boolean(queryByText('google'))).toBe(showGoogle)
    expect(queryByText('apple')).not.toBeInTheDocument()
  })

  it.each([
    ['reduced zero', { value: '0' }],
    ['dictionary zero', { value: '0', enabled: true }],
    ['missing flags', undefined]
  ])("keeps Facebook and Google disabled for %s", (_label, flag) => {
    setSocialLoginConfigs({ facebookFlag: flag, googleFlag: flag })
    signupUIPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }

    const { queryByText } = renderWithProviders(<SignUpForm />)

    expect(queryByText('fb')).not.toBeInTheDocument()
    expect(queryByText('google')).not.toBeInTheDocument()
    expect(queryByText('apple')).not.toBeInTheDocument()
  })

  it("removes Facebook and Google after their flags change from on to off", () => {
    setSocialLoginConfigs({
      facebookFlag: { value: '1' },
      googleFlag: { value: '1' }
    })
    signupUIPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false }
    const view = renderWithProviders(<SignUpForm />)
    expect(view.getByText('fb')).toBeInTheDocument()
    expect(view.getByText('google')).toBeInTheDocument()

    setSocialLoginConfigs({
      facebookFlag: { value: '0', enabled: true },
      googleFlag: { value: '0', enabled: true }
    })
    view.rerender(<SignUpForm />)

    expect(view.queryByText('fb')).not.toBeInTheDocument()
    expect(view.queryByText('google')).not.toBeInTheDocument()
  })

  it('navigates to business signup page', () => {
    signupUIPropsRef.current = { ...baseSignupUIProps, isCustomerMode: false, isGuest: false }
    const { getByText } = renderWithProviders(<SignUpForm />)
    fireEvent.click(getByText('Sign up for business'))
  })

  it('renders whatsapp and sms buttons on otp cellphone tab', () => {
    signupUIPropsRef.current = {
      ...baseSignupUIProps,
      isCustomerMode: false,
      signUpTab: 'otpCellphone',
      useSignUpFullDetails: true,
      useSignUpOtpEmail: false,
      useSignUpOtpCellphone: true,
      useSignUpOtpWhatsapp: true
    }
    const { getByText } = renderWithProviders(<SignUpForm />)
    expect(getByText('Send by SMS')).toBeInTheDocument()
    expect(getByText('Send by WhatsApp')).toBeInTheDocument()
  })
})
