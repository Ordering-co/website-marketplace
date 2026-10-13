import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PagesList } from '../index'

describe('PagesList', () => {
  it('renders site map title and route links', () => {
    const { getByText } = renderWithProviders(
      <PagesList routes={[{ name: 'Home', slug: '/' }]} />
    )
    expect(getByText('Site Map')).toBeInTheDocument()
    expect(getByText('Home')).toBeInTheDocument()
  })
})
