import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { MultiCart } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))

vi.mock('~components/components/MultiCartCreate', () => ({
  MultiCartCreate: ({ UIComponent, ...rest }) => <UIComponent {...rest} />
}))

describe('MultiCart', () => {
  it('renders skeleton placeholder layout', () => {
    const { getAllByTestId } = renderWithProviders(<MultiCart />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })
})
