import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { VerifyCodeForm } from '../index'

const handleCheckPhoneCode = vi.fn()

vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('react-otp-input', () => ({
  default: ({ value, onChange }) => (
    <input
      data-testid='otp-input'
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}))

import themeJson from '../../../../../theme.json'

const theme = { ...themeJson, images: {}, third_party_code: {} }

describe('VerifyCodeForm', () => {
  it('submits OTP when four digits are entered', () => {
    const { getByTestId } = renderWithProviders(
      <VerifyCodeForm
        otpLeftTime={120}
        handleSendOtp={vi.fn()}
        handleCheckPhoneCode={handleCheckPhoneCode}
        credentials={{ cellphone: '5551234567', country_phone_code: '+1' }}
        email='user@example.com'
        isPhone
      />,
      { theme }
    )

    fireEvent.change(getByTestId('otp-input'), { target: { value: '1234' } })

    expect(handleCheckPhoneCode).toHaveBeenCalledWith({
      cellphone: '5551234567',
      country_phone_code: '+1',
      code: '1234'
    })
  })
})
