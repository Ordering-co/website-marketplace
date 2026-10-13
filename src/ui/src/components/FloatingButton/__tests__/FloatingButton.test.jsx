import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { FloatingButton } from '../index'

const handleButtonClick = vi.fn()

vi.mock('~components/components/FloatingButton', () => ({
  FloatingButton: ({ UIComponent, ...rest }) => (
    <UIComponent btnText='Checkout' btnValue='$12' handleButtonClick={handleButtonClick} {...rest} />
  )
}))

describe('FloatingButton', () => {
  it('renders button text and handles click', () => {
    const { getByText } = renderWithProviders(<FloatingButton />)
    fireEvent.click(getByText('Checkout'))
    expect(getByText('$12')).toBeInTheDocument()
    expect(handleButtonClick).toHaveBeenCalled()
  })
})
