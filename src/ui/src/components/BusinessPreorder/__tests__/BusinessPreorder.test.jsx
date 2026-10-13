import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture } from '../../__tests__/helpers/menuTestMocks'
import { BusinessPreorder } from '../index'

vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>
}))
vi.mock('swiper/modules', () => ({ Navigation: {}, Thumbs: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('~ui/src/components/PreorderDateTimeSteps', () => ({
  PreorderDateTimeSteps: () => <div data-testid='preorder-steps' />
}))
vi.mock('~ui/src/components/BusinessMenuList', () => ({
  BusinessMenuList: () => <div data-testid='menu-list' />
}))

vi.mock('~components/components/MomentOption', () => ({
  MomentOption: ({ UIComponent, ...rest }) => (
    <UIComponent
      business={businessFixture}
      datesList={['2026-07-15']}
      dateSelected='2026-07-15'
      timeSelected='12:00'
      hoursList={[]}
      timeList={['12:00']}
      handleChangeDate={vi.fn()}
      handleChangeTime={vi.fn()}
      showButton
      isAsap={false}
      handleAsap={vi.fn()}
      scheduleSelected={null}
      orderTypes={['Delivery', 'Pickup', 'Eat in', 'Curbside']}
      {...rest}
    />
  )
}))

describe('BusinessPreorder', () => {
  it('renders preorder steps', () => {
    const { getByTestId } = renderWithProviders(<BusinessPreorder />)
    expect(getByTestId('preorder-steps')).toBeInTheDocument()
  })
})
