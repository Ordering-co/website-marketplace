import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PageNotFound } from '../index'

describe('PageNotFound UI', () => {
  it('renders page not found heading', () => {
    const { getByText } = renderWithProviders(<PageNotFound />)
    expect(getByText('PAGE NOT FOUND')).toBeInTheDocument()
  })
})
