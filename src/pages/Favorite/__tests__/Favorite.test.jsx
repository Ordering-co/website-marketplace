import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { Favorite } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui/src/components/Favorite', () => ({
  Favorite: () => <div data-testid='favorite-ui' />
}))

describe('Favorite page', () => {
  it('renders favorite helmet tags and controller', () => {
    const { getByTestId } = renderWithProviders(<Favorite />)

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'favorite')
    expect(getByTestId('favorite-ui')).toBeInTheDocument()
  })
})
