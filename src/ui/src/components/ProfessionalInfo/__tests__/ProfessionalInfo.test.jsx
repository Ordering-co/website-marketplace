import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { ProfessionalInfo } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))

const infoState = vi.hoisted(() => ({
  userState: {
    loading: false,
    user: { name: 'Jordan', occupation: { name: 'Therapist', description: 'Expert care' } }
  },
  userReviewState: { loading: false, reviews: [], error: null }
}))

vi.mock('~components/components/ProfessionalInfo', () => ({
  ProfessionalInfo: ({ UIComponent, ...rest }) => (
    <UIComponent
      userState={infoState.userState}
      userReviewState={infoState.userReviewState}
      {...rest}
    />
  )
}))

describe('ProfessionalInfo', () => {
  beforeEach(() => {
    infoState.userState = {
      loading: false,
      user: { name: 'Jordan', occupation: { name: 'Therapist', description: 'Expert care' } }
    }
    infoState.userReviewState = { loading: false, reviews: [], error: null }
  })

  it('renders professional details', () => {
    const { getByText } = renderWithProviders(<ProfessionalInfo />)
    expect(getByText('Jordan')).toBeInTheDocument()
    expect(getByText('Therapist')).toBeInTheDocument()
    expect(getByText('Expert care')).toBeInTheDocument()
  })
})
