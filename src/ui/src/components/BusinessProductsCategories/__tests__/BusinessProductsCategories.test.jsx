import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture } from '../../__tests__/helpers/menuTestMocks'
import { BusinessProductsCategories } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div data-testid='auto-scroll'>{children}</div>
}))

vi.mock('~components/components/BusinessProductsCategories', () => ({
  BusinessProductsCategories: ({ UIComponent, ...rest }) => (
    <UIComponent
      categories={[{ id: 1, name: 'Drinks' }, { id: 2, name: 'Food' }]}
      categorySelected={{ id: 1, name: 'Drinks' }}
      handlerClickCategory={vi.fn()}
      business={businessFixture}
      isSkeleton={false}
      {...rest}
    />
  )
}))

describe('BusinessProductsCategories', () => {
  beforeEach(() => {
    const style = document.createElement('style')
    style.id = 'styles'
    Object.defineProperty(style, 'sheet', {
      value: {
        cssRules: [],
        insertRule: vi.fn(),
        deleteRule: vi.fn()
      }
    })
    document.head.appendChild(style)
  })

  afterEach(() => {
    document.getElementById('styles')?.remove()
  })

  it('renders category tabs', () => {
    const { getByText } = renderWithProviders(<BusinessProductsCategories />)
    expect(getByText('Drinks')).toBeInTheDocument()
    expect(getByText('Food')).toBeInTheDocument()
  })
})
