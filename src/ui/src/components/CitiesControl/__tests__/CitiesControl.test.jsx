import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CitiesControl } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))

describe('CitiesControl', () => {
  it('renders title and enabled cities', () => {
    const { getByText } = renderWithProviders(
      <CitiesControl
        cities={[{ id: 1, name: 'Austin', enabled: true }]}
        onClose={vi.fn()}
        handleChangeCity={vi.fn()}
      />
    )
    expect(getByText('Select a city')).toBeInTheDocument()
    expect(getByText('Austin')).toBeInTheDocument()
  })

  it('clears the city filter with the all cities option', () => {
    const handleChangeCity = vi.fn()
    const { getByText } = renderWithProviders(
      <CitiesControl
        cities={[{ id: 1, name: 'Austin', enabled: true }]}
        onClose={vi.fn()}
        handleChangeCity={handleChangeCity}
      />
    )
    fireEvent.click(getByText('Austin'))
    fireEvent.click(getByText('All cities'))
    fireEvent.click(getByText('Continue'))
    expect(handleChangeCity).toHaveBeenCalledWith(null)
  })

  it('calls onClose when continue is clicked', () => {
    const onClose = vi.fn()
    const { getByText } = renderWithProviders(
      <CitiesControl
        cities={[{ id: 1, name: 'Austin', enabled: true }]}
        onClose={onClose}
        handleChangeCity={vi.fn()}
      />
    )
    fireEvent.click(getByText('Continue'))
    expect(onClose).toHaveBeenCalled()
  })
})
