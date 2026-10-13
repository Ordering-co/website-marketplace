import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { DriverTips } from '../index'

const handlerChangeOption = vi.hoisted(() => vi.fn())

vi.mock('~components/components/DriverTips', () => ({
  DriverTips: ({ UIComponent, ...rest }) => (
    <UIComponent
      driverTip={0}
      driverTipsOptions={[10, 15, 20]}
      isDriverTipUseCustom
      handlerChangeOption={handlerChangeOption}
      cart={{ total: 20 }}
      {...rest}
    />
  )
}))

describe('DriverTips', () => {
  it('renders tip chips and handles selection', () => {
    handlerChangeOption.mockClear()
    const { getByText } = renderWithProviders(<DriverTips />)
    fireEvent.click(getByText('10%'))
    expect(handlerChangeOption).toHaveBeenCalledWith(10)
  })
})
