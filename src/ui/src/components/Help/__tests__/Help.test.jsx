import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { Help } from '../index'

vi.mock('~ui/src/components/LastOrders', () => ({
  LastOrders: () => <div data-testid='last-orders' />
}))
vi.mock('~ui/src/components/HelpStaticPage', () => ({
  HelpStaticPage: ({ slug }) => <div data-testid='help-static' data-slug={slug} />
}))

describe('Help', () => {
  it('renders help menu', () => {
    const { getByText, getByTestId } = renderWithProviders(<Help />)
    expect(getByText('Help')).toBeInTheDocument()
    expect(getByText('Help with an order')).toBeInTheDocument()
    expect(getByTestId('last-orders')).toBeInTheDocument()
  })

  it('opens static page when menu item clicked', () => {
    const { getByText, getByTestId } = renderWithProviders(<Help />)
    fireEvent.click(getByText('Help with an order'))
    expect(getByTestId('help-static')).toHaveAttribute('data-slug', 'helpOrder')
  })
})
