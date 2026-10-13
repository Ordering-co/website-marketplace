import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { Cms } from '../index'

const cmsState = vi.hoisted(() => ({
  current: { loading: false, body: '<p>Hello CMS</p>', error: null }
}))

vi.mock('~components/components/CmsContent', () => ({
  CmsContent: ({ UIComponent, ...rest }) => (
    <UIComponent cmsState={cmsState.current} handleCmsRedirect={vi.fn()} {...rest} />
  )
}))

describe('Cms', () => {
  beforeEach(() => {
    cmsState.current = { loading: false, body: '<p>Hello CMS</p>', error: null }
  })

  it('renders cms body when loaded', () => {
    const { container } = renderWithProviders(<Cms />)
    expect(container.querySelector('#cms')).toBeTruthy()
    expect(container.innerHTML).toContain('Hello CMS')
  })

  it('renders loading skeletons', () => {
    cmsState.current = { loading: true, body: null, error: null }
    const { getAllByTestId } = renderWithProviders(<Cms />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })
})
