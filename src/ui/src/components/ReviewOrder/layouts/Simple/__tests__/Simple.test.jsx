import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../../__tests__/helpers/testUtils'
import { pastOrder } from '../../../../__tests__/helpers/ordersTestMocks'
import { ReviewOrder } from '../index'

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (fn) => fn,
    register: () => null,
    errors: {},
    formState: { errors: {} }
  })
}))

vi.mock('~components/components/OrderReview', () => ({
  OrderReview: ({ UIComponent, ...rest }) => (
    <UIComponent
      order={pastOrder}
      stars={{ quality: 5 }}
      formState={{ loading: false, result: null }}
      handleSendReview={vi.fn()}
      closeReviewOrder={vi.fn()}
      setIsReviewed={vi.fn()}
      setStars={vi.fn()}
      {...rest}
    />
  )
}))

describe('ReviewOrder/layouts/Simple', () => {
  it('renders simple order review form', () => {
    const { getByText } = renderWithProviders(<ReviewOrder />)
    expect(getByText('How was your order?')).toBeInTheDocument()
    expect(getByText('Continue')).toBeInTheDocument()
  })
})
