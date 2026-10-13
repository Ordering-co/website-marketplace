import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { PagesList } from '../index'

vi.mock('~ui/src/components/PagesList', () => ({
  PagesList: ({ routes }) => (
    <div data-testid='pages-list-ui' data-route-count={routes.length} />
  )
}))

describe('PagesList page', () => {
  it('passes default routes to pages list controller', () => {
    const { getByTestId } = renderWithProviders(<PagesList />)
    expect(getByTestId('pages-list-ui')).toHaveAttribute('data-route-count', '10')
  })
})
