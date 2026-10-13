import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { formStateFixture, userFixture } from '../../__tests__/helpers/profileWalletTestMocks'
import { UserProfileForm } from '../index'

vi.mock('~components/components/UserFormDetails', () => ({
  UserFormDetails: ({ UIComponent, ...rest }) => (
    <UIComponent
      view='account'
      isEdit={false}
      formState={formStateFixture}
      userData={userFixture}
      user={userFixture}
      toggleIsEdit={vi.fn()}
      handleButtonUpdateClick={vi.fn()}
      handlechangeImage={vi.fn()}
      handleSendOtp={vi.fn()}
      verifyPhoneState={{ result: null }}
      setFormState={vi.fn()}
      showCustomerPicture={false}
      isHiddenAddress
      {...rest}
    />
  )
}))

vi.mock('~ui/src/components/UserFormDetails', () => ({
  UserFormDetailsUI: () => <div data-testid='user-form-details-stub' />
}))

vi.mock('~ui/src/components/AddressList', () => ({
  AddressList: () => null
}))

vi.mock('~ui/src/components/StudentsList', () => ({
  StudentsList: () => null
}))

vi.mock('~ui/hooks/useCountdownTimer', () => ({
  useCountdownTimer: () => [60, vi.fn(), vi.fn()]
}))

describe('UserProfileForm', () => {
  it('renders my account heading', () => {
    const { getByText } = renderWithProviders(<UserProfileForm />)
    expect(getByText('My Account')).toBeInTheDocument()
  })
})
