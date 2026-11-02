import React, { useEffect, useMemo, useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, waitFor } from '@testing-library/react'
import { mockFetch, renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { ApiResponse } from '~components/sdk/lib/classes/ApiResponse'
import { User } from '~components/sdk/lib/models/User'
import { UserVerification } from '../index'

const {
  Input,
  Button,
  verificationPropsRef,
  configTuple,
  sessionTuple,
  apiTuple,
  sessionActionsRef,
  sessionStateRef,
  SessionMockContext,
  ordering,
  orderTuple,
  useRealVerification
} = vi.hoisted(() => {
  const React = require('react')
  const { createAuthUiPrimitives } = require('../../__tests__/helpers/authUiTestMocks.js')
  const { Button } = createAuthUiPrimitives()
  const Input = React.forwardRef(function InputMock (props, ref) {
    return React.createElement('input', { ...props, ref })
  })
  const configs = {
    verification_email_required: { value: '1' },
    verification_phone_required: { value: '0' }
  }
  const ordering = {
    project: 'demo',
    root: 'https://api.ordering.test',
    appId: 'marketplace-test',
    appInternalName: 'ordering-internal-test'
  }
  ordering.setAccessToken = vi.fn(() => ordering)
  ordering.users = vi.fn()
  return {
    Input,
    Button,
    verificationPropsRef: { current: null },
    useRealVerification: { current: false },
    configTuple: [{ configs }],
    sessionTuple: [{ auth: true, user: {}, token: 'test-token' }, { login: vi.fn(), changeUser: vi.fn(), logout: vi.fn() }],
    orderTuple: [{ options: { type: 1 }, carts: {} }, { setStateInitialValues: vi.fn(async () => ({})) }],
    apiTuple: [ordering, { setOrdering: vi.fn() }],
    sessionActionsRef: { current: null },
    sessionStateRef: { current: null },
    SessionMockContext: React.createContext(null),
    ordering
  }
})

vi.mock('~ui/src/styles/Inputs', () => ({ Input }))
vi.mock('~ui/src/styles/Buttons', () => ({ Button }))
vi.mock('../styles', async (importOriginal) => {
  const styles = await importOriginal()
  const React = await import('react')
  return {
    ...styles,
    FormInput: ({ children, ...props }) => React.createElement('form', props, children)
  }
})
vi.mock('~components/components/UserVerification', async (importOriginal) => {
  const actual = await importOriginal()
  const React = await import('react')
  return {
    UserVerification: (props) => {
      if (useRealVerification.current) {
        return React.createElement(actual.UserVerification, props)
      }
      const { UIComponent, ...rest } = props
      return React.createElement(UIComponent, { ...verificationPropsRef.current, ...rest })
    }
  }
})
vi.mock('~components/components/UserFormDetails', async (importOriginal) => await importOriginal())
vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => configTuple
}))
vi.mock('~components/contexts/SessionContext', async () => {
  const React = await import('react')
  return {
    useSession: () => React.useContext(SessionMockContext) || sessionTuple
  }
})
vi.mock('~components/contexts/ApiContext', () => ({
  useApi: () => apiTuple
}))
vi.mock('~components/contexts/CustomerContext', () => ({
  useCustomer: () => [{ user: {} }, { setUserCustomer: vi.fn() }]
}))
vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => orderTuple
}))
vi.mock('~components/contexts/ValidationsFieldsContext', () => ({
  useValidationFields: () => [{ loading: false, fields: { checkout: {} } }]
}))
vi.mock('~components/contexts/WebsocketContext', () => ({
  useWebsocket: () => ({ on: vi.fn(), off: vi.fn(), getId: () => 'socket-id' })
}))
vi.mock('~ui/src/components/UserFormDetails', () => ({
  UserFormDetailsUI: () => null
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ children, open }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))

const baseUser = {
  id: 7,
  email_verified: false,
  phone_verified: false,
  email: 'user@example.com',
  cellphone: '5551234567',
  country_phone_code: '+1'
}

const guestUser = {
  id: 21,
  email_verified: false,
  phone_verified: false,
  email: null,
  guest_id: 'guest-token',
  cellphone: '5551234567',
  country_phone_code: '+1'
}

const emailRequiredConfigs = () => ({
  verification_email_required: { value: '1' },
  verification_phone_required: { value: '0' }
})

const idleEmailState = () => ({
  loading: false,
  loadingSendCode: false,
  loadingCheckCode: false,
  resultSendCode: null,
  errorSendCode: null,
  resultCheckCode: null,
  errorCheckCode: null
})

const idlePhoneState = () => ({
  loading: false,
  loadingSendCode: false,
  loadingCheckCode: false,
  resultSendCode: null,
  errorSendCode: null,
  resultCheckCode: null,
  errorCheckCode: null
})

const makeVerificationProps = (overrides = {}) => ({
  verifyEmailState: idleEmailState(),
  verifyPhoneState: idlePhoneState(),
  sendVerifyEmailCode: vi.fn(),
  sendVerifyPhoneCode: vi.fn(),
  checkVerifyEmailCode: vi.fn(),
  checkVerifyPhoneCode: vi.fn(),
  cleanErrorsState: vi.fn(),
  useWhatsappVerification: false,
  ...overrides
})

