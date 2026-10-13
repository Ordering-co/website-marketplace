import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { baseResetPasswordUIProps } from '../../__tests__/helpers/authTestUtils'

const { Primitive, Input, resetPropsRef } = vi.hoisted(() => {
  const { createAuthUiPrimitives } = require('../../__tests__/helpers/authUiTestMocks.js')
  const { Primitive, Input } = createAuthUiPrimitives()
  return { Primitive, Input, resetPropsRef: { current: null } }
})

vi.mock('~ui/src/styles/Buttons', () => ({ Button: Primitive }))
vi.mock('~ui/src/styles/Inputs', () => ({ Input }))
vi.mock('react-hook-form', () => {
  const { createStableUseFormMock } = require('../../__tests__/helpers/authUiTestMocks.js')
  return createStableUseFormMock()
})
vi.mock('~components/components/ResetPassword', () => ({
  ResetPassword: ({ UIComponent, ...rest }) => (
    <UIComponent {...rest} {...resetPropsRef.current} />
  )
}))
vi.mock('~ui/src/components/LoginForm', () => ({
  LoginForm: () => <div data-testid='login-form-modal' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ children, open }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))

import { ResetPassword } from '../index'

describe('ResetPassword UI', () => {
  it('renders reset password form when code and random exist', () => {
    resetPropsRef.current = { ...baseResetPasswordUIProps }
    const { getByText } = renderWithProviders(<ResetPassword code='abc' random='xyz' />)
    expect(getByText('Reset password')).toBeInTheDocument()
    expect(getByText('Change password')).toBeInTheDocument()
  })

  it('renders code entry form when code and random are missing', () => {
    resetPropsRef.current = {
      ...baseResetPasswordUIProps,
      code: null,
      random: null
    }
    const { getByText } = renderWithProviders(<ResetPassword />)
    expect(getByText('Please insert the codes')).toBeInTheDocument()
  })

  it('submits password reset', () => {
    const handleResetPassword = vi.fn()
    resetPropsRef.current = {
      ...baseResetPasswordUIProps,
      handleResetPassword
    }
    const { container, getByText } = renderWithProviders(<ResetPassword code='abc' random='xyz' />)
    expect(getByText('Change password')).toBeInTheDocument()
    fireEvent.submit(container.querySelector('form'))
    expect(handleResetPassword).toHaveBeenCalled()
  })

  it('shows error alert when reset fails', async () => {
    resetPropsRef.current = {
      ...baseResetPasswordUIProps,
      formState: { loading: false, result: { error: true, result: ['Invalid code'] } }
    }
    const { getByTestId } = renderWithProviders(<ResetPassword code='abc' random='xyz' />)
    await waitFor(() => {
      expect(getByTestId('alert')).toBeInTheDocument()
    })
  })

  it('opens login modal after successful reset', async () => {
    resetPropsRef.current = {
      ...baseResetPasswordUIProps,
      formState: { loading: false, result: { error: null, result: ['ok'] } }
    }
    const { getByTestId } = renderWithProviders(<ResetPassword code='abc' random='xyz' />)
    await waitFor(() => {
      expect(getByTestId('modal')).toBeInTheDocument()
      expect(getByTestId('login-form-modal')).toBeInTheDocument()
    })
  })
})
