import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { pastOrder, paginationFixture } from '../../__tests__/helpers/ordersTestMocks'
import { HorizontalOrdersLayout } from '../index'

vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>
}))

vi.mock('~ui/src/components/SingleOrderCard', () => ({
  SingleOrderCard: ({ order }) => <div data-testid='order-card'>{order.business.name}</div>
}))

vi.mock('~ui/src/components/Pagination', () => ({
  Pagination: () => <div data-testid='pagination' />
}))

describe('HorizontalOrdersLayout', () => {
  it('renders order cards in horizontal container', () => {
    const { getByText, container } = renderWithProviders(
      <HorizontalOrdersLayout orders={[pastOrder]} pagination={paginationFixture} />
    )
    expect(container.querySelector('#orders-container')).toBeInTheDocument()
    expect(getByText('Pizza Place')).toBeInTheDocument()
  })
})
