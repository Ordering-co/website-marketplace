import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { activeOrder } from '../../__tests__/helpers/ordersTestMocks'
import { Messages } from '../index'

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (fn) => fn,
    register: () => null,
    errors: {},
    formState: { errors: {} },
    setValue: vi.fn()
  })
}))

vi.mock('./MapMessages', () => ({
  MapMessages: () => null
}))

vi.mock('~components/components/Messages', () => ({
  Messages: ({ UIComponent, ...rest }) => (
    <UIComponent
      order={activeOrder}
      messages={{ loading: false, messages: [] }}
      messagesToShow={{ messages: [] }}
      business
      driver={false}
      handleSend={vi.fn()}
      readMessages={vi.fn()}
      onClose={vi.fn()}
      onMessages={vi.fn()}
      setCanRead={vi.fn()}
      setImage={vi.fn()}
      setMessage={vi.fn()}
      image={null}
      message=''
      sendMessage={{ error: null }}
      profileMessages={false}
      {...rest}
    />
  )
}))

describe('Messages', () => {
  it('renders messages title and composer', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<Messages orderId={activeOrder.id} />)
    expect(getByText('Messages')).toBeInTheDocument()
    expect(getByPlaceholderText('Type your message here')).toBeInTheDocument()
  })
})
