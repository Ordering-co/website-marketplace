import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture } from '../../__tests__/helpers/menuTestMocks'
import { ReviewProduct } from '../index'

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: () => {},
    handleSubmit: (fn) => () => fn({}),
    formState: { errors: {} },
    errors: {}
  })
}))

vi.mock('~components/components/ReviewProduct', () => ({
  ReviewProduct: ({ UIComponent, ...rest }) => (
    <UIComponent
      order={{
        business: businessFixture,
        products: [[{ id: 1, name: 'Burger' }]],
        delivery_datetime: '2026-01-01'
      }}
      formState={{ changes: [] }}
      handleSendProductReview={vi.fn()}
      closeReviewProduct={vi.fn()}
      setIsProductReviewed={vi.fn()}
      {...rest}
    />
  )
}))

describe('ReviewProduct', () => {
  it('renders business name in review header', () => {
    const { getByText } = renderWithProviders(<ReviewProduct />)
    expect(getByText(/Demo Store/)).toBeInTheDocument()
  })
})
