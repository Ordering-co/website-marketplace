import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'

vi.unmock('~ui/src/components/InputPhoneNumber')

import { InputPhoneNumber } from '../index'

vi.mock('react-phone-number-input', () => ({
  default: ({ placeholder, onChange, value }) => (
    <input
      data-testid='phone-input-field'
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}))

describe('InputPhoneNumber', () => {
  it('renders phone number input', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <InputPhoneNumber value='' setValue={vi.fn()} handleIsValid={vi.fn()} user={{}} />
    )
    expect(getByPlaceholderText('Phone number')).toBeInTheDocument()
  })
})
