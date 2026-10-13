import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture } from '../../__tests__/helpers/cartTestMocks'
import { MomentControl } from '../index'

vi.mock('react-datepicker/dist/react-datepicker.css', () => ({}))
vi.mock('~ui/src/components/PreorderDateTimeSteps', () => ({
  PreorderDateTimeSteps: () => <div data-testid='preorder-steps' />
}))
vi.mock('~ui/src/components/MomentControl/layouts/CustomLayout', () => ({
  CustomLayout: () => <div data-testid='custom-layout' />
}))

vi.mock('~components/components/MomentOption', () => ({
  MomentOption: ({ UIComponent, ...rest }) => (
    <UIComponent
      isAsap
      datesList={['2026-07-14', '2026-07-15']}
      hoursList={[{ start: '10:00', end: '11:00' }]}
      dateSelected='2026-07-14'
      timeSelected='10:00'
      handleAsap={vi.fn()}
      handleChangeDate={vi.fn()}
      handleChangeTime={vi.fn()}
      onClose={vi.fn()}
      business={businessFixture}
      isUseWeekPicker={false}
      timeList={[{ value: '10:00', text: '10:00 AM' }]}
      isEnabled
      {...rest}
    />
  )
}))

describe('MomentControl', () => {
  it('renders preorder moment controls', () => {
    const { getByText } = renderWithProviders(<MomentControl business={businessFixture} />)
    expect(getByText(/ASAP/)).toBeInTheDocument()
    expect(getByText('Schedule for later')).toBeInTheDocument()
  })
})
