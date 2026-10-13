import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders, defaultTheme } from '../../../../../__tests__/helpers/testUtils'
import { BusinessTypes } from '../index'

const buttonTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    lightGreen: '#d4edda',
    darkGreen: '#155724',
    gray200: '#e9ecef',
    grayDividerColor: '#cccccc',
    black: '#000000',
    lightGray: '#f5f5f5',
    darkGray: '#333333'
  }
}

const typesState = vi.hoisted(() => ({
  current: {
    loading: false,
    error: null,
    types: [
      { id: null, name: 'All', enabled: true },
      { id: 2, name: 'Groceries', enabled: true }
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

describe('BusinessTypes', () => {
  beforeEach(() => {
    typesState.current = {
      loading: false,
      error: null,
      types: [
        { id: null, name: 'All', enabled: true },
        { id: 2, name: 'Groceries', enabled: true }
      ]
    }
  })

  it('renders pill categories when types have no images', () => {
    const { getByText } = renderWithProviders(<BusinessTypes />, { theme: buttonTheme })
    expect(getByText('All')).toBeInTheDocument()
    expect(getByText('Groceries')).toBeInTheDocument()
  })

  it('renders skeletons while loading', () => {
    typesState.current = { loading: true, error: null, types: [] }
    const { getAllByTestId } = renderWithProviders(<BusinessTypes />, { theme: buttonTheme })
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })
})
