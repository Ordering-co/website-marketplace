import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../../__tests__/helpers/testUtils'
import { TrackingProductItem } from '../TrackingProductItem'

vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~components/contexts/UtilsContext', () => ({
  useUtils: () => [{ parsePrice: (value) => `$${Number(value).toFixed(2)}` }]
}))
vi.mock('~components/components/ProductItemAccordion', () => ({
  ProductItemAccordion: ({ UIComponent, product, ...props }) => (
    <UIComponent
      {...props}
      product={product}
      productInfo={{
        ingredients: product.ingredients || [],
        options: product.options || []
      }}
    />
  )
}))
vi.mock('~ui-icon', () => ({
  Icon: ({ name, className }) => <span data-testid={`icon-${name}`} className={className} />
}))

const product = { id: 1, name: 'burger deluxe', quantity: 2, price: 12, total: 10, images: '/burger.png', comment: 'no onion' }

describe('TrackingProductItem', () => {
  it('renders quantity, image, name, comment and the discounted inline price', () => {
    const { getByText, container, queryByTestId } = renderWithProviders(<TrackingProductItem product={product} />)
    expect(getByText('2')).toBeInTheDocument()
    expect(getByText('burger deluxe')).toBeInTheDocument()
    expect(getByText('no onion')).toBeInTheDocument()
    expect(getByText('$12.00').tagName).toBe('S')
    expect(getByText('$10.00')).toBeInTheDocument()
    expect(container.querySelector('[style*="burger.png"]')).toBeTruthy()
    expect(queryByTestId('icon-arrowDownIos')).toBeNull()
  })

  it('hides the price when hidePrice is set', () => {
    const { getByText, queryByText } = renderWithProviders(<TrackingProductItem product={product} hidePrice />)
    expect(getByText('burger deluxe')).toBeInTheDocument()
    expect(getByText('no onion')).toBeInTheDocument()
    expect(queryByText('$12.00')).toBeNull()
    expect(queryByText('$10.00')).toBeNull()
  })

  it('opens the accordion with unselected ingredients, options and removed toppings', () => {
    const withOptions = {
      ...product,
      ingredients: [{ id: 1, name: 'Tomato', selected: false }, { id: 2, name: 'Lettuce', selected: true }],
      options: [
        { id: 5, name: 'Size', suboptions: [{ id: 6, name: 'Large', quantity: 1, position: 'whole', price: 2, rank: 1 }] },
        { id: 7, name: 'Synthetic Sauce', quantity: 1, price: 0 }
      ]
    }
    const { getByText, getByTestId, container } = renderWithProviders(
      <TrackingProductItem product={withOptions} toppingsRemoved={{ removed: [{ code: 'x', name: 'Cheese' }] }} />
    )
    expect(getByTestId('icon-arrowDownIos')).toBeInTheDocument()
    fireEvent.click(container.querySelector('.product.accordion'))
    expect(container.querySelector('.product.accordion.active')).toBeTruthy()
    expect(getByText('No Tomato')).toBeInTheDocument()
    expect(getByText('Size')).toBeInTheDocument()
    expect(getByText('1 x Large +$2.00')).toBeInTheDocument()
    expect(getByText('Synthetic Sauce')).toBeInTheDocument()
    expect(getByText('Toppings removed')).toBeInTheDocument()
    expect(getByText('Cheese')).toBeInTheDocument()
  })
})
