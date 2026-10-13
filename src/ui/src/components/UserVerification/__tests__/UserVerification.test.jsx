import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { baseUserVerificationUIProps } from '../../__tests__/helpers/authTestUtils'

const { Primitive, Input, verificationPropsRef, configTuple, sessionTuple } = vi.hoisted(() => {
  const { createAuthUiPrimitives } = require('../../__tests__/helpers/authUiTestMocks.js')
  const { Primitive, Input } = createAuthUiPrimitives()
  const configs = {
    verification_email_required: { value: '1' },
    verification_phone_required: { value: '0' }
  }
  const user = {
    email_verified: false,
    phone_verified: false,
    email: 'user@example.com',
    cellphone: '5551234567',
    country_phone_code: '+1'
  }
  return {
    Primitive,
    Input,
    verificationPropsRef: { current: null },
    configTuple: [{ configs }],
    sessionTuple: [{ auth: true, user }, { login: vi.fn() }]
  }
})

vi.mock('~ui/src/styles/Inputs', () => ({ Input }))
vi.mock('~ui/src/styles/Buttons', () => ({ Button: Primitive }))
vi.mock('~components/components/UserVerification', () => ({
  UserVerification: ({ UIComponent, ...rest }) => (
    <UIComponent {...verificationPropsRef.current} {...rest} />
  )
}))
vi.mock('~components/components/UserFormDetails', () => ({
  UserFormDetails: () => <div data-testid='user-form-details' />
}))
vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => configTuple
}))
vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => sessionTuple
}))
vi.mock('~ui/src/components/UserFormDetails', () => ({
  UserFormDetailsUI: () => null
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ children, open }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))

import { UserVerification } from '../index'

describe('UserVerification', () => {
  it('renders email verification prompt when required', () => {
    configTuple[0].configs = {
      verification_email_required: { value: '1' },
      verification_phone_required: { value: '0' }
    }
    verificationPropsRef.current = { ...baseUserVerificationUIProps }
    const { getByText } = renderWithProviders(<UserVerification />)
    expect(getByText('Verification Code')).toBeInTheDocument()
    expect(getByText(/please verify your email/)).toBeInTheDocument()
  })

  it('starts phone verification flow when send code is clicked', async () => {
    const sendVerifyPhoneCode = vi.fn()
    configTuple[0].configs = {
      verification_email_required: { value: '0' },
      verification_phone_required: { value: '1' }
    }
    verificationPropsRef.current = {
      ...baseUserVerificationUIProps,
      sendVerifyPhoneCode
    }

    const { getByText } = renderWithProviders(<UserVerification />)
    fireEvent.click(getByText('Send code'))
    await waitFor(() => {
      expect(sendVerifyPhoneCode).toHaveBeenCalled()
    })
  })

  it('renders OTP inputs after email code is sent', () => {
    configTuple[0].configs = {
      verification_email_required: { value: '1' },
      verification_phone_required: { value: '0' }
    }
    verificationPropsRef.current = {
      ...baseUserVerificationUIProps,
      verifyEmailState: {
        loading: false,
        loadingSendCode: false,
        loadingCheckCode: false,
        resultSendCode: true
      }
    }
    const { getByTestId } = renderWithProviders(<UserVerification />)
    expect(getByTestId('otp-input')).toBeInTheDocument()
  })

  it('shows alert when email verification returns an error', async () => {
    configTuple[0].configs = {
      verification_email_required: { value: '1' },
      verification_phone_required: { value: '0' }
    }
    verificationPropsRef.current = {
      ...baseUserVerificationUIProps,
      verifyEmailState: {
        loading: false,
        loadingSendCode: false,
        errorSendCode: ['Invalid code']
      }
    }
    const { getByTestId } = renderWithProviders(<UserVerification />)
    await waitFor(() => {
      expect(getByTestId('alert')).toBeInTheDocument()
    })
  })

  it('renders phone OTP inputs after code is sent', () => {
    configTuple[0].configs = {
      verification_email_required: { value: '0' },
      verification_phone_required: { value: '1' }
    }
    verificationPropsRef.current = {
      ...baseUserVerificationUIProps,
      verifyPhoneState: {
        loading: false,
        loadingSendCode: false,
        loadingCheckCode: false,
        resultSendCode: true
      }
    }
    const { getByTestId } = renderWithProviders(<UserVerification />)
    expect(getByTestId('otp-input')).toBeInTheDocument()
  })

  it('sends email verification code when button is clicked', async () => {
    const sendVerifyEmailCode = vi.fn()
    configTuple[0].configs = {
      verification_email_required: { value: '1' },
      verification_phone_required: { value: '0' }
    }
    verificationPropsRef.current = {
      ...baseUserVerificationUIProps,
      sendVerifyEmailCode
    }
    const { getByText } = renderWithProviders(<UserVerification />)
    fireEvent.click(getByText('Send code'))
    await waitFor(() => {
      expect(sendVerifyEmailCode).toHaveBeenCalled()
    })
  })
})
