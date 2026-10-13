import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CustomOrderModal } from '../index'

vi.mock('~ui/utils/customOrder', () => ({
  fetchPluginConfig: vi.fn().mockResolvedValue({ max_distance_km: 25 }),
  createCustomOrder: vi.fn()
}))

vi.mock('~ui/src/components/CustomOrderModal/Step1', () => ({
  Step1: () => <div>Step one form</div>
}))

vi.mock('~ui/src/components/CustomOrderModal/Step2', () => ({
  Step2: () => <div>Step 2</div>
}))

describe('CustomOrderModal', () => {
  it('renders step one content when open', () => {
    const { getByText } = renderWithProviders(
      <CustomOrderModal open onClose={vi.fn()} />
    )
    expect(getByText('Where do we pickup and deliver?')).toBeInTheDocument()
    expect(getByText('Step one form')).toBeInTheDocument()
  })
})
