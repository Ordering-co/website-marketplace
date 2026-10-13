import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { SavedCards } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui/src/components/SavedCards', () => ({
  SavedCards: () => <div data-testid='saved-cards-ui' />
}))

describe('SavedCards page', () => {
  it('renders cards helmet tags and saved cards controller', () => {
    const { getByTestId } = renderWithProviders(<SavedCards />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'cards')
    expect(getByTestId('saved-cards-ui')).toBeInTheDocument()
  })
})
