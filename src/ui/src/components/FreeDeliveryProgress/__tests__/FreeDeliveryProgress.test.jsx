import React from 'react'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { getContrast } from 'polished'
import { defaultTheme, renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { FreeDeliveryProgress } from '../index'

describe('FreeDeliveryProgress', () => {
  it.each(['awareness', 'progress', 'unconfirmed', 'unlocked'])('shows %s without an icon', status => {
    const { container } = renderWithProviders(
      <FreeDeliveryProgress status={status} minimum={30} currentAmount={12} remainingAmount={18} progressPercent={40} />
    )

    expect(container.querySelector('[data-testid^="icon-"]')).toBeNull()
  })

  it('allows copy and amounts to wrap independently on narrow screens', () => {
    renderWithProviders(<FreeDeliveryProgress status='progress' minimum={30} currentAmount={12} remainingAmount={18} progressPercent={40} variant='compact' />)
    expect(window.getComputedStyle(screen.getByText('$12 / $30').parentElement).flexWrap).toBe('wrap')
  })
  it('renders nothing when progress is hidden', () => {
    const { container } = renderWithProviders(
      <FreeDeliveryProgress status='hidden' />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('formats the qualifying minimum in the awareness message', () => {
    renderWithProviders(
      <FreeDeliveryProgress status='awareness' minimum={25} />
    )

    expect(screen.getByText('Free delivery on orders $25+')).toBeInTheDocument()
  })

  it('shows formatted progress amounts and exposes semantic progress values', () => {
    renderWithProviders(
      <FreeDeliveryProgress
        status='progress'
        minimum={25}
        currentAmount={10}
        remainingAmount={15}
        progressPercent={40}
      />
    )

    expect(screen.getByText('Add $15 for free delivery')).toBeInTheDocument()
    expect(screen.getByText('$10 / $25')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0')
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100')
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
  })

  it('announces the unlocked state with text independent of color', () => {
    renderWithProviders(
      <FreeDeliveryProgress status='unlocked' />
    )

    const unlocked = screen.getByRole('status')
    const styles = window.getComputedStyle(unlocked)

    expect(unlocked).toHaveTextContent('Free delivery unlocked')
    expect(styles.color).toBe('rgb(0, 0, 0)')
    expect(styles.backgroundColor).toBe('rgb(214, 255, 247)')
    expect(getContrast(defaultTheme.colors.darkTextColor, defaultTheme.colors.lightGreen)).toBeGreaterThanOrEqual(4.5)
  })

  it('warns without claiming free delivery when the cart has not confirmed the offer', () => {
    renderWithProviders(<FreeDeliveryProgress status='unconfirmed' minimum={30} />)
    expect(screen.getByRole('status')).toHaveTextContent('Free delivery has not been applied to this cart yet')
    expect(screen.queryByText('Free delivery unlocked')).not.toBeInTheDocument()
  })

  it.each(['compact', 'full'])('keeps the progress copy and amounts in the %s variant', (variant) => {
    renderWithProviders(
      <FreeDeliveryProgress
        variant={variant}
        status='progress'
        minimum={30}
        currentAmount={12}
        remainingAmount={18}
        progressPercent={40}
      />
    )

    expect(screen.getByText('Add $18 for free delivery')).toBeInTheDocument()
    expect(screen.getByText('$12 / $30')).toBeInTheDocument()
  })
})
