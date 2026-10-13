import React from 'react'
import { Primitive } from './stylePrimitive'

export const SignUpContainer = Primitive
export const FormSide = Primitive
export const FormInput = ({ children, onSubmit, ...props }) => (
  <form onSubmit={onSubmit} {...props}>{children}</form>
)
export const RedirectLink = Primitive
export const SocialButtons = Primitive
export const Title = Primitive
export const SkeletonWrapper = Primitive
export const SkeletonSocialWrapper = Primitive
export const WrapperPassword = Primitive
export const TogglePassword = ({ children, onClick, ...props }) => (
  <span onClick={onClick} data-testid='toggle-password' {...props}>{children}</span>
)
export const ReCaptchaWrapper = Primitive
export const LoginDivider = Primitive
export const DividerLine = Primitive
export const InputContainer = Primitive
export const InputWrapper = Primitive
export const InputBeforeIcon = Primitive
export const TermsConditionWrapper = Primitive
export const PromotionsWrapper = Primitive
export const BussinessAndDriverSignUp = Primitive
export const CheckboxArea = Primitive
export const ValidationText = Primitive
