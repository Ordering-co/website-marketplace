import { describe, expect, it, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { HelpStaticPage } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))

const getPage = vi.hoisted(() => vi.fn())

vi.mock('~components/contexts/ApiContext', () => ({
  useApi: () => [{
    pages: () => ({ get: getPage })
  }]
}))

describe('HelpStaticPage', () => {
  beforeEach(() => {
    getPage.mockReset()
    getPage.mockResolvedValue({
      content: { error: false, result: { body: '<p>Help body</p>' } }
    })
  })

  it('fetches and renders page body from api', async () => {
    const { container } = renderWithProviders(<HelpStaticPage slug='helpOrder' />)
    await waitFor(() => expect(getPage).toHaveBeenCalled())
    await waitFor(() => {
      expect(container.innerHTML).toContain('Help body')
    })
  })
})
