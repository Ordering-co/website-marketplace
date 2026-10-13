import { describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { Footer } from '../index'

vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{ configs: { powered_by_ordering_module: { value: true } } }]
}))

describe('Footer', () => {
  it('renders powered by ordering link', async () => {
    const { getByText } = renderWithProviders(<Footer />)
    await waitFor(() => {
      expect(getByText('Powered by')).toBeInTheDocument()
      expect(getByText('Orderingplus')).toBeInTheDocument()
    })
  })
})
