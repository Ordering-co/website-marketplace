import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'

vi.unmock('~ui/src/components/SpinnerLoader')

import { SpinnerLoader } from '../index'

describe('SpinnerLoader', () => {
  it('renders spinner immediately when delayMs is omitted', () => {
    const { container } = renderWithProviders(<SpinnerLoader content='Loading' />)
    expect(container.querySelector('.spinner')).toBeInTheDocument()
    expect(container).toHaveTextContent('Loading')
  })
})
