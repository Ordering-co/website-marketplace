import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { pastOrder, professionalFixture } from '../../__tests__/helpers/ordersTestMocks'
import { ReviewProfessional } from '../index'

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
      order={{ ...pastOrder, professional: professionalFixture }}
      dirverReviews={{ quality: 5 }}
      formState={{ loading: false, result: null }}
      handleSendDriverReview={vi.fn()}
      closeReviewProfessional={vi.fn()}
      setIsProfessionalReviewed={vi.fn()}
      setDriverReviews={vi.fn()}
      {...rest}
    />
  )
}))

describe('ReviewProfessional', () => {
  it('renders professional service review prompt', () => {
    const { getByText } = renderWithProviders(<ReviewProfessional />)
    expect(getByText('How was your service?')).toBeInTheDocument()
    expect(getByText('Send review')).toBeInTheDocument()
  })
})
