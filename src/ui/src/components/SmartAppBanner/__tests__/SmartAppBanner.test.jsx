import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { SmartAppBanner } from '../index'

vi.mock('~components/components/SmartAppBanner', () => ({
  SmartAppBanner: ({ UIComponent, ...rest }) => <UIComponent {...rest} />
}))

describe('SmartAppBanner', () => {
  it('wires controller with empty presentation shell', () => {
    const { container } = renderWithProviders(<SmartAppBanner />)
    expect(container).toBeEmptyDOMElement()
  })
})
