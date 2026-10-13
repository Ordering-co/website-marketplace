import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { Promotions } from '../index'

vi.mock('../../../config', () => ({
  default: { franchiseSlug: 'franchise-a' }
}))
vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui/src/components/Promotions', () => ({
  Promotions: ({ franchiseId }) => (
    <div data-testid='promotions-ui' data-franchise-id={franchiseId || ''} />
  )
}))

const themeWithFranchise = {
  colors: {
    primary: '#000',
    backgroundPage: '#fff',
    colorPage: '#000',
    headingColor: '#000',
    lightGray: '#f5f5f5',
    borderColor: '#e9ecef',
    darkTextColor: '#000'
  },
  fonts: { primary: { name: 'Helvetica', weights: [400] } },
  images: {},
  third_party_code: {},
  my_products: {
    components: {
      website_theme: {
        components: {
          type: 'franchise',
          franchise_slug: 'theme-franchise'
        }
      }
    }
  }
}

describe('Promotions page', () => {
  it('renders promotions helmet tags and passes franchise id from theme', () => {
    const { getByTestId } = renderWithProviders(<Promotions />, {
      theme: themeWithFranchise
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'promotions')
    expect(getByTestId('promotions-ui')).toHaveAttribute('data-franchise-id', 'theme-franchise')
  })
})
