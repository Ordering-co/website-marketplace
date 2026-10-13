import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { Favorite } from '../index'

vi.mock('~ui/src/components/FavoriteList', () => ({
  FavoriteList: () => <div data-testid='favorite-list' />
}))

describe('Favorite', () => {
  it('renders favorites title and tabs', () => {
    const { getByText, getByTestId } = renderWithProviders(<Favorite />)
    expect(getByText('My Favorites')).toBeInTheDocument()
    expect(getByText('Businesses')).toBeInTheDocument()
    expect(getByTestId('favorite-list')).toBeInTheDocument()
  })

  it('renders professionals tab when layout is appointments', () => {
    const theme = {
      colors: { primary: '#000', white: '#fff', backgroundPage: '#fff', primaryContrast: '#eee' },
      fonts: { primary: { name: 'Helvetica', weights: [400] } },
      favorite: { components: { layout: { type: 'appointments' } } }
    }
    const { getByText, getByTestId } = renderWithProviders(<Favorite />, { theme })
    fireEvent.click(getByText('Professionals'))
    expect(getByTestId('favorite-list')).toBeInTheDocument()
    fireEvent.click(getByText('Products'))
    fireEvent.click(getByText('Orders'))
    expect(getByText('My Favorites')).toBeInTheDocument()
  })
})
