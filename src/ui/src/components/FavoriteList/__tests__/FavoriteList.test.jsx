import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { FavoriteList } from '../index'

vi.mock('~ui/utils', () => ({
  checkSiteUrl: (_url, fallback) => fallback,
  generalUtilities: () => ({ getOrderStatus: () => 'pending' }),
  getCateringValues: () => ({}),
  capitalize: (s) => s
}))
vi.mock('~ui/src/components/BusinessController', () => ({
  BusinessController: ({ business, isSkeleton }) => (
    <div data-testid={isSkeleton ? 'business-skeleton' : 'business-card'}>{business?.name}</div>
  )
}))
vi.mock('~ui/src/components/SingleProductCard', () => ({
  SingleProductCard: ({ product, isSkeleton, onProductClick }) => (
    <button
      type='button'
      data-testid={isSkeleton ? 'product-skeleton' : 'product-card'}
      onClick={onProductClick}
    >
      {product?.name || 'skeleton'}
    </button>
  )
}))
vi.mock('~ui/src/components/SingleOrderCard', () => ({
  SingleOrderCard: ({ order, isSkeleton }) => (
    <div data-testid={isSkeleton ? 'order-skeleton' : 'order-card'}>{order?.id}</div>
  )
}))
vi.mock('~ui/src/components/SingleProfessionalCard', () => ({
  SingleProfessionalCard: ({ professional, isSkeleton }) => (
    <div data-testid={isSkeleton ? 'pro-skeleton' : 'pro-card'}>{professional?.name}</div>
  )
}))
vi.mock('~ui/src/components/BusinessPreorder', () => ({
  BusinessPreorder: () => <div data-testid='preorder' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))
vi.mock('~ui/src/components/NotFoundSource', () => ({
  NotFoundSource: ({ content }) => <div data-testid='not-found'>{content}</div>
}))
vi.mock('~ui/src/styles/Buttons', () => ({
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>
}))

const favoriteList = vi.hoisted(() => ({
  current: {
    loading: false,
    error: null,
    favorites: [{ id: 1, name: 'Fav Store', slug: 'fav-store', reviews: { total: 4 } }]
  }
}))

const pagination = vi.hoisted(() => ({
  current: { currentPage: 1, totalPages: 1, totalItems: 1 }
}))

const getFavoriteList = vi.hoisted(() => vi.fn())

vi.mock('~components/components/FavoriteList', () => ({
  FavoriteList: ({ UIComponent, ...rest }) => (
    <UIComponent
      favoriteList={favoriteList.current}
      handleUpdateFavoriteList={vi.fn()}
      pagination={pagination.current}
      getFavoriteList={getFavoriteList}
      handleReorder={vi.fn()}
      reorderState={{ loading: false }}
      {...rest}
    />
  )
}))

describe('FavoriteList', () => {
  beforeEach(() => {
    getFavoriteList.mockClear()
    pagination.current = { currentPage: 1, totalPages: 1, totalItems: 1 }
    favoriteList.current = {
      loading: false,
      error: null,
      favorites: [{ id: 1, name: 'Fav Store', slug: 'fav-store', reviews: { total: 4 } }]
    }
  })

  it('renders favorite businesses', () => {
    const { getByTestId } = renderWithProviders(
      <FavoriteList isBusiness favoriteURL='favorite_businesses' originalURL='business' />
    )
    expect(getByTestId('business-card')).toHaveTextContent('Fav Store')
  })

  it('renders empty state for businesses', () => {
    favoriteList.current = { loading: false, error: null, favorites: [] }
    const { getByTestId } = renderWithProviders(
      <FavoriteList isBusiness favoriteURL='favorite_businesses' originalURL='business' />
    )
    expect(getByTestId('not-found')).toHaveTextContent(/favorite businesses/i)
  })

  it('renders product favorites and opens product modal', () => {
    favoriteList.current = {
      loading: false,
      error: null,
      favorites: [{ id: 9, name: 'Burger', images: 'b.jpg', businesses: [{ slug: 'cafe' }] }]
    }
    const { getByTestId } = renderWithProviders(
      <FavoriteList isProduct favoriteURL='favorite_products' originalURL='products' />
    )
    fireEvent.click(getByTestId('product-card'))
    expect(getByTestId('modal')).toBeInTheDocument()
  })

  it('renders order favorites', () => {
    favoriteList.current = {
      loading: false,
      error: null,
      favorites: [{ id: 3, status: 1, business: { slug: 'cafe' } }]
    }
    const { getByTestId } = renderWithProviders(
      <FavoriteList isOrder favoriteURL='favorite_orders' originalURL='orders' />
    )
    expect(getByTestId('order-card')).toHaveTextContent('3')
  })

  it('renders professional favorites and load more', () => {
    favoriteList.current = {
      loading: false,
      error: null,
      favorites: [{ id: 4, name: 'Alex' }]
    }
    pagination.current = { currentPage: 1, totalPages: 2, totalItems: 10 }
    const { getByTestId, getByText } = renderWithProviders(
      <FavoriteList isProfessional favoriteURL='favorite_users' originalURL='users' />
    )
    expect(getByTestId('pro-card')).toHaveTextContent('Alex')
    fireEvent.click(getByText('Load more items'))
    expect(getFavoriteList).toHaveBeenCalledWith(2)
  })

  it('renders loading skeletons for businesses', () => {
    favoriteList.current = { loading: true, error: null, favorites: [] }
    const { getAllByTestId } = renderWithProviders(
      <FavoriteList isBusiness favoriteURL='favorite_businesses' originalURL='business' />
    )
    expect(getAllByTestId('business-skeleton').length).toBeGreaterThan(0)
  })

  it('renders favorite list errors', () => {
    favoriteList.current = { loading: false, error: ['boom'], favorites: [] }
    const { getByText } = renderWithProviders(
      <FavoriteList isBusiness favoriteURL='favorite_businesses' originalURL='business' />
    )
    expect(getByText(/ERROR/)).toBeInTheDocument()
  })
})
