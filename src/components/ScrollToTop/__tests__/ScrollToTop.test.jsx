import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { ScrollToTop } from '../index'

const mockListen = vi.fn(() => vi.fn())
const mockHistory = {
  listen: mockListen,
  location: { pathname: '/', search: '' }
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    withRouter: (Component) => (props) => (
      <Component {...props} history={mockHistory} />
    )
  }
})

describe('ScrollToTop', () => {
  it('renders children with minHeight wrapper', () => {
    const { getByText } = renderWithProviders(
      <ScrollToTop><span>scroll-child</span></ScrollToTop>
    )
    expect(getByText('scroll-child')).toBeInTheDocument()
  })

  it('registers history listener on mount', () => {
    renderWithProviders(<ScrollToTop><span>x</span></ScrollToTop>)
    expect(mockListen).toHaveBeenCalled()
  })
})
