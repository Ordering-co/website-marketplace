import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { BusinessTypeFilter } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('~ui/src/styles/Buttons', () => ({
  Button: ({ children, onClick, color }) => (
    <button type='button' data-color={color} onClick={onClick}>{children}</button>
  )
}))

const typesState = vi.hoisted(() => ({
  current: {
    loading: false,
    error: null,
    types: [
      { id: null, name: 'All', enabled: true },
      { id: 1, name: 'Food', enabled: true }
    ]
  }
}))

vi.mock('~components/components/BusinessTypeFilter', () => ({
  BusinessTypeFilter: ({ UIComponent, ...rest }) => (
    <UIComponent
      typesState={typesState.current}
      currentTypeSelected={null}
      handleChangeBusinessType={vi.fn()}
      {...rest}
    />
  )
}))

describe('BusinessTypeFilter', () => {
  beforeEach(() => {
    typesState.current = {
      loading: false,
      error: null,
      types: [
        { id: null, name: 'All', enabled: true },
        { id: 1, name: 'Food', enabled: true }
      ]
    }
  })

  it('renders business type tabs', () => {
    const { getByText } = renderWithProviders(<BusinessTypeFilter />)
    expect(getByText('All')).toBeInTheDocument()
    expect(getByText('Food')).toBeInTheDocument()
  })

  it('renders search mode buttons', () => {
    const { getByText } = renderWithProviders(
      <BusinessTypeFilter
        isSearchMode
        filters={{ business_types: [] }}
        handleChangeFilters={vi.fn()}
      />
    )
    expect(getByText(/All/)).toBeInTheDocument()
    expect(getByText(/Food/)).toBeInTheDocument()
  })
})
