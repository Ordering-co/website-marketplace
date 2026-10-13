import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { defaultTheme, renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture } from '../../__tests__/helpers/menuTestMocks'
import { BusinessProductsListing } from '../index'

const freeDelivery = vi.hoisted(() => ({
  state: {
    status: 'progress',
    offer: { id: 34 },
    minimum: 25,
    currentAmount: 10,
    remainingAmount: 15,
    progressPercent: 40,
    diagnosticReason: null,
    refresh: vi.fn()
  },
  useFreeDeliveryProgress: vi.fn()
}))

const order = vi.hoisted(() => ({
  cart: {
    business: { slug: 'demo-store' },
    business_id: 1,
    products: [{ id: 10, name: 'Burger' }],
    subtotal: 10,
    total: 12,
    taxes: []
  }
}))

const viewport = vi.hoisted(() => ({ width: 375, height: 667 }))

vi.mock('~ui/hooks/useWindowSize', () => ({
  useWindowSize: () => viewport
}))

vi.mock('~components/hooks/useFreeDeliveryProgress', () => ({
  useFreeDeliveryProgress: freeDelivery.useFreeDeliveryProgress
}))

vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [{
    carts: { 1: order.cart },
    options: { type: 1 }
  }, {
    addProduct: vi.fn(),
    updateProduct: vi.fn()
  }]
}))

vi.mock('~ui/src/components/RenderProductsLayout', () => ({
  RenderProductsLayout: ({ freeDeliveryProgress }) => (
    <div data-testid='render-products-layout' data-progress-status={freeDeliveryProgress?.status} />
  )
}))
vi.mock('~ui/src/components/ProductForm', () => ({
  ProductForm: () => <div data-testid='product-form' />
}))
vi.mock('~ui/src/components/Cart', () => ({
  Cart: ({ freeDeliveryProgress }) => (
    <div data-testid='cart' data-progress-status={freeDeliveryProgress?.status} />
  )
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div data-testid='modal'>{children}</div> : null)
}))

vi.mock('~components/components/BusinessAndProductList', () => ({
  BusinessAndProductList: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessState={{ business: businessFixture, loading: false, error: null }}
      categoryState={{ products: [], loading: false }}
      categorySelected={{ id: 1, name: 'Menu' }}
      productModal={{ open: false }}
      updateProductModal={vi.fn()}
      onProductRedirect={vi.fn()}
      handleChangeSearch={vi.fn()}
      errors={[]}
      notFound={false}
      {...rest}
    />
  )
}))

describe('BusinessProductsListing', () => {
  beforeEach(() => {
    freeDelivery.useFreeDeliveryProgress.mockReset()
    freeDelivery.useFreeDeliveryProgress.mockReturnValue(freeDelivery.state)
  })

  it('renders products layout when business is loaded', () => {
    const { getByTestId } = renderWithProviders(<BusinessProductsListing />)
    expect(getByTestId('render-products-layout')).toBeInTheDocument()
  })

  it('calls the progress hook once with the selected business cart and franchise', () => {
    renderWithProviders(<BusinessProductsListing franchiseId='brand-one' />)

    expect(freeDelivery.useFreeDeliveryProgress).toHaveBeenLastCalledWith({
      business: businessFixture,
      cart: order.cart,
      franchiseId: 'brand-one',
      enabled: true
    })
    expect(screen.getByTestId('render-products-layout')).toHaveAttribute('data-progress-status', 'progress')
  })

  it('uses the configured franchise theme when no controller franchise prop exists', () => {
    const theme = {
      ...defaultTheme,
      my_products: {
        components: {
          website_theme: {
            components: {
              type: 'franchise',
              franchise_slug: 'theme-brand'
            }
          }
        }
      }
    }

    renderWithProviders(<BusinessProductsListing />, { theme })

    expect(freeDelivery.useFreeDeliveryProgress).toHaveBeenCalledWith(
      expect.objectContaining({ franchiseId: 'theme-brand' })
    )
  })

  it('renders compact progress above the mobile cart CTA and passes it into the modal cart', () => {
    renderWithProviders(<BusinessProductsListing />)

    const message = screen.getByText('Add $15 for free delivery')
    const viewCart = screen.getByRole('button', { name: 'View cart' })
    expect(message.compareDocumentPosition(viewCart) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    const callsBeforeOpeningCart = freeDelivery.useFreeDeliveryProgress.mock.calls.length
    fireEvent.click(viewCart)
    expect(screen.getByTestId('cart')).toHaveAttribute('data-progress-status', 'progress')
    expect(screen.queryByText('Add $15 for free delivery')).not.toBeInTheDocument()
    expect(freeDelivery.useFreeDeliveryProgress.mock.calls.length).toBeGreaterThan(callsBeforeOpeningCart)
    expect(freeDelivery.useFreeDeliveryProgress).toHaveBeenLastCalledWith(
      expect.objectContaining({ cart: order.cart })
    )
  })

  it('reserves the measured cart bar and mobile navigation height below products', () => {
    const measure = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ height: 116 })

    try {
      renderWithProviders(<BusinessProductsListing />)
      const products = screen.getByTestId('render-products-layout').parentElement
      expect(products).toHaveStyle({ paddingBottom: '197px' })
    } finally {
      measure.mockRestore()
    }
  })

  it('keeps the unconfirmed offer visible above the mobile cart CTA', () => {
    freeDelivery.useFreeDeliveryProgress.mockReturnValue({ status: 'unconfirmed', minimum: 25 })
    renderWithProviders(<BusinessProductsListing />)
    const message = screen.getByText('Free delivery has not been applied to this cart yet')
    const viewCart = screen.getByRole('button', { name: 'View cart' })
    expect(message.compareDocumentPosition(viewCart) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('keeps the existing desktop cart CTA operable and passes progress into its modal', () => {
    viewport.width = 1280
    viewport.height = 800
    renderWithProviders(<BusinessProductsListing />)

    const viewCart = screen.getByRole('button', { name: 'View cart' })
    expect(screen.getByText('Add $15 for free delivery')).toBeInTheDocument()

    fireEvent.click(viewCart)

    expect(screen.getByTestId('cart')).toHaveAttribute('data-progress-status', 'progress')
  })

  it('disables free-delivery lookup in kiosk mode', () => {
    renderWithProviders(<BusinessProductsListing useKioskApp />)

    expect(freeDelivery.useFreeDeliveryProgress).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    )
  })
})
