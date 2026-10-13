import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { baseSignupUIProps } from '../../__tests__/helpers/authTestUtils'

const { Primitive, Input, signupUIPropsRef, mockPagesGet } = vi.hoisted(() => {
  const { createAuthUiPrimitives } = require('../../__tests__/helpers/authUiTestMocks.js')
  const { Primitive, Input } = createAuthUiPrimitives()
  const mockPagesGet = vi.fn()
  return { Primitive, Input, signupUIPropsRef: { current: null }, mockPagesGet }
})

vi.mock('~ui/src/styles/Buttons', () => ({ Button: Primitive }))
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
vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{
    configs: {
      verification_phone_required: { value: '0' },
      terms_and_conditions: { value: 'true' }
    }
  }]
}))
vi.mock('~components/contexts/ApiContext', () => ({
  useApi: () => [{ pages: vi.fn(() => ({ get: mockPagesGet })) }]
}))

import { SignUpBusiness } from '../index'

describe('SignUpBusiness', () => {
  beforeEach(() => {
    signupUIPropsRef.current = { ...baseSignupUIProps }
    mockPagesGet.mockResolvedValue({
      content: { error: null, result: { body: '<p>Business signup content</p>', enabled: true } }
    })
  })

  it('loads business signup content', async () => {
    const { container } = renderWithProviders(<SignUpBusiness />)
    await waitFor(() => {
      expect(container.innerHTML).toContain('Business signup content')
    })
  })

  it('renders signup form when page content is unavailable', async () => {
    mockPagesGet.mockResolvedValue({
      content: { error: true, result: null }
    })
    const { getByText, getByLabelText, getByPlaceholderText } = renderWithProviders(<SignUpBusiness />)
    await waitFor(() => {
      expect(getByText('Sign up now')).toBeInTheDocument()
      expect(getByLabelText('email')).toBeInTheDocument()
      expect(getByPlaceholderText('Password')).toBeInTheDocument()
    })
  })

  it('submits business signup form', async () => {
    const handleButtonSignupClick = vi.fn()
    mockPagesGet.mockResolvedValue({ content: { error: true, result: null } })
    signupUIPropsRef.current = { ...baseSignupUIProps, handleButtonSignupClick }
    const { container, getByText } = renderWithProviders(<SignUpBusiness />)
    await waitFor(() => expect(getByText('Submit')).toBeInTheDocument())
    fireEvent.submit(container.querySelector('form'))
    expect(handleButtonSignupClick).toHaveBeenCalled()
  })

  it('shows alert on signup error', async () => {
    mockPagesGet.mockResolvedValue({ content: { error: true, result: null } })
    signupUIPropsRef.current = {
      ...baseSignupUIProps,
      formState: { loading: false, result: { error: true, result: ['Business error'] } }
    }
    const { getByTestId } = renderWithProviders(<SignUpBusiness />)
    await waitFor(() => {
      expect(getByTestId('alert')).toBeInTheDocument()
    })
  })

  it('toggles password visibility', async () => {
    mockPagesGet.mockResolvedValue({ content: { error: true, result: null } })
    const { getByPlaceholderText, getByTestId } = renderWithProviders(<SignUpBusiness />)
    await waitFor(() => expect(getByPlaceholderText('Password')).toBeInTheDocument())
    fireEvent.click(getByTestId('icon-eye'))
    expect(getByPlaceholderText('Password')).toHaveAttribute('type', 'text')
  })
})
