import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { createLanguageWrapper } from '../../../../../__tests__/helpers/languageTestUtils'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { NavigationBar } from '../index'

vi.mock('@loadable/component', () => ({
  default: () => () => <div data-testid='lazy-modal-child' />
}))

describe('NavigationBar', () => {

  it.each([
    ['es', 'Inicio', 'Casa'],
    ['bg', 'Начало', 'Дом']
  ])('keeps legacy navigation independent of address labels in %s', async (code, nav, address) => {
    const dictionary = { WEBSITE_HOME: nav, WEBSITE_ADDRESS_HOME: address }
    const { findByText, queryByText, rerender } = renderWithProviders(<NavigationBar />, {
      wrapper: createLanguageWrapper(dictionary, code)
    })
    expect(await findByText(nav)).toBeInTheDocument()
    dictionary.WEBSITE_ADDRESS_HOME = 'Custom address label'
    rerender(<NavigationBar />)
    expect(await findByText(nav)).toBeInTheDocument()
    expect(queryByText('Custom address label')).not.toBeInTheDocument()
  })

  it('renders primary mobile navigation links', () => {
    const { getByText } = renderWithProviders(<NavigationBar />, {
      initialEntries: ['/search'],
      routePath: '/search'
    })
    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('Explore')).toBeInTheDocument()
    expect(getByText('Orders')).toBeInTheDocument()
    expect(getByText('My cart')).toBeInTheDocument()
    expect(getByText('Profile')).toBeInTheDocument()
  })

  it('opens address modal for guests tapping Home', () => {
    const { getByText } = renderWithProviders(<NavigationBar />, {
      initialEntries: ['/home'],
      routePath: '/home'
    })
    fireEvent.click(getByText('Home'))
    expect(getByText('Where do we deliver?')).toBeInTheDocument()
  })

  it('opens cart modal when My cart is clicked', () => {
    const { getByText, getByTestId } = renderWithProviders(<NavigationBar />, {
      initialEntries: ['/search'],
      routePath: '/search'
    })
    fireEvent.click(getByText('My cart'))
    expect(getByTestId('lazy-modal-child')).toBeInTheDocument()
  })

  it('opens login modal when guest taps Explore', () => {
    const { getByText, getAllByTestId } = renderWithProviders(<NavigationBar />, {
      initialEntries: ['/search'],
      routePath: '/search'
    })
    fireEvent.click(getByText('Explore'))
    expect(getAllByTestId('lazy-modal-child').length).toBeGreaterThan(0)
  })
})
