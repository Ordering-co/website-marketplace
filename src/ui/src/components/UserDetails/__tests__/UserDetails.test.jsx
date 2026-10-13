import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { formStateFixture, userFixture, validationFieldsFixture } from '../../__tests__/helpers/profileWalletTestMocks'
import { UserDetails } from '../index'

vi.mock('~components/components/UserFormDetails', () => ({
  UserFormDetails: ({ UIComponent, ...rest }) => (
    <UIComponent
      isEdit={false}
      isModal
      cartStatus={0}
      formState={formStateFixture}
      validationFields={validationFieldsFixture}
      userState={{ loading: false }}
      userData={userFixture}
      loading={false}
      toggleIsEdit={vi.fn()}
      onClose={vi.fn()}
      handleSendVerifyCode={vi.fn()}
      verifyPhoneState={{ result: null }}
      {...rest}
    />
  )
}))

vi.mock('~ui/hooks/useCountdownTimer', () => ({
  useCountdownTimer: () => [60, vi.fn(), vi.fn()]
}))

describe('UserDetails', () => {
  it('renders customer details header and user name', () => {
    const { getByText } = renderWithProviders(<UserDetails />)
    expect(getByText('Customer Details')).toBeInTheDocument()
    expect(getByText(/Jane/)).toBeInTheDocument()
  })
})