const StatefulSession = ({ initialSession, children }) => {
  const [session, setSession] = useState(initialSession)
  const actions = useMemo(() => ({
    login: vi.fn(),
    changeUser: (nextUser) => setSession((prev) => ({ ...prev, user: nextUser })),
    logout: () => setSession((prev) => ({ ...prev, auth: false, user: null, token: null }))
  }), [])
  useEffect(() => {
    sessionActionsRef.current = actions
    sessionStateRef.current = session
  })
  return (
    <SessionMockContext.Provider value={[session, actions]}>
      {children}
    </SessionMockContext.Provider>
  )
}

const renderVerification = ({ session, ...options } = {}) => {
  const wrapper = session
    ? ({ children }) => (
        <StatefulSession initialSession={session}>{children}</StatefulSession>
      )
    : undefined
  return renderWithProviders(<UserVerification />, { ...options, wrapper })
}

describe('UserVerification', () => {
  beforeEach(() => {
    verificationPropsRef.current = makeVerificationProps()
    configTuple[0].configs = emailRequiredConfigs()
    sessionTuple[0] = { auth: true, user: { ...baseUser }, token: 'test-token' }
    ordering.users.mockReset()
    ordering.users.mockImplementation(() => ({ save: vi.fn(), get: vi.fn() }))
    sessionActionsRef.current = null
    sessionStateRef.current = null
    useRealVerification.current = false
  })

  it('renders email verification prompt when required', () => {
    const { getByText } = renderVerification()
    expect(getByText('Verification Code')).toBeInTheDocument()
    expect(getByText(/please verify your email/)).toBeInTheDocument()
  })

  it('sends the stored email code when send code is clicked', async () => {
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode })
    const { getByText } = renderVerification()
    fireEvent.click(getByText('Send code'))
    await waitFor(() => {
      expect(sendVerifyEmailCode).toHaveBeenCalledWith({ email: 'user@example.com' })
    })
    expect(ordering.users).not.toHaveBeenCalled()
  })

  it('keeps the stored email read-only and never triggers a profile update', () => {
    const usersSave = vi.fn()
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const { getByLabelText, getByText, queryByText } = renderVerification({
      session: { auth: true, user: { ...guestUser, email: 'user@example.com' }, token: 'sess-token-1' }
    })
    const emailInput = getByLabelText('email')
    expect(emailInput).toHaveAttribute('readonly')
    expect(emailInput).toHaveAttribute('placeholder', 'user@example.com')
    expect(getByText('Change')).toBeInTheDocument()
    expect(queryByText('Save')).not.toBeInTheDocument()
    expect(usersSave).not.toHaveBeenCalled()
  })

  it('starts phone verification flow when send code is clicked', async () => {
    const sendVerifyPhoneCode = vi.fn()
    configTuple[0].configs = {
      verification_email_required: { value: '0' },
      verification_phone_required: { value: '1' }
    }
    verificationPropsRef.current = makeVerificationProps({ sendVerifyPhoneCode })

    const { getByText } = renderVerification()
    fireEvent.click(getByText('Send code'))
    await waitFor(() => {
      expect(sendVerifyPhoneCode).toHaveBeenCalledWith({
        cellphone: '5551234567',
        country_phone_code: '+1',
        channel: 2
      })
    })
  })

  it('renders OTP inputs after email code is sent', () => {
    verificationPropsRef.current = makeVerificationProps({
      verifyEmailState: { ...idleEmailState(), resultSendCode: true }
    })
    const { getByTestId } = renderVerification()
    expect(getByTestId('otp-input')).toBeInTheDocument()
  })

  it('shows alert when email verification returns an error', async () => {
    verificationPropsRef.current = makeVerificationProps({
      verifyEmailState: { ...idleEmailState(), errorSendCode: ['Invalid code'] }
    })
    const { getByTestId } = renderVerification()
    await waitFor(() => {
      expect(getByTestId('alert')).toBeInTheDocument()
    })
  })

  it('renders phone OTP inputs after code is sent', () => {
    configTuple[0].configs = {
      verification_email_required: { value: '0' },
      verification_phone_required: { value: '1' }
    }
    verificationPropsRef.current = makeVerificationProps({
      verifyPhoneState: { ...idlePhoneState(), resultSendCode: true }
    })
    const { getByTestId } = renderVerification()
    expect(getByTestId('otp-input')).toBeInTheDocument()
  })

  it.each([null, undefined, ''])('renders an editable email form when the session email is %s', (email) => {
    sessionTuple[0] = { auth: true, user: { ...guestUser, email }, token: 'test-token' }
    const { getByLabelText, getByText, queryByText } = renderVerification()
    const input = getByLabelText('email')
    expect(input).not.toBeDisabled()
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('placeholder', 'Email')
    expect(getByText('Save')).toBeInTheDocument()
    expect(queryByText('Send code')).not.toBeInTheDocument()
  })

  it.each([
    ['', 'required'],
    ['   ', 'required'],
    ['not-an-email', 'Invalid email'],
    ['a@b', 'Invalid email']
  ])('blocks saving an empty or invalid draft like %s', (draft, expectedMessage) => {
    sessionTuple[0] = { auth: true, user: { ...guestUser }, token: 'test-token' }
    const usersSave = vi.fn()
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode })

    const { getByLabelText, getByText, getByRole } = renderVerification()
    if (draft) {
      fireEvent.change(getByLabelText('email'), { target: { value: draft } })
    }
    fireEvent.click(getByText('Save'))
    expect(usersSave).not.toHaveBeenCalled()
    expect(getByRole('alert')).toHaveTextContent(expectedMessage)
    expect(getByLabelText('email')).toHaveAttribute('aria-invalid', 'true')
    expect(sendVerifyEmailCode).not.toHaveBeenCalled()
  })

  it('does not save twice while a save is in flight', async () => {
    sessionTuple[0] = { auth: true, user: { ...guestUser }, token: 'test-token' }
    let resolveSave
    const usersSave = vi.fn(() => new Promise((resolve) => { resolveSave = resolve }))
    ordering.users.mockImplementation(() => ({ save: usersSave }))

    const { getByLabelText, getByText } = renderVerification()
    fireEvent.change(getByLabelText('email'), { target: { value: 'guest@example.com' } })
    const saveButton = getByText('Save')
    fireEvent.click(saveButton)
    await waitFor(() => expect(saveButton).toBeDisabled())
    fireEvent.click(saveButton)
    expect(usersSave).toHaveBeenCalledTimes(1)
    await act(async () => {
      resolveSave({ content: { error: false, result: { ...guestUser, email: 'guest@example.com' } } })
    })
  })

  it.each([
    { name: 'array', result: ['Email already registered', 'Field is invalid'], text: 'Email already registered, Field is invalid' },
    { name: 'sdk model-cast array', result: new ApiResponse({ status: 200, data: { error: true, result: ['Email already registered'] } }, { json: true, CastClass: User }).content.result, text: 'Email already registered' },
    { name: 'object', result: { code: 500 }, text: 'Error' }
  ])('shows the $name save error and keeps the draft without sending a code', async ({ result, text }) => {
    sessionTuple[0] = { auth: true, user: { ...guestUser }, token: 'test-token' }
    const usersSave = vi.fn().mockResolvedValue({ content: { error: true, result } })
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode })

    const { getByLabelText, getByText, getByRole } = renderVerification()
    fireEvent.change(getByLabelText('email'), { target: { value: 'guest@example.com' } })
    fireEvent.click(getByText('Save'))

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent(text))
    expect(getByLabelText('email')).toHaveValue('guest@example.com')
    expect(sendVerifyEmailCode).not.toHaveBeenCalled()
  })

  it('shows a network save error, keeps the draft, and retries successfully via Enter', async () => {
    const guest = { ...guestUser }
    const usersSave = vi.fn()
      .mockRejectedValueOnce(new Error('Connection lost'))
      .mockResolvedValue({
        content: { error: false, result: { id: 21, email: 'guest@example.com', guest_id: 'guest-token' } }
      })
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode })

    const { getByLabelText, getByText, getByRole, getByPlaceholderText } = renderVerification({
      session: { auth: true, user: guest, token: 'sess-token-1' }
    })

    const input = getByLabelText('email')
    fireEvent.change(input, { target: { value: 'guest@example.com' } })
    fireEvent.click(getByText('Save'))

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent('Connection lost'))
    expect(input).toHaveValue('guest@example.com')
    expect(getByText('Save')).toBeEnabled()
    expect(usersSave).toHaveBeenCalledTimes(1)
    expect(sendVerifyEmailCode).not.toHaveBeenCalled()

    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => expect(usersSave).toHaveBeenCalledTimes(2))
    expect(ordering.users).toHaveBeenCalledWith(21)
    expect(usersSave).toHaveBeenLastCalledWith(
      { email: 'guest@example.com', guest_token: 'guest-token' },
      { accessToken: 'sess-token-1' }
    )
    const retryPayload = usersSave.mock.calls[1][0]
    expect(retryPayload.password).toBeUndefined()
    expect(retryPayload.email_verified).toBeUndefined()

    const emailDisplay = await waitFor(() => getByPlaceholderText('guest@example.com'))
    expect(emailDisplay).toHaveAttribute('readonly')
    expect(getByText('Send code')).toBeInTheDocument()
    expect(sendVerifyEmailCode).not.toHaveBeenCalled()
  })

  it('saves a guest email, keeps the guest session, then sends and checks the code for the saved email', async () => {
    const guest = { ...guestUser }
    const usersSave = vi.fn().mockResolvedValue({
      content: { error: false, result: { id: 21, email: 'guest@example.com', guest_id: 'guest-token' } }
    })
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const sendVerifyEmailCode = vi.fn()
    const checkVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode, checkVerifyEmailCode })

    const { getByLabelText, getByText, getByPlaceholderText, getByTestId, rerender } = renderVerification({
      session: { auth: true, user: guest, token: 'sess-token-1' }
    })

    fireEvent.change(getByLabelText('email'), { target: { value: '  Guest@Example.COM ' } })
    fireEvent.click(getByText('Save'))

    await waitFor(() => expect(usersSave).toHaveBeenCalledTimes(1))
    expect(ordering.users).toHaveBeenCalledWith(21)
    expect(usersSave).toHaveBeenCalledWith(
      { email: 'guest@example.com', guest_token: 'guest-token' },
      { accessToken: 'sess-token-1' }
    )
    expect(sessionStateRef.current.user.guest_id).toBe('guest-token')
    expect(sessionStateRef.current.user.password).toBeUndefined()

    const emailDisplay = await waitFor(() => getByPlaceholderText('guest@example.com'))
    expect(emailDisplay).toHaveAttribute('readonly')

    fireEvent.click(getByText('Send code'))
    expect(sendVerifyEmailCode).toHaveBeenCalledWith({ email: 'guest@example.com' })

    verificationPropsRef.current = makeVerificationProps({
      sendVerifyEmailCode,
      checkVerifyEmailCode,
      verifyEmailState: { ...idleEmailState(), resultSendCode: true }
    })
    rerender(<UserVerification />)

    const otp = await waitFor(() => getByTestId('otp-input'))
    fireEvent.change(otp, { target: { value: '123456' } })
    await waitFor(() => expect(checkVerifyEmailCode).toHaveBeenCalledWith({ code: '123456' }))

    fireEvent.click(getByText('Resend again?'))
    expect(sendVerifyEmailCode).toHaveBeenCalledTimes(2)
    expect(sendVerifyEmailCode).toHaveBeenLastCalledWith({ email: 'guest@example.com' })
  })

  it('never sends an email code while the session email is missing', async () => {
    sessionTuple[0] = { auth: true, user: { ...guestUser }, token: 'test-token' }
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({
      sendVerifyEmailCode,
      verifyEmailState: { ...idleEmailState(), resultSendCode: true }
    })
    const { getByText } = renderVerification()
    const resend = await waitFor(() => getByText('Resend again?'))
    fireEvent.click(resend)
    expect(sendVerifyEmailCode).not.toHaveBeenCalled()
  })

  it('does not send another email code while one is being generated', () => {
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({
      sendVerifyEmailCode,
      verifyEmailState: { ...idleEmailState(), loadingSendCode: true }
    })
    const { getByText } = renderVerification()
    const sendButton = getByText('Send code')
    expect(sendButton).toBeDisabled()
    fireEvent.click(sendButton)
    expect(sendVerifyEmailCode).not.toHaveBeenCalled()
  })

  it('clears the typed email when the session user changes', async () => {
    const guest = { ...guestUser }
    const { getByLabelText } = renderVerification({
      session: { auth: true, user: guest, token: 'test-token' }
    })
    fireEvent.change(getByLabelText('email'), { target: { value: 'draft@example.com' } })
    expect(getByLabelText('email')).toHaveValue('draft@example.com')
    act(() => {
      sessionActionsRef.current.changeUser({ ...guest, id: 99 })
    })
    expect(getByLabelText('email')).toHaveValue('')
  })

  it('keeps the phone flow for guests without email when only phone verification is required', async () => {
    configTuple[0].configs = {
      verification_email_required: { value: '0' },
      verification_phone_required: { value: '1' }
    }
    sessionTuple[0] = {
      auth: true,
      user: { ...guestUser, cellphone: '5551234567', country_phone_code: '+1' },
      token: 'test-token'
    }
    const sendVerifyPhoneCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyPhoneCode })

    const { getByText, queryByLabelText } = renderVerification()
    expect(queryByLabelText('email')).not.toBeInTheDocument()
    fireEvent.click(getByText('Send code'))
    await waitFor(() => {
      expect(sendVerifyPhoneCode).toHaveBeenCalledWith({
        cellphone: '5551234567',
        country_phone_code: '+1',
        channel: 2
      })
    })
  })

  it('requests the email code through the real controller contract', async () => {
    const { UserVerification: RealUserVerificationController } = await vi.importActual('~components/components/UserVerification')
    const captured = { current: null }
    const SpyUI = (props) => {
      captured.current = props
      return null
    }
    mockFetch({ error: false, result: { generated: true } })
    renderWithProviders(<RealUserVerificationController UIComponent={SpyUI} />)
    await act(async () => {
      await captured.current.sendVerifyEmailCode({ email: 'guest@example.com' })
    })
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.ordering.test/codes/generate',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
        body: JSON.stringify({ type: 3, channel: 1, size: 6, email: 'guest@example.com' })
      })
    )
  })

  it('prevents native form navigation after saving the email with Enter', async () => {
    const usersSave = vi.fn().mockResolvedValue({
      content: { error: false, result: { id: 21, email: 'guest@example.com', guest_id: 'guest-token' } }
    })
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode })
    const { getByLabelText, getByPlaceholderText } = renderVerification({
      session: { auth: true, user: { ...guestUser }, token: 'sess-token-1' }
    })
    const input = getByLabelText('email')
    fireEvent.change(input, { target: { value: 'guest@example.com' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    const savedInput = await waitFor(() => getByPlaceholderText('guest@example.com'))
    const submit = new Event('submit', { bubbles: true, cancelable: true })
    fireEvent(savedInput.closest('form'), submit)
    expect(submit.defaultPrevented).toBe(true)
    expect(savedInput).toHaveAttribute('readonly')
    expect(sessionStateRef.current.user.email).toBe('guest@example.com')
    expect(usersSave).toHaveBeenCalledTimes(1)
    expect(sendVerifyEmailCode).not.toHaveBeenCalled()
  })
})

