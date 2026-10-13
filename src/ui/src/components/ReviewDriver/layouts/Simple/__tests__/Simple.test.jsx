import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../../__tests__/helpers/testUtils'
import { pastOrder } from '../../../../__tests__/helpers/ordersTestMocks'
import { ReviewDriver } from '../index'

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (fn) => fn,
    register: () => null,
    errors: {},
    formState: { errors: {} }
  })
}))

vi.mock('~components/components/ReviewDriver', () => ({
  ReviewDriver: ({ UIComponent, ...rest }) => (
    <UIComponent
      order={pastOrder}
      dirverReviews={{ quality: 5 }}
      formState={{ loading: false, result: null }}
      handleSendDriverReview={vi.fn()}
      setIsReviewed={vi.fn()}
      setDriverReviews={vi.fn()}
      {...rest}
    />
  )
}))

describe('ReviewDriver/layouts/Simple', () => {
  it('renders simple driver review form', () => {
    const { getByText } = renderWithProviders(<ReviewDriver />)
    expect(getByText('How was your driver?')).toBeInTheDocument()
    expect(getByText('Send review')).toBeInTheDocument()
  })
})
