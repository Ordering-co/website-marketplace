import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { AddressList } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ user: { addresses: [{ id: 1 }] } }]
}))
vi.mock('~ui/src/components/AddressList', () => ({
  AddressList: (props) => (
    <div data-testid='address-list-ui' data-is-profile={String(props.isProfile)} />
  )
}))
vi.mock('~ui/src/components/UserProfileForm/ProfileOptions', () => ({
  ProfileOptions: ({ value }) => <div data-testid='profile-options' data-value={value} />
}))

const themeWithProfileOptions = {
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
  profile: {
    components: {
      address_list: {
        components: {
          layout: { position: 'new_page' }
        }
      }
    }
  }
}

describe('AddressList page', () => {
  it('renders addresses helmet tags, profile options, and address list', () => {
    const { getByTestId, getByText } = renderWithProviders(<AddressList />, {
      theme: themeWithProfileOptions
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'addresses')
    expect(getByTestId('profile-options')).toHaveAttribute('data-value', 'addresses')
    expect(getByText('Saved places')).toBeInTheDocument()
    expect(getByTestId('address-list-ui')).toHaveAttribute('data-is-profile', 'true')
  })
})
