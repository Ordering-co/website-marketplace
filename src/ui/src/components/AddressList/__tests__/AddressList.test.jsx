import { describe, expect, it, vi } from 'vitest'
import { createLanguageWrapper } from '../../../../../__tests__/helpers/languageTestUtils'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { addressFixture } from '../../__tests__/helpers/cartTestMocks'
import { AddressList } from '../index'

vi.mock('~ui/src/components/AddressForm', () => ({
  AddressForm: () => <div data-testid='address-form' />
}))
vi.mock('~ui/src/components/NotFoundSource', () => ({
  NotFoundSource: () => <div data-testid='not-found' />
}))

vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [
    { options: { type: 1, address: {} }, loading: false, carts: {} },
    { refreshOrderOptions: vi.fn() }
  ]
}))

vi.mock('~components/components/AddressList', () => ({
  AddressList: ({ UIComponent, ...rest }) => (
    <UIComponent
      actionStatus={{ loading: false, error: null }}
      addressList={{ addresses: [addressFixture], loading: false }}
      handleDelete={vi.fn()}
      setAddressList={vi.fn()}
      handleSetDefault={vi.fn()}
      title='Delivery Address'
      isModal
      {...rest}
    />
  )
}))

describe('AddressList', () => {

  it.each([
    ['es', 'Inicio', 'Casa'],
    ['bg', 'Начало', 'Дом']
  ])('uses the address translation for a saved home tag in %s', async (code, nav, address) => {
    const dictionary = { WEBSITE_HOME: nav, WEBSITE_ADDRESS_HOME: address }
    const props = { isModal: true, addressList: { loading: false, addresses: [{ ...addressFixture, tag: 'home' }] } }
    const { findByText, queryByText, rerender } = renderWithProviders(<AddressList {...props} />, {
      wrapper: createLanguageWrapper(dictionary, code)
    })
    expect(await findByText(address)).toBeInTheDocument()
    dictionary.WEBSITE_HOME = 'Custom navigation label'
    rerender(<AddressList {...props} />)
    expect(await findByText(address)).toBeInTheDocument()
    expect(queryByText('Custom navigation label')).not.toBeInTheDocument()
  })

  it('preserves office, custom and missing address tag translations', async () => {
    const addresses = [
      { ...addressFixture, tag: 'office' },
      { ...addressFixture, id: 2, address: '456 Custom St', tag: 'custom' },
      { ...addressFixture, id: 3, address: '789 Other St' }
    ]
    const { findByText } = renderWithProviders(<AddressList isModal addressList={{ loading: false, addresses }} />, {
      wrapper: createLanguageWrapper({ WEBSITE_OFFICE: 'Oficina', WEBSITE_CUSTOM: 'Personalizada', WEBSITE_OTHER: 'Otra' }, 'es')
    })
    expect(await findByText('Oficina')).toBeInTheDocument()
    expect(await findByText('Personalizada')).toBeInTheDocument()
    expect(await findByText('Otra')).toBeInTheDocument()
  })

  it('renders saved addresses', () => {
    const { getByText } = renderWithProviders(<AddressList isModal />)
    expect(getByText('123 Main St')).toBeInTheDocument()
  })
})