describe('UserVerification stored-email editing', () => {
  beforeEach(() => {
    verificationPropsRef.current = makeVerificationProps()
    configTuple[0].configs = emailRequiredConfigs()
    sessionTuple[0] = { auth: true, user: { ...guestUser, email: 'user@example.com' }, token: 'test-token' }
    ordering.users.mockReset()
    ordering.users.mockImplementation(() => ({ save: vi.fn(), get: vi.fn() }))
    sessionActionsRef.current = null
    sessionStateRef.current = null
    useRealVerification.current = false
  })

  it('opens an editable form prefilled with the stored email', () => {
    const { getByText, getByLabelText } = renderVerification()
    fireEvent.click(getByText('Change'))
    const input = getByLabelText('email')
    expect(input).not.toBeDisabled()
    expect(input).toHaveValue('user@example.com')
    expect(getByText('Save')).toBeInTheDocument()
    expect(getByText('Cancel')).toBeInTheDocument()
  })

  it('cancelling an edit restores the readonly email without saving', () => {
    const usersSave = vi.fn()
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const { getByText, getByLabelText, getByPlaceholderText } = renderVerification()
    fireEvent.click(getByText('Change'))
    fireEvent.change(getByLabelText('email'), { target: { value: 'draft@example.com' } })
    fireEvent.click(getByText('Cancel'))
    expect(usersSave).not.toHaveBeenCalled()
    expect(getByPlaceholderText('user@example.com')).toHaveAttribute('readonly')
    expect(getByText('Send code')).toBeInTheDocument()
  })

  it.each([
    ['not-an-email', 'Invalid email'],
    ['a@b', 'Invalid email'],
    ['   ', 'required']
  ])('blocks saving an invalid edited email like %s', (draft, expectedMessage) => {
    const usersSave = vi.fn()
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode })
    const { getByText, getByLabelText, getByRole } = renderVerification()
    fireEvent.click(getByText('Change'))
    fireEvent.change(getByLabelText('email'), { target: { value: draft } })
    fireEvent.click(getByText('Save'))
    expect(usersSave).not.toHaveBeenCalled()
    expect(getByRole('alert')).toHaveTextContent(expectedMessage)
    expect(getByLabelText('email')).toHaveAttribute('aria-invalid', 'true')
    expect(sendVerifyEmailCode).not.toHaveBeenCalled()
  })

  it('saves a corrected guest email with guest_token and uses it for send and resend', async () => {
    const guest = { ...guestUser, email: 'typo@guest.com' }
    const usersSave = vi.fn().mockResolvedValue({
      content: { error: false, result: { id: 21, email: 'fixed@guest.com', guest_id: 'guest-token' } }
    })
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode })

    const { getByText, getByLabelText, getByPlaceholderText, rerender } = renderVerification({
      session: { auth: true, user: guest, token: 'sess-token-1' }
    })
    fireEvent.click(getByText('Change'))
    const input = getByLabelText('email')
    expect(input).toHaveValue('typo@guest.com')
    fireEvent.change(input, { target: { value: 'fixed@guest.com' } })
    fireEvent.click(getByText('Save'))

    await waitFor(() => expect(usersSave).toHaveBeenCalledTimes(1))
    expect(ordering.users).toHaveBeenCalledWith(21)
    expect(usersSave).toHaveBeenCalledWith(
      { email: 'fixed@guest.com', guest_token: 'guest-token' },
      { accessToken: 'sess-token-1' }
    )
    const payload = usersSave.mock.calls[0][0]
    expect(payload.password).toBeUndefined()
    expect(payload.email_verified).toBeUndefined()

    const emailDisplay = await waitFor(() => getByPlaceholderText('fixed@guest.com'))
    expect(emailDisplay).toHaveAttribute('readonly')
    fireEvent.click(getByText('Send code'))
    expect(sendVerifyEmailCode).toHaveBeenCalledWith({ email: 'fixed@guest.com' })

    verificationPropsRef.current = makeVerificationProps({
      sendVerifyEmailCode,
      verifyEmailState: { ...idleEmailState(), resultSendCode: true }
    })
    rerender(<UserVerification />)
    fireEvent.click(await waitFor(() => getByText('Resend again?')))
    expect(sendVerifyEmailCode).toHaveBeenLastCalledWith({ email: 'fixed@guest.com' })
  })

  it('keeps the edited draft after a rejected save and Cancel returns to the stored email', async () => {
    const guest = { ...guestUser, email: 'old@guest.com' }
    const usersSave = vi.fn().mockResolvedValue({
      content: { error: true, result: ['Email already registered'] }
    })
    ordering.users.mockImplementation(() => ({ save: usersSave }))

    const { getByText, getByLabelText, getByRole, getByPlaceholderText } = renderVerification({
      session: { auth: true, user: guest, token: 'sess-token-1' }
    })
    fireEvent.click(getByText('Change'))
    const input = getByLabelText('email')
    fireEvent.change(input, { target: { value: 'taken@guest.com' } })
    fireEvent.click(getByText('Save'))

    await waitFor(() => expect(getByRole('alert')).toHaveTextContent('Email already registered'))
    expect(getByLabelText('email')).toHaveValue('taken@guest.com')
    fireEvent.click(getByText('Cancel'))
    expect(getByPlaceholderText('old@guest.com')).toHaveAttribute('readonly')
    expect(usersSave).toHaveBeenCalledTimes(1)
  })

  it.each(['same@guest.com', 'SAME@GUEST.COM'])('does not save when the edited email is unchanged like %s', async (draft) => {
    const guest = { ...guestUser, email: 'same@guest.com' }
    const usersSave = vi.fn()
    ordering.users.mockImplementation(() => ({ save: usersSave }))

    const { getByText, getByLabelText, getByPlaceholderText, queryByText } = renderVerification({
      session: { auth: true, user: guest, token: 'sess-token-1' }
    })
    fireEvent.click(getByText('Change'))
    fireEvent.change(getByLabelText('email'), { target: { value: draft } })
    fireEvent.click(getByText('Save'))
    expect(usersSave).not.toHaveBeenCalled()
    expect(await waitFor(() => getByPlaceholderText('same@guest.com'))).toHaveAttribute('readonly')
    expect(queryByText('Save')).not.toBeInTheDocument()
  })

  it('does not offer Change or Save to a registered user and still sends the stored email', async () => {
    const usersSave = vi.fn()
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode })

    const { getByText, queryByText, queryByRole, getByLabelText, getByPlaceholderText } = renderVerification({
      session: { auth: true, user: { ...baseUser }, token: 'sess-token-1' }
    })
    expect(getByPlaceholderText('user@example.com')).toBeInTheDocument()
    expect(getByLabelText('email')).toHaveAttribute('readonly')
    expect(queryByText('Change')).not.toBeInTheDocument()
    expect(queryByText('Save')).not.toBeInTheDocument()
    expect(getByText('Send code')).not.toBeDisabled()
    expect(queryByRole('status')).not.toBeInTheDocument()
    fireEvent.click(getByText('Send code'))
    expect(sendVerifyEmailCode).toHaveBeenCalledWith({ email: 'user@example.com' })
    expect(usersSave).not.toHaveBeenCalled()
  })

  it.each([null, undefined, ''])('disables send and explains why to a registered user with email %s', (email) => {
    const usersSave = vi.fn()
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode })

    const { getByText, getByLabelText, queryByText, getByRole } = renderVerification({
      session: { auth: true, user: { ...baseUser, email }, token: 'sess-token-1' }
    })
    expect(getByLabelText('email')).toHaveAttribute('readonly')
    expect(queryByText('Save')).not.toBeInTheDocument()
    expect(queryByText('Change')).not.toBeInTheDocument()
    expect(getByRole('status')).toHaveTextContent('This account has no email address. An email address is required to send a verification code.')
    const sendButton = getByText('Send code')
    expect(sendButton).toBeDisabled()
    fireEvent.click(sendButton)
    expect(sendVerifyEmailCode).not.toHaveBeenCalled()
    expect(usersSave).not.toHaveBeenCalled()
  })

  it('resets the email verification flow after a correction so an abandoned OTP is never checked', async () => {
    useRealVerification.current = true
    const guest = { ...guestUser, email: 'old@guest.com' }
    const usersSave = vi.fn().mockResolvedValue({
      content: { error: false, result: { id: 21, email: 'new@guest.com', guest_id: 'guest-token' } }
    })
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    global.fetch = vi.fn(async (url) => ({
      ok: true,
      status: 200,
      json: async () => String(url).includes('/verify')
        ? { error: false, result: { id: 21, email_verified: true } }
        : { error: false, result: { available: true } }
    }))

    const { getByText, getByLabelText, getByPlaceholderText, getByTestId, queryByTestId } = renderVerification({
      session: { auth: true, user: guest, token: 'sess-token-1' }
    })

    fireEvent.click(getByText('Send code'))
    await waitFor(() => expect(getByTestId('otp-input')).toBeInTheDocument())
    fireEvent.click(getByText('Cancel'))
    await waitFor(() => expect(getByPlaceholderText('old@guest.com')).toHaveAttribute('readonly'))

    fireEvent.click(getByText('Change'))
    fireEvent.change(getByLabelText('email'), { target: { value: 'new@guest.com' } })
    fireEvent.click(getByText('Save'))
    await waitFor(() => expect(usersSave).toHaveBeenCalledTimes(1))

    const emailDisplay = await waitFor(() => getByPlaceholderText('new@guest.com'))
    expect(emailDisplay).toHaveAttribute('readonly')
    expect(queryByTestId('otp-input')).not.toBeInTheDocument()
    expect(global.fetch.mock.calls.filter(([url]) => String(url).includes('/verify'))).toHaveLength(0)

    fireEvent.click(getByText('Send code'))
    await waitFor(() => {
      const generateCalls = global.fetch.mock.calls.filter(([url]) => String(url).includes('/codes/generate'))
      expect(generateCalls).toHaveLength(2)
      expect(JSON.parse(generateCalls[0][1].body).email).toBe('old@guest.com')
      expect(JSON.parse(generateCalls[1][1].body).email).toBe('new@guest.com')
    })

    const otp = await waitFor(() => getByTestId('otp-input'))
    fireEvent.change(otp, { target: { value: '654321' } })
    await waitFor(() => {
      const verifyCalls = global.fetch.mock.calls.filter(([url]) => String(url).includes('/users/21/verify'))
      expect(verifyCalls).toHaveLength(1)
      expect(JSON.parse(verifyCalls[0][1].body).code).toBe('654321')
    })
  })

  it('does not reuse the old email code result when sending to the corrected email fails', async () => {
    useRealVerification.current = true
    const guest = { ...guestUser, email: 'old@guest.com' }
    const usersSave = vi.fn().mockResolvedValue({
      content: { error: false, result: { id: 21, email: 'new@guest.com', guest_id: 'guest-token' } }
    })
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ error: false, result: { available: true } }) })
      .mockRejectedValueOnce(new Error('Connection lost'))
    const { getByText, getByLabelText, getByPlaceholderText, getByTestId, queryByTestId } = renderVerification({
      session: { auth: true, user: guest, token: 'sess-token-1' }
    })
    fireEvent.click(getByText('Send code'))
    const oldOtp = await waitFor(() => getByTestId('otp-input'))
    fireEvent.change(oldOtp, { target: { value: '12' } })
    fireEvent.click(getByText('Cancel'))
    fireEvent.click(getByText('Change'))
    fireEvent.change(getByLabelText('email'), { target: { value: 'new@guest.com' } })
    fireEvent.click(getByText('Save'))
    await waitFor(() => expect(getByPlaceholderText('new@guest.com')).toHaveAttribute('readonly'))
    fireEvent.click(getByText('Send code'))
    await waitFor(() => expect(getByTestId('alert')).toBeInTheDocument())
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(JSON.parse(global.fetch.mock.calls[0][1].body).email).toBe('old@guest.com')
    expect(JSON.parse(global.fetch.mock.calls[1][1].body).email).toBe('new@guest.com')
    expect(queryByTestId('otp-input')).not.toBeInTheDocument()
    expect(getByPlaceholderText('new@guest.com')).toHaveAttribute('readonly')
    expect(getByText('Send code')).toBeInTheDocument()
  })

  it('prefills the draft from guest_email and still requires Save before send', async () => {
    const guest = { ...guestUser, email: null, guest_email: 'hint@guest.com' }
    const usersSave = vi.fn().mockResolvedValue({
      content: { error: false, result: { id: 21, email: 'hint@guest.com', guest_id: 'guest-token' } }
    })
    ordering.users.mockImplementation(() => ({ save: usersSave }))
    const sendVerifyEmailCode = vi.fn()
    verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode })

    const { getByText, getByLabelText, getByPlaceholderText, queryByText } = renderVerification({
      session: { auth: true, user: guest, token: 'sess-token-1' }
    })
    const input = getByLabelText('email')
    expect(input).toHaveValue('hint@guest.com')
    expect(queryByText('Send code')).not.toBeInTheDocument()
    fireEvent.click(getByText('Save'))
    await waitFor(() => expect(usersSave).toHaveBeenCalledTimes(1))
    expect(usersSave).toHaveBeenCalledWith(
      { email: 'hint@guest.com', guest_token: 'guest-token' },
      { accessToken: 'sess-token-1' }
    )
    expect(await waitFor(() => getByPlaceholderText('hint@guest.com'))).toHaveAttribute('readonly')
    fireEvent.click(getByText('Send code'))
    expect(sendVerifyEmailCode).toHaveBeenCalledWith({ email: 'hint@guest.com' })
  })

  it('prefers the stored email over guest_email for the draft', () => {
    const guest = { ...guestUser, email: 'stored@guest.com', guest_email: 'hint@guest.com' }
    const { getByText, getByLabelText, getByPlaceholderText } = renderVerification({
      session: { auth: true, user: guest, token: 'sess-token-1' }
    })
    expect(getByPlaceholderText('stored@guest.com')).toHaveAttribute('readonly')
    fireEvent.click(getByText('Change'))
    expect(getByLabelText('email')).toHaveValue('stored@guest.com')
  })

  describe('guest email save failure recovery', () => {
    const saveOccupiedEmail = () => {
      const guest = { ...guestUser, email: 'old@guest.com' }
      const logoutApi = vi.fn().mockResolvedValue({ content: { error: false, result: true } })
      const usersSave = vi.fn().mockResolvedValue({
        content: { error: true, result: ['Email already registered'] }
      })
      ordering.users.mockImplementation(() => ({ save: usersSave, get: vi.fn(), logout: logoutApi }))
      const sendVerifyEmailCode = vi.fn()
      verificationPropsRef.current = makeVerificationProps({ sendVerifyEmailCode })
      const rendered = renderVerification({
        session: { auth: true, user: guest, token: 'sess-token-1' }
      })
      fireEvent.click(rendered.getByText('Change'))
      fireEvent.change(rendered.getByLabelText('email'), { target: { value: 'taken@guest.com' } })
      fireEvent.click(rendered.getByText('Save'))
      return { ...rendered, guest, usersSave, logoutApi, sendVerifyEmailCode }
    }

    it('shows the raw save error, a recovery hint and Logout while keeping the draft and no OTP', async () => {
      const { getByRole, getByLabelText, getByText, queryByTestId } = saveOccupiedEmail()
      await waitFor(() => expect(getByRole('alert')).toHaveTextContent('Email already registered'))
      expect(getByText('If this email is already in use, enter another email or log out, then log in or sign up with this email.')).toBeInTheDocument()
      expect(getByText('Logout')).toBeInTheDocument()
      expect(getByLabelText('email')).toHaveValue('taken@guest.com')
      expect(queryByTestId('otp-input')).not.toBeInTheDocument()
      expect(verificationPropsRef.current.sendVerifyEmailCode).not.toHaveBeenCalled()
    })

    it('logout success clears the session and resets order through the real controller', async () => {
      const { getByText, logoutApi, sendVerifyEmailCode } = saveOccupiedEmail()
      await waitFor(() => expect(getByText('Logout')).toBeInTheDocument())
      fireEvent.click(getByText('Logout'))
      await waitFor(() => expect(logoutApi).toHaveBeenCalledTimes(1))
      await waitFor(() => expect(sessionStateRef.current.auth).toBe(false))
      expect(sessionStateRef.current.user).toBeNull()
      expect(orderTuple[1].setStateInitialValues).toHaveBeenCalled()
      expect(sendVerifyEmailCode).not.toHaveBeenCalled()
    })

    it('logout failure keeps the guest session, shows the error and re-enables Save and Logout', async () => {
      const guest = { ...guestUser, email: 'old@guest.com' }
      const logoutApi = vi.fn().mockResolvedValue({ content: { error: true, result: 'Cannot logout' } })
      const usersSave = vi.fn().mockResolvedValue({
        content: { error: true, result: ['Email already registered'] }
      })
      ordering.users.mockImplementation(() => ({ save: usersSave, get: vi.fn(), logout: logoutApi }))
      const rendered = renderVerification({
        session: { auth: true, user: guest, token: 'sess-token-1' }
      })
      fireEvent.click(rendered.getByText('Change'))
      fireEvent.change(rendered.getByLabelText('email'), { target: { value: 'taken@guest.com' } })
      fireEvent.click(rendered.getByText('Save'))
      await waitFor(() => expect(rendered.getByText('Logout')).toBeInTheDocument())

      fireEvent.click(rendered.getByText('Logout'))
      await waitFor(() => expect(logoutApi).toHaveBeenCalledTimes(1))
      await waitFor(() => expect(rendered.getByText('Logout')).not.toBeDisabled())
      expect(sessionStateRef.current.auth).toBe(true)
      expect(sessionStateRef.current.user?.guest_id).toBe('guest-token')
      expect(rendered.getByLabelText('email')).not.toBeDisabled()
      expect(rendered.getByText('Save')).not.toBeDisabled()
      expect(rendered.getAllByRole('alert').some(el => el.textContent === 'Error')).toBe(true)
    })

    it('disables Save, Cancel and the email input while logout is pending', async () => {
      const guest = { ...guestUser, email: 'old@guest.com' }
      let resolveLogout
      const logoutApi = vi.fn(() => new Promise((resolve) => { resolveLogout = resolve }))
      const usersSave = vi.fn().mockResolvedValue({
        content: { error: true, result: ['Email already registered'] }
      })
      ordering.users.mockImplementation(() => ({ save: usersSave, get: vi.fn(), logout: logoutApi }))
      const rendered = renderVerification({
        session: { auth: true, user: guest, token: 'sess-token-1' }
      })
      fireEvent.click(rendered.getByText('Change'))
      fireEvent.change(rendered.getByLabelText('email'), { target: { value: 'taken@guest.com' } })
      fireEvent.click(rendered.getByText('Save'))
      await waitFor(() => expect(rendered.getByText('Logout')).toBeInTheDocument())

      fireEvent.click(rendered.getByText('Logout'))
      await waitFor(() => expect(rendered.getByLabelText('email')).toBeDisabled())
      expect(rendered.getByText('Save')).toBeDisabled()
      expect(rendered.getByText('Cancel')).toBeDisabled()
      expect(rendered.getByText('Logout')).toBeDisabled()

      await act(async () => {
        resolveLogout({ content: { error: false, result: true } })
      })
      await waitFor(() => expect(sessionStateRef.current.auth).toBe(false))
    })
  })
})
