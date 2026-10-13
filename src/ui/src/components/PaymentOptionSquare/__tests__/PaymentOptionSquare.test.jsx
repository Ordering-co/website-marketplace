import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PaymentOptionSquare } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/components/Confirm', () => ({
  Alert: () => null
}))
vi.mock('~ui/src/styles/Tabs', () => ({
  Tabs: ({ children }) => <div>{children}</div>,
  Tab: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>
}))

vi.mock('~components/components/PaymentOptionSquare', () => ({
  PaymentOptionSquare: ({ UIComponent, ...rest }) => (
    <UIComponent
      paymentMethods={[{ name: 'Card', value: 'card_payments' }]}
      methodSelected='card_payments'
      handleChangeMethodSelected={vi.fn()}
      isLoading={false}
      isLoadingMethod={false}
      isLoadingPlace={false}
      alertState={{ open: false, content: [] }}
      setAlertState={vi.fn()}
      {...rest}
    />
  )
}))

describe('PaymentOptionSquare', () => {
  it('renders square card payment container', () => {
    const { getByText } = renderWithProviders(<PaymentOptionSquare />)
    expect(getByText('Card')).toBeInTheDocument()
    expect(document.getElementById('card-container')).toBeInTheDocument()
  })
})
