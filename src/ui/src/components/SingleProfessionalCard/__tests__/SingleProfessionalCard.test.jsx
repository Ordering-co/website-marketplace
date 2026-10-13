import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { SingleProfessionalCard } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))
vi.mock('~ui/src/components/ProfessionalInfo', () => ({
  ProfessionalInfo: () => <div data-testid='pro-info' />
}))

vi.mock('~components/components/SingleProfessionalCard', () => ({
  SingleProfessionalCard: ({ UIComponent, ...rest }) => (
    <UIComponent
      professional={{
        id: 1,
        name: 'Sam',
        last_name: 'Lee',
        occupation: { name: 'Stylist' },
        favorite: false
      }}
      handleFavoriteProfessional={vi.fn()}
      {...rest}
    />
  )
}))

describe('SingleProfessionalCard', () => {
  it('renders professional name and occupation', () => {
    const { getByText } = renderWithProviders(<SingleProfessionalCard />)
    expect(getByText(/Sam/)).toBeInTheDocument()
    expect(getByText('Stylist')).toBeInTheDocument()
  })
})
