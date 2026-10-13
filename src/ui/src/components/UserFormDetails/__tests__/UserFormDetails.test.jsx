import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { formStateFixture, userFixture, validationFieldsFixture } from '../../__tests__/helpers/profileWalletTestMocks'
import { UserFormDetailsUI } from '../index'

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: () => null,
    handleSubmit: (fn) => fn,
    errors: {},
    formState: { errors: {} }
  })
}))

vi.mock('~ui/src/components/SignUpForm', () => ({
  SignUpForm: () => null
}))

vi.mock('~ui/src/components/LanguageSelectorList', () => ({
  LanguageSelectorList: () => null
}))

vi.mock('~ui/src/components/DatePicker', () => ({
  DatePickerUI: () => null
}))

vi.mock('~ui/src/hooks/useEnabledLanguages', () => ({
  useEnabledLanguages: () => ({ loading: false, languages: [], hasMultiple: false })
}))

vi.mock('~ui/src/styles/Switch', () => ({
  Switch: () => null
}))

describe('UserFormDetails', () => {
  it('renders save action in account edit mode', () => {
    const { getByText } = renderWithProviders(
      <UserFormDetailsUI
        view='account'
        isEdit
        formState={formStateFixture}
        validationFields={validationFieldsFixture}
        userData={userFixture}
        handleChangeInput={vi.fn()}
        handleButtonUpdateClick={vi.fn()}
        handleChangeNotifications={vi.fn()}
        notificationList={{}}
        showField={() => true}
        isRequiredField={() => false}
        toggleIsEdit={vi.fn()}
        cleanFormState={vi.fn()}
      />
    )
    expect(getByText('Save')).toBeInTheDocument()
  })
})
