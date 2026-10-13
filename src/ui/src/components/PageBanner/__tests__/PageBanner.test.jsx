import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PageBanner } from '../index'

vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
  SwiperSlide: ({ children, onClick }) => (
    <div data-testid='swiper-slide' onClick={onClick} role='button'>
      {children}
    </div>
  )
}))
vi.mock('swiper/modules', () => ({ Navigation: {}, Thumbs: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))

const bannerState = vi.hoisted(() => ({
  current: {
    loading: false,
    banner: {
      items: [{ url: 'https://example.com/banner.jpg', action: { type: 'business', url: 'store/demo' } }]
    }
  }
}))

const emit = vi.hoisted(() => vi.fn())

vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit, on: vi.fn(), off: vi.fn() }]
}))

vi.mock('~components/components/PageBanner', () => ({
  PageBanner: ({ UIComponent, ...rest }) => (
    <UIComponent
      pageBannerState={bannerState.current}
      title='Home banner'
      {...rest}
    />
  )
}))

describe('PageBanner', () => {
  beforeEach(() => {
    emit.mockClear()
    bannerState.current = {
      loading: false,
      banner: {
        items: [{ url: 'https://example.com/banner.jpg', action: { type: 'business', url: 'store/demo' } }]
      }
    }
  })

  it('renders banner slides when data is loaded', () => {
    const { getByTestId, getByText } = renderWithProviders(<PageBanner />)
    expect(getByText('Home banner')).toBeInTheDocument()
    expect(getByTestId('swiper')).toBeInTheDocument()
    expect(getByTestId('swiper-slide')).toBeInTheDocument()
  })

  it('emits navigation when a business banner is clicked', () => {
    const { getByTestId } = renderWithProviders(<PageBanner />)
    fireEvent.click(getByTestId('swiper-slide'))
    expect(emit).toHaveBeenCalled()
  })

  it('renders loading skeletons', () => {
    bannerState.current = { loading: true, banner: null }
    const { getAllByTestId } = renderWithProviders(<PageBanner />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('renders horizontal banners without swiper', () => {
    const { queryByTestId, container } = renderWithProviders(<PageBanner isHorizontal />)
    expect(queryByTestId('swiper')).not.toBeInTheDocument()
    expect(container.querySelector('.banner-img')).toBeTruthy()
  })
})
