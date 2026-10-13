import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { PageNotFound } from '../index'

vi.mock('~ui/src/components/PageNotFound', () => ({
  PageNotFound: () => <div data-testid='page-not-found-ui' />
}))

describe('PageNotFound page', () => {
  it('renders page not found controller', () => {
    const { getByTestId } = renderWithProviders(<PageNotFound />)
    expect(getByTestId('page-not-found-ui')).toBeInTheDocument()
  })
})
