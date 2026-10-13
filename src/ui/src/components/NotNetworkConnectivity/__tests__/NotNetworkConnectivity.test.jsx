import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { NotNetworkConnectivity } from '../index'

vi.mock('~ui/hooks/useOnlineStatus', () => ({
  useOnlineStatus: () => false
}))

describe('NotNetworkConnectivity', () => {
  it('renders offline message when not online', () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        blob: async () => new Blob(['img'], { type: 'image/png' })
      })
    )

    const { getByText } = renderWithProviders(
      <NotNetworkConnectivity image='https://example.com/offline.png' isOnline={false} />
    )
    expect(getByText('No internet connection')).toBeInTheDocument()
    expect(getByText(/Your connection appears to be off-line/i)).toBeInTheDocument()
  })
})
