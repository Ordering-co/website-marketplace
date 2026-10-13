import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { Help } from '../index'

vi.mock('../../../config', () => ({
  default: { franchiseSlug: 'franchise-help' }
}))
vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui/src/components/Help', () => ({
  Help: ({ franchiseId }) => <div data-testid='help-ui' data-franchise-id={franchiseId || ''} />
}))

describe('Help page', () => {
  it('renders help helmet tags and passes franchise id from config', () => {
    const { getByTestId } = renderWithProviders(<Help />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'help')
    expect(getByTestId('help-ui')).toHaveAttribute('data-franchise-id', 'franchise-help')
  })
})
