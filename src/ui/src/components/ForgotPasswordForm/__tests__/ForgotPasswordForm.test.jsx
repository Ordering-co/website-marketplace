import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { baseForgotPasswordUIProps } from '../../__tests__/helpers/authTestUtils'

const { Primitive, Input, forgotPropsRef } = vi.hoisted(() => {
  const { createAuthUiPrimitives } = require('../../__tests__/helpers/authUiTestMocks.js')
  const { Primitive, Input } = createAuthUiPrimitives()
  return { Primitive, Input, forgotPropsRef: { current: null } }
})

vi.mock('~ui/src/styles/Buttons', () => {
  const { createAuthUiPrimitives } = require('../../__tests__/helpers/authUiTestMocks.js')
  return { Button: createAuthUiPrimitives().Button }
})
vi.mock('~ui/src/styles/Inputs', () => ({ Input }))
vi.mock('react-hook-form', () => {
  const { createStableUseFormMock } = require('../../__tests__/helpers/authUiTestMocks.js')
  return createStableUseFormMock()
})
vi.mock('../styles', () => {
  const { createAuthUiPrimitives } = require('../../__tests__/helpers/authUiTestMocks.js')
  const { Primitive, FormInput } = createAuthUiPrimitives()
  return {
    ForgotPasswordContainer: Primitive,
    FormSide: Primitive,
    FormInput,
    InputWrapper: Primitive,
    RedirectLink: Primitive,
    ReCaptchaWrapper: Primitive,
    ValidationText: Primitive
  }
})
vi.mock('~components/components/ForgotPasswordForm', () => ({
  ForgotPasswordForm: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...forgotPropsRef.current} />
  )
}))

import { ForgotPasswordForm } from '../index'

describe('ForgotPasswordForm', () => {
  it('renders recover password form', () => {
    forgotPropsRef.current = { ...baseForgotPasswordUIProps }
    const { getByPlaceholderText, getByText } = renderWithProviders(<ForgotPasswordForm />)
    expect(getByText('Forgot your password?')).toBeInTheDocument()
    expect(getByPlaceholderText('Email')).toBeInTheDocument()
    expect(getByText('Recover Password')).toBeInTheDocument()
  })

  it('submits forgot password request', () => {
    const handleButtonForgotPasswordClick = vi.fn()
    forgotPropsRef.current = {
      ...baseForgotPasswordUIProps,
      handleButtonForgotPasswordClick
    }
    const { container, getByText } = renderWithProviders(<ForgotPasswordForm />)
    fireEvent.submit(container.querySelector('form'))
    expect(handleButtonForgotPasswordClick).toHaveBeenCalled()
  })

  it('shows error alert when request fails', async () => {
    forgotPropsRef.current = {
      ...baseForgotPasswordUIProps,
      formState: { loading: false, result: { error: true, result: ['User not found'] } }
    }
    const { getByTestId } = renderWithProviders(<ForgotPasswordForm />)
    await waitFor(() => {
      expect(getByTestId('alert')).toBeInTheDocument()
    })
  })

  it('shows success state after submit completes', async () => {
    const handleButtonForgotPasswordClick = vi.fn()
    forgotPropsRef.current = {
      ...baseForgotPasswordUIProps,
      handleButtonForgotPasswordClick,
      formState: { loading: false, result: { error: null, result: ['sent'] } }
    }
    const { container, getByText } = renderWithProviders(<ForgotPasswordForm />)
    fireEvent.submit(container.querySelector('form'))
    await waitFor(() => {
      expect(handleButtonForgotPasswordClick).toHaveBeenCalled()
      expect(getByText('Link Sent')).toBeInTheDocument()
    })
  })

  it('renders login redirect link when provided', () => {
    forgotPropsRef.current = {
      ...baseForgotPasswordUIProps,
      elementLinkToLogin: <a href='/login'>Sign in</a>
    }
    const { getByText } = renderWithProviders(<ForgotPasswordForm />)
    expect(getByText('Do you want to sign in?')).toBeInTheDocument()
    expect(getByText('Sign in')).toBeInTheDocument()
  })
})
