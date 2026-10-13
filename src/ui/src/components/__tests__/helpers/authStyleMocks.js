import React from 'react'

const box = (props) => React.createElement('div', props, props.children)

export const buildLoginFormStylesMock = () => ({
  LoginContainer: box,
  FormSide: box,
  FormInput: box,
  RedirectLink: box,
  SocialButtons: box,
  LoginWith: box,
  SkeletonSocialWrapper: box,
  TogglePassword: box,
  OtpWrapper: box,
  CountdownTimer: box,
  ReCaptchaWrapper: box,
  InputBeforeIcon: box,
  InputWrapper: box,
  Title: box,
  ValidationText: box,
  LogotypeContainer: box,
  HeroSide: box,
  ResendCode: box
})

export const buildSignUpFormStylesMock = () => ({
  SignUpContainer: box,
  FormSide: box,
  FormInput: box,
  RedirectLink: box,
  SocialButtons: box,
  Title: box,
  SkeletonWrapper: box,
  SkeletonSocialWrapper: box,
  WrapperPassword: box,
  TogglePassword: box,
  ReCaptchaWrapper: box,
  LoginDivider: box,
  DividerLine: box,
  InputContainer: box,
  InputWrapper: box,
  InputBeforeIcon: box,
  TermsConditionWrapper: box,
  PromotionsWrapper: box,
  BussinessAndDriverSignUp: box,
  CheckboxArea: box,
  ValidationText: box
})

export const buildUserVerificationStylesMock = () => ({
  OtpWrapper: box,
  WrapperText: box,
  WarningText: box,
  CountdownTimer: box,
  Container: box,
  FormInput: box,
  InputWrapper: box,
  InputBeforeIcon: box,
  ButtonsWrapper: box
})
