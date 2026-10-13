import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { pastOrder, sampleBusiness } from '../../__tests__/helpers/ordersTestMocks'
import { MultiOrdersDetails } from '../index'

vi.mock('~components/components/MultiOrdersDetails', () => ({
  MultiOrdersDetails: ({ UIComponent, ...rest }) => (
    <UIComponent
      ordersList={{ loading: false, error: null, orders: [pastOrder] }}
      customer={{ name: 'Jane', lastname: 'Doe', image: 'avatar.png' }}
      ordersSummary={{ total: 15.5 }}
      paymentEvents={[]}
      handleOrderRedirect={vi.fn()}
      {...rest}
    />
  )
}))

vi.mock('~ui/src/components/SingleOrderCard', () => ({
  SingleOrderCard: ({ order }) => <div>{order.business.name}</div>
}))

describe('MultiOrdersDetails', () => {
  it('renders order summary and payment total', () => {
    const { getByText } = renderWithProviders(<MultiOrdersDetails />)
    expect(getByText('Order summary')).toBeInTheDocument()
    expect(getByText(/Payment total/)).toBeInTheDocument()
    expect(getByText('Pizza Place')).toBeInTheDocument()
  })
})
