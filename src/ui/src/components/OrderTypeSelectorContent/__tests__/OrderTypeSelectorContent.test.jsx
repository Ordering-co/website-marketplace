import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { OrderTypeSelectorContent } from '../index'

const handleChangeOrderType = vi.hoisted(() => vi.fn())
const onClose = vi.hoisted(() => vi.fn())

vi.mock('~components/components/OrderTypeControl', () => ({
  OrderTypeControl: ({ UIComponent, ...rest }) => (
    <UIComponent
      handleChangeOrderType={handleChangeOrderType}
      onClose={onClose}
      configTypes={[1, 2]}
      orderTypes={[
        { value: 1, text: 'Delivery' },
        { value: 2, text: 'Pickup' }
      ]}
      {...rest}
    />
  )
}))

describe('OrderTypeSelectorContent', () => {
  it('renders order type options and handles selection', () => {
    handleChangeOrderType.mockClear()
    onClose.mockClear()
    const { getByText } = renderWithProviders(<OrderTypeSelectorContent />)
    fireEvent.click(getByText('Delivery'))
    expect(onClose).toHaveBeenCalled()
    expect(handleChangeOrderType).toHaveBeenCalledWith(1)
  })
})
