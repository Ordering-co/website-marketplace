import React from 'react'

export const createPrimitive = () => ({ children, ...props }) =>
  React.createElement('div', props, children)

export const createInputPrimitive = () => (props) =>
  React.createElement('input', props)

export const createFormInputPrimitive = () => ({ children, onSubmit, ...props }) =>
  React.createElement('form', { onSubmit, ...props }, children)

export const createButtonPrimitive = () => ({ children, onClick, type = 'button', ...props }) =>
  React.createElement('button', { type, onClick, ...props }, children)

export const createTogglePasswordPrimitive = () => ({ children, onClick, ...props }) =>
  React.createElement('span', { onClick, 'data-testid': 'toggle-password', ...props }, children)

export const createAuthUiPrimitives = () => {
  const Primitive = createPrimitive()
  const Input = createInputPrimitive()
  const FormInput = createFormInputPrimitive()
  const Button = createButtonPrimitive()
  const TogglePassword = createTogglePasswordPrimitive()
  return { Primitive, Input, FormInput, Button, TogglePassword }
}

export const createLoginFormStylesMock = (Primitive) => ({
  LoginContainer: Primitive,
  FormSide: Primitive,
  FormInput: Primitive,
  RedirectLink: Primitive,
  SocialButtons: Primitive,
  LoginWith: Primitive,
  SkeletonSocialWrapper: Primitive,
  TogglePassword: Primitive,
  OtpWrapper: Primitive,
  CountdownTimer: Primitive,
  ReCaptchaWrapper: Primitive,
  InputBeforeIcon: Primitive,
  InputWrapper: Primitive,
  Title: Primitive,
  ValidationText: Primitive,
  LogotypeContainer: Primitive,
  HeroSide: Primitive,
  ResendCode: Primitive
})

export const createSignUpFormStylesMock = (Primitive) => ({
  SignUpContainer: Primitive,
  FormSide: Primitive,
  FormInput: Primitive,
  RedirectLink: Primitive,
  SocialButtons: Primitive,
  Title: Primitive,
  SkeletonWrapper: Primitive,
  SkeletonSocialWrapper: Primitive,
  WrapperPassword: Primitive,
  TogglePassword: Primitive,
  ReCaptchaWrapper: Primitive,
  LoginDivider: Primitive,
  DividerLine: Primitive,
  InputContainer: Primitive,
  InputWrapper: Primitive,
  InputBeforeIcon: Primitive,
  TermsConditionWrapper: Primitive,
  PromotionsWrapper: Primitive,
  BussinessAndDriverSignUp: Primitive,
  CheckboxArea: Primitive,
  ValidationText: Primitive
})

export const createUserVerificationStylesMock = (Primitive) => ({
  OtpWrapper: Primitive,
  WrapperText: Primitive,
  WarningText: Primitive,
  CountdownTimer: Primitive,
  Container: Primitive,
  FormInput: Primitive,
  InputWrapper: Primitive,
  InputBeforeIcon: Primitive,
  ButtonsWrapper: Primitive
})

export const createStableUseFormMock = () => {
  const formMethods = {
    register: () => {},
    unregister: () => {},
    clearErrors: () => {},
    setValue: () => {},
    reset: () => {},
    watch: () => ({}),
    getValues: () => ({}),
    handleSubmit: (onValid) => (event) => {
      event?.preventDefault?.()
      return onValid({})
    },
    formState: { errors: {} },
    errors: {}
  }
  return { useForm: () => formMethods }
}
