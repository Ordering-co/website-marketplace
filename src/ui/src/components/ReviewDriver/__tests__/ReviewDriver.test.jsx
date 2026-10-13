import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { pastOrder } from '../../__tests__/helpers/ordersTestMocks'
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
      closeReviewDriver={vi.fn()}
      setIsDriverReviewed={vi.fn()}
      setDriverReviews={vi.fn()}
      useSimpleRating={false}
      {...rest}
    />
  )
}))

describe('ReviewDriver', () => {
  it('renders driver review prompt', () => {
    const { getByText } = renderWithProviders(<ReviewDriver />)
    expect(getByText('Rate your order')).toBeInTheDocument()
  })
})
