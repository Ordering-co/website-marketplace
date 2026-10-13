import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { UtilsProviders } from '~components/contexts/UtilsContext'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { MaxSectionItem } from '../index'

const config = vi.hoisted(() => ({ state: { configs: {} } }))
vi.mock('~components/contexts/ConfigContext', () => ({ useConfig: () => [config.state] }))
vi.mock('~components/contexts/UtilsContext', async (importOriginal) => importOriginal())

const strategy = { getItem: () => new Promise(() => {}) }
const CurrencyProvider = ({ children }) => <UtilsProviders strategy={strategy}>{children}</UtilsProviders>

const setCurrency = (symbol, position = 'left', separator = '.') => {
  config.state = {
    configs: {
      format_number_currency: { value: symbol },
      currency_position: { value: position },
      format_number_decimal_length: { value: 2 },
      format_number_decimal_separator: { value: separator },
      distance_unit: { value: 'km' }
    }
  }
}

describe('MaxSectionItem', () => {
  beforeEach(() => setCurrency('$'))
  it('renders filter title and options', () => {
    const { getByText } = renderWithProviders(
      <MaxSectionItem
        title='Max delivery fee'
        filter='max_delivery_price'
        options={[5, 10, 15, 'default']}
        filters={{ max_delivery_price: 10 }}
        handleChangeFilters={vi.fn()}
        defaultOpen
      />,
      { wrapper: CurrencyProvider }
    )
    expect(getByText('Under $ 10.00')).toBeInTheDocument()
  })

  it.each([
    ['€', 'left', '.', ['€ 1.00', '€ 2.00', '€ 5.00', '€ 5.00+']],
    ['£', 'left', '.', ['£ 1.00', '£ 2.00', '£ 5.00', '£ 5.00+']],
    ['SRD', 'right', ',', ['1,00 SRD', '2,00 SRD', '5,00 SRD', '5,00 SRD+']],
    [undefined, 'left', '.', ['$ 1.00', '$ 2.00', '$ 5.00', '$ 5.00+']]
  ])('uses configured currency %s and number formatting for every stop', (symbol, position, separator, labels) => {
    setCurrency(symbol, position, separator)
    const handleChangeFilters = vi.fn()
    const { getByText, rerender } = renderWithProviders(
      <MaxSectionItem filter='max_delivery_price' options={[1, 2, 5, 'default']} filters={{ max_delivery_price: 2 }} handleChangeFilters={handleChangeFilters} defaultOpen />,
      { wrapper: CurrencyProvider }
    )
    labels.forEach(label => expect(getByText(label)).toBeInTheDocument())
    expect(getByText(`Under ${labels[1]}`)).toBeInTheDocument()
    fireEvent.click(getByText(labels[1]))
    fireEvent.click(getByText(labels[3]))
    expect(handleChangeFilters.mock.calls).toEqual([['max_delivery_price', 2], ['max_delivery_price', 'default']])
    rerender(
      <MaxSectionItem filter='max_delivery_price' options={[1, 2, 5, 'default']} filters={{ max_delivery_price: 'default' }} handleChangeFilters={handleChangeFilters} defaultOpen />
    )
    expect(getByText(`Under ${labels[2]}`)).toBeInTheDocument()
  })

  it('updates labels when runtime currency configuration changes', () => {
    const element = <MaxSectionItem filter='max_delivery_price' options={[1, 2, 5, 'default']} filters={{}} handleChangeFilters={vi.fn()} defaultOpen />
    const { getByText, queryByText, rerender } = renderWithProviders(element, { wrapper: CurrencyProvider })
    expect(getByText('$ 1.00')).toBeInTheDocument()
    setCurrency('€')
    rerender(<MaxSectionItem filter='max_delivery_price' options={[1, 2, 5, 'default']} filters={{}} handleChangeFilters={vi.fn()} defaultOpen />)
    expect(getByText('€ 1.00')).toBeInTheDocument()
    expect(getByText('€ 5.00+')).toBeInTheDocument()
    expect(queryByText('$ 1.00')).not.toBeInTheDocument()
  })

  it.each([
    ['max_eta', [1, 2, 5, 'default'], ['1 min', '2 min', '5 min', '5 min+']],
    ['max_distance', [1000, 2000, 5000, 'default'], ['1 Km', '2 Km', '5 Km', '5 Km+']]
  ])('preserves %s units', (filter, options, labels) => {
    setCurrency('€')
    const { getByText } = renderWithProviders(
      <MaxSectionItem filter={filter} options={options} filters={{}} handleChangeFilters={vi.fn()} defaultOpen />,
      { wrapper: CurrencyProvider }
    )
    labels.forEach(label => expect(getByText(label)).toBeInTheDocument())
  })
})
