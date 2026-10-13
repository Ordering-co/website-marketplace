import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { MessagesList } from '../index'

const emit = vi.fn()

vi.mock('../../../config', () => ({
  default: { businessSlug: null, franchiseSlug: null }
}))
vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~ui/src/components/MessagesListing', () => ({
  MessagesListing: (props) => (
    <div data-testid='messages-listing-ui'>
      <button type='button' onClick={() => props.onRedirectPage({ page: 'messages' })}>messages</button>
    </div>
  )
}))

describe('MessagesList page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders messages helmet tags and listing', () => {
    const { getByTestId } = renderWithProviders(<MessagesList />)
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'messages')
    expect(getByTestId('messages-listing-ui')).toBeInTheDocument()
  })

  it('emits navigation from messages callback', () => {
    const { getByText } = renderWithProviders(<MessagesList />)
    getByText('messages').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'messages' })
  })
})
