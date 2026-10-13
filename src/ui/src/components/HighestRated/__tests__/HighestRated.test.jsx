import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { HighestRated } from '../index'

vi.mock('~ui/src/components/BusinessController', () => ({
  BusinessController: ({ business }) => <div data-testid='business-card'>{business?.name}</div>
}))
vi.mock('~ui/src/components/BusinessPreorder', () => ({
  BusinessPreorder: () => null
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: () => null
}))
vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>
}))

const businessesList = vi.hoisted(() => ({
  current: {
    loading: false,
    error: null,
    businesses: [{ id: 1, name: 'Top Rated Cafe', reviews: { total: 4.8 }, favorite: false }]
  }
}))

vi.mock('~components/components/BusinessList', () => ({
  BusinessList: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessesList={businessesList.current}
      handleBusinessClick={vi.fn()}
      favoriteIds={[]}
      setFavoriteIds={vi.fn()}
      {...rest}
    />
  )
}))

describe('HighestRated', () => {
  beforeEach(() => {
    businessesList.current = {
      loading: false,
      error: null,
      businesses: [{ id: 1, name: 'Top Rated Cafe', reviews: { total: 4.8 }, favorite: false }]
    }
  })

  it('renders highest rated businesses', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <HighestRated title='Highest rated' />
    )
    expect(getByText('Highest rated')).toBeInTheDocument()
    expect(getByTestId('business-card')).toHaveTextContent('Top Rated Cafe')
  })
})
