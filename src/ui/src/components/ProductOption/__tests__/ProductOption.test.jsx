import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { ProductOption } from '../index'

vi.mock('~components/components/ProductOption', () => ({
  ProductOption: ({ UIComponent, ...rest }) => (
    <UIComponent
      option={{ id: 1, name: 'Size', min: 1, max: 1 }}
      error={false}
      {...rest}
    >
      <div data-testid='suboptions'>suboptions</div>
    </UIComponent>
  )
}))

describe('ProductOption', () => {
  it('renders required label for single-select option', () => {
    const { getByText } = renderWithProviders(<ProductOption />)
    expect(getByText('Size')).toBeInTheDocument()
    expect(getByText('Required')).toBeInTheDocument()
  })

  it('toggles collapse state', () => {
    const { getByText, queryByTestId } = renderWithProviders(<ProductOption />)
    fireEvent.click(getByText('Size'))
    expect(queryByTestId('suboptions')).toBeInTheDocument()
  })
})
