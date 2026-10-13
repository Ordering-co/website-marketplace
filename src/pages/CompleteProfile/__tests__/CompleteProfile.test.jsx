import { describe, it, expect, vi } from 'vitest'

import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { CompleteProfile } from '../index'

const skip = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))

vi.mock('~ui/src/components/CompleteProfile', () => ({
  CompleteProfile: (props) => (
    <div
      data-testid='complete-profile-ui'
      data-required={JSON.stringify(props.missingFields)}
      data-canskip={String(props.canSkip)}
      data-hasonskip={String(typeof props.onSkip === 'function')}
    />
  )
}))

vi.mock('../../../contexts/CheckoutFieldsContext', () => ({
  useProfileCompletion: () => ({
    missingFields: ['name'],
    checkoutFields: [{ order_type_id: 1, enabled: true, required: true, validation_field: { code: 'name' } }],
    canSkip: true,
    skip
  })
}))

describe('CompleteProfile page', () => {
  it('renderiza el helmet y reenvía los datos del gate al controlador', () => {
    const { getByTestId } = renderWithProviders(<CompleteProfile />)

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'complete-profile')
    const ui = getByTestId('complete-profile-ui')
    expect(ui).toHaveAttribute('data-required', JSON.stringify(['name']))
    expect(ui).toHaveAttribute('data-canskip', 'true')
    expect(ui).toHaveAttribute('data-hasonskip', 'true')
  })
})
