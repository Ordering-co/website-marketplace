import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { serviceProductFixture } from '../../__tests__/helpers/profileWalletTestMocks'
import { ServiceForm } from '../index'

vi.mock('~components/components/ProductForm', () => ({
  ProductForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      productObject={{ product: serviceProductFixture, loading: false, error: null }}
      professionalListState={{ loading: false, professionals: [{ id: 1, name: 'Alex', lastname: 'Pro', photo: 'p.jpg', schedule: {} }] }}
      professionalSelected={null}
      handleSave={vi.fn()}
      isSoldOut={false}
      maxProductQuantity={99}
      handleCreateGuestUser={vi.fn()}
      business={{ id: 1 }}
      productCart={null}
      actionStatus={{ loading: false }}
      {...rest}
    />
  )
}))

vi.mock('~ui/src/components/LoginForm', () => ({
  LoginForm: () => null
}))

vi.mock('~ui/src/components/SignUpForm', () => ({
  SignUpForm: () => null
}))

vi.mock('~ui/src/components/ForgotPasswordForm', () => ({
  ForgotPasswordForm: () => null
}))

describe('ServiceForm', () => {
  it('renders service name and schedule section', () => {
    const { getByText } = renderWithProviders(<ServiceForm businessSlug='demo-store' />)
    expect(getByText('Haircut')).toBeInTheDocument()
    expect(getByText('Schedule')).toBeInTheDocument()
  })
})
