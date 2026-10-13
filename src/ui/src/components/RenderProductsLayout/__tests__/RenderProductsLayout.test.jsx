import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { defaultTheme, renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture } from '../../__tests__/helpers/menuTestMocks'
import { RenderProductsLayout } from '../index'

const viewport = vi.hoisted(() => ({ width: 1024, height: 768 }))
const config = vi.hoisted(() => ({ configs: {} }))

vi.mock('~ui/hooks/useWindowSize', () => ({
  useWindowSize: () => viewport
}))

vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{ configs: config.configs }]
}))

vi.mock('~ui/src/components/BusinessBasicInformation', () => ({
  BusinessBasicInformation: () => <div data-testid='basic-info' />
}))
vi.mock('~ui/src/components/BusinessProductsCategories', () => ({
  BusinessProductsCategories: () => <div data-testid='categories' />
}))
vi.mock('~ui/src/styles/Buttons', () => ({
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>
}))
vi.mock('~ui/src/components/PageBanner', () => ({
  PageBanner: () => null
}))
vi.mock('~ui/src/components/BusinessProductsList', () => ({
  BusinessProductsList: () => <div data-testid='products-list' />
}))
vi.mock('~ui/src/components/BusinessProductsCategories/layouts/groceries', () => ({
  BusinessProductsCategories: () => <div data-testid='groceries-categories' />
}))
vi.mock('~ui/src/components/BusinessProductsList/layouts/groceries', () => ({
  BusinessProductsList: () => <div data-testid='groceries-products-list' />
}))
vi.mock('~ui/src/components/Cart', () => ({
  Cart: ({ freeDeliveryProgress }) => (
    <div data-testid='cart' data-progress-status={freeDeliveryProgress?.status} />
  )
}))
vi.mock('~ui/src/components/FreeDeliveryProgress', () => ({
  FreeDeliveryProgress: ({ status, variant }) => status === 'hidden'
    ? null
    : <div data-testid='free-delivery-progress' data-status={status} data-variant={variant} />
}))
vi.mock('~ui/src/components/CategoriesPopover', () => ({
  CategoriesPopover: ({ CategoriesPopoverUI }) => <CategoriesPopoverUI />
}))
vi.mock('~ui/src/components/SearchProducts', () => ({
  SearchProducts: () => <div data-testid='search-products' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null)
}))
vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>
}))

describe('RenderProductsLayout', () => {
  const baseProps = {
    business: businessFixture,
    businessState: { business: businessFixture, loading: false },
    categoryState: { products: [], loading: false },
    categorySelected: { id: 1, name: 'Menu' },
    categories: [{ id: 1, name: 'Menu' }],
    isLoading: false,
    isError: false,
    currentCart: {},
    onClickCategory: vi.fn(),
    onProductClick: vi.fn(),
    handler: {},
    featuredProducts: []
  }

  beforeEach(() => {
    viewport.width = 1024
    viewport.height = 768
    config.configs = {}
  })

  it('renders basic info and products list when loaded', () => {
    const { getByTestId } = renderWithProviders(
      <RenderProductsLayout {...baseProps} />
    )
    expect(getByTestId('basic-info')).toBeInTheDocument()
    expect(getByTestId('products-list')).toBeInTheDocument()
  })

  it('renders desktop awareness after business information when the inline cart is disabled', () => {
    renderWithProviders(
      <RenderProductsLayout
        {...baseProps}
        freeDeliveryProgress={{ status: 'awareness', minimum: 25 }}
      />
    )

    const info = screen.getByTestId('basic-info')
    const awareness = screen.getByTestId('free-delivery-progress')
    expect(info.nextElementSibling).toBe(awareness)
    expect(awareness).toHaveAttribute('data-status', 'awareness')
    expect(awareness).toHaveAttribute('data-variant', 'full')
  })

  it('renders mobile awareness immediately after business information', () => {
    viewport.width = 375
    renderWithProviders(
      <RenderProductsLayout
        {...baseProps}
        freeDeliveryProgress={{ status: 'awareness', minimum: 25 }}
      />
    )

    const info = screen.getByTestId('basic-info')
    const awareness = screen.getByTestId('free-delivery-progress')
    expect(info.nextElementSibling).toBe(awareness)
  })

  it('covers the tablet empty-cart gap with the same single awareness strip', () => {
    viewport.width = 768
    renderWithProviders(
      <RenderProductsLayout
        {...baseProps}
        freeDeliveryProgress={{ status: 'awareness', minimum: 25 }}
      />
    )

    expect(screen.getAllByTestId('free-delivery-progress')).toHaveLength(1)
    expect(screen.getByTestId('basic-info').nextElementSibling).toBe(screen.getByTestId('free-delivery-progress'))
  })

  it('renders one awareness strip in the groceries layout', () => {
    config.configs = { use_parent_category: { value: '1' } }
    const groceriesBusiness = {
      ...businessFixture,
      front_layout: 'groceries',
      categories: [{ id: 1, name: 'Menu' }]
    }

    renderWithProviders(
      <RenderProductsLayout
        {...baseProps}
        business={groceriesBusiness}
        businessState={{ business: groceriesBusiness, loading: false }}
        freeDeliveryProgress={{ status: 'awareness', minimum: 25 }}
      />
    )

    expect(screen.getByTestId('groceries-products-list')).toBeInTheDocument()
    expect(screen.getAllByTestId('free-delivery-progress')).toHaveLength(1)
  })

  it('preserves the default desktop layout without enabling the dormant inline cart', () => {
    renderWithProviders(
      <RenderProductsLayout
        {...baseProps}
        currentCart={{ products: [{ id: 10 }] }}
        freeDeliveryProgress={{ status: 'progress', minimum: 25, remainingAmount: 15 }}
      />
    )

    expect(screen.queryByTestId('cart')).not.toBeInTheDocument()
    expect(screen.queryByTestId('free-delivery-progress')).not.toBeInTheDocument()
    expect(screen.getByTestId('products-list')).toBeInTheDocument()
  })

  it('preserves an explicitly hidden desktop cart without duplicating awareness', () => {
    const theme = {
      ...defaultTheme,
      business_view: {
        ...defaultTheme.business_view,
        components: {
          ...defaultTheme.business_view?.components,
          cart: { components: { hidden: true } }
        }
      }
    }

    renderWithProviders(
      <RenderProductsLayout
        {...baseProps}
        currentCart={{ products: [{ id: 10 }] }}
        freeDeliveryProgress={{ status: 'progress', minimum: 25, remainingAmount: 15 }}
      />,
      { theme }
    )

    expect(screen.queryByTestId('cart')).not.toBeInTheDocument()
    expect(screen.queryByTestId('free-delivery-progress')).not.toBeInTheDocument()
  })

  it.each([
    ['Pickup', { status: 'hidden', diagnosticReason: 'not-delivery' }],
    ['request error', { status: 'hidden', diagnosticReason: 'request-error' }]
  ])('keeps the module hidden for %s while the product list remains available', (_name, progress) => {
    viewport.width = 375
    renderWithProviders(
      <RenderProductsLayout {...baseProps} freeDeliveryProgress={progress} />
    )

    expect(screen.queryByTestId('free-delivery-progress')).not.toBeInTheDocument()
    expect(screen.getByTestId('products-list')).toBeInTheDocument()
  })
})
