import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { UpsellingPage } from '../index'

const upsellingProduct = vi.hoisted(() => ({
  id: 10,
  name: 'Burger',
  price: 9.5,
  images: 'burger.jpg'
}))

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/components/ProductForm', () => ({
  ProductForm: () => <div data-testid='product-form' />
}))
vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null)
}))

const controllerSpy = vi.hoisted(() => vi.fn())

vi.mock('~components/components/UpsellingPage', () => ({
  UpsellingPage: ({ UIComponent, ...rest }) => {
    controllerSpy(rest)
    return (
      <UIComponent
        upsellingProducts={{ products: [upsellingProduct], loading: false, error: null }}
        handleUpsellingPage={vi.fn()}
        openUpselling
        canOpenUpselling
        business={{ id: 1, slug: 'demo-store' }}
        {...rest}
      />
    )
  }
}))

describe('UpsellingPage', () => {
  it('renders upselling product name', () => {
    const { getByText } = renderWithProviders(<UpsellingPage />)
    expect(getByText('Burger')).toBeInTheDocument()
  })

  it('loads upselling from the cart upselling endpoint', () => {
    renderWithProviders(<UpsellingPage businessId={5} />)
    expect(controllerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ businessId: 5, useSuggestiveUpselling: true })
    )
  })
})
