import { vi } from 'vitest'

export const t = (_key, fallback) => fallback

export const baseLoginUIProps = {
  useLoginByEmail: true,
  useLoginByCellphone: false,
  useLoginOtpCellphone: false,
  useLoginOtpWhatsapp: false,
  handleChangeInput: vi.fn(),
  handleReCaptcha: vi.fn(),
  handleChangeTab: vi.fn(),
  handleButtonLoginClick: vi.fn(),
  handleSendVerifyCode: vi.fn(),
  handleCheckPhoneCode: vi.fn(),
  formState: { loading: false, result: null },
  verifyPhoneState: { loading: false },
  checkPhoneCodeState: { loading: false },
  loginTab: 'email',
  credentials: {},
  enableReCaptcha: false,
  useRootPoint: false,
  isCustomerMode: true,
  otpType: 'email',
  setOtpType: vi.fn(),
  generateOtpCode: vi.fn(),
  otpState: '',
  setOtpState: vi.fn(),
  useLoginOtpEmail: false,
  handleLoginSpoonity: vi.fn(),
  useLoginSpoonity: false,
  onAuthLoadingChange: vi.fn()
}

export const baseForgotPasswordUIProps = {
  hanldeChangeInput: vi.fn(),
  handleButtonForgotPasswordClick: vi.fn(),
  formState: { loading: false, result: { result: null, error: null } },
  handleReCaptcha: vi.fn(),
  enableReCaptcha: false,
  isRecaptchaEnable: false
}

export const baseResetPasswordUIProps = {
  code: 'code-1',
  random: 'random-1',
  formState: { loading: false, result: { result: null, error: null } },
  resetPasswordData: { code: 'code-1', random: 'random-1' },
  handleResetPassword: vi.fn(),
  handleChangeInput: vi.fn(),
  redirectResetPassword: vi.fn()
}

export const baseSignupUIProps = {
  handleChangeInput: vi.fn(),
  handleButtonSignupClick: vi.fn(),
  handleReCaptcha: vi.fn(),
  handleChangePromotions: vi.fn(),
  closeModal: vi.fn(),
  useChekoutFileds: false,
  validationFields: {
    fields: {
      checkout: {
        email: { id: 1, code: 'email', enabled: true, required: true },
        cellphone: { id: 2, code: 'cellphone', enabled: false, required: false },
        password: { id: 3, code: 'password', enabled: true, required: true }
      }
    }
  },
  showField: () => true,
  isRequiredField: () => false,
  formState: { loading: false, result: { result: null, error: null } },
  handleSuccessSignup: vi.fn(),
  enableReCaptcha: false,
  signupData: {},
  fieldsNotValid: [],
  saveCustomerUser: false,
  signUpTab: 'default',
  setSignUpTab: vi.fn(),
  useSignUpFullDetails: true,
  useSignUpOtpEmail: false,
  useSignUpOtpCellphone: false,
  useSignUpOtpWhatsapp: false,
  willVerifyOtpState: false,
  setWillVerifyOtpState: vi.fn(),
  otpState: '',
  setOtpState: vi.fn(),
  checkPhoneCodeState: { loading: false },
  generateOtpCode: vi.fn(),
  numOtpInputs: 6
}

export const baseSessionsUIProps = {
  sessionsList: { loading: false, sessions: [] },
  actionState: { loading: false, error: null },
  handleDeleteSession: vi.fn(),
  handleDeleteAllSessions: vi.fn()
}

export const baseUserVerificationUIProps = {
  verifyEmailState: { loading: false, loadingSendCode: true, loadingCheckCode: false },
  verifyPhoneState: { loading: false, loadingSendCode: true, loadingCheckCode: false },
  sendVerifyEmailCode: vi.fn(),
  sendVerifyPhoneCode: vi.fn(),
  checkVerifyEmailCode: vi.fn(),
  checkVerifyPhoneCode: vi.fn(),
  cleanErrorsState: vi.fn(),
  useWhatsappVerification: false
}

export const mockApiPagesGet = (body = '<p>Content</p>') => vi.fn(() =>
  Promise.resolve({
    content: {
      error: null,
      result: { body, enabled: true }
    }
  })
)
