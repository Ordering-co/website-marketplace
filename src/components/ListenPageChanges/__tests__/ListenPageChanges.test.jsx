import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { ListenPageChanges } from '../index'

const emit = vi.fn()
const on = vi.fn()
const off = vi.fn()
const push = vi.fn()
const merge = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useHistory: () => ({
      listen: vi.fn(() => vi.fn()),
      location: { pathname: '/home', search: '' },
      push,
      replace: vi.fn()
    }),
    useLocation: () => ({ pathname: '/home', search: '' })
  }
})
vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit, on, off }]
}))
vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{ language: { rtl: true } }]
}))
vi.mock('~ui/contexts/ThemeContext', () => ({
  useTheme: () => [{ rtl: false }, { merge }]
}))
vi.mock('~components/contexts/SiteContext', () => ({
  useSite: () => [{ site: { business_url_template: '/store/:business_slug', product_url_template: '/store/:business_slug' } }]
}))
vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [{ options: { address: { location: { lat: 1, lng: 2 } } } }]
}))
vi.mock('~ui/utils', () => ({
  checkSiteUrl: (template) => template
}))

describe('ListenPageChanges', () => {
  it('renders children and wires event listeners', () => {
    const { getByText } = renderWithProviders(
      <ListenPageChanges><span>page-child</span></ListenPageChanges>
    )
    expect(getByText('page-child')).toBeInTheDocument()
    expect(on).toHaveBeenCalledWith('go_to_page', expect.any(Function))
    expect(on).toHaveBeenCalledWith('get_current_view', expect.any(Function))
    expect(merge).toHaveBeenCalledWith({ rtl: true })
  })

  it('navigates on go_to_page for business_search', () => {
    renderWithProviders(<ListenPageChanges><span>x</span></ListenPageChanges>)
    const handler = on.mock.calls.find(([event]) => event === 'go_to_page')?.[1]
    handler({ page: 'business_search', search: '?q=pizza' })
    expect(push).toHaveBeenCalled()
  })
})
