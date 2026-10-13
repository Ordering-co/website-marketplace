import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { Cms } from '../index'

const push = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page, helmetMetaTags }) => (
    <div
      data-testid='helmet-tags'
      data-page={page}
      data-title={helmetMetaTags?.title}
      data-description={helmetMetaTags?.description}
    />
  )
}))
vi.mock('~ui/src/components/Cms', () => ({
  Cms: ({ pageSlug, handleCmsRedirect, onChangeMetaTag }) => (
    <div data-testid='cms-ui' data-page-slug={pageSlug}>
      <button type='button' onClick={handleCmsRedirect}>back-to-pages</button>
      <button
        type='button'
        onClick={() => onChangeMetaTag('CMS title', 'CMS description')}
      >
        load-seo
      </button>
    </div>
  )
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useHistory: () => ({ push })
  }
})

describe('Cms page', () => {
  it('renders cms page with slug from route params', () => {
    const { getByTestId } = renderWithProviders(<Cms />, {
      initialEntries: ['/page/about-us'],
      routePath: '/page/:pageSlug'
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'pages')
    expect(getByTestId('cms-ui')).toHaveAttribute('data-page-slug', 'about-us')
  })

  it('applies CMS page metadata after loading', () => {
    const { getByTestId, getByText } = renderWithProviders(<Cms />, {
      initialEntries: ['/page/about-us'],
      routePath: '/page/:pageSlug'
    })

    fireEvent.click(getByText('load-seo'))

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-title', 'CMS title')
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-description', 'CMS description')
  })

  it('redirects to pages list from cms callback', () => {
    const { getByText } = renderWithProviders(<Cms />, {
      initialEntries: ['/page/about-us'],
      routePath: '/page/:pageSlug'
    })

    getByText('back-to-pages').click()
    expect(push).toHaveBeenCalledWith('/pages')
  })
})
