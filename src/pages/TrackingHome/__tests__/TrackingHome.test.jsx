import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { TrackingHomePage } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui/src/components/TrackingHome', () => ({
  TrackingHome: () => <div data-testid='tracking-home-ui' />
}))

describe('TrackingHomePage', () => {
  it('renders helmet tags for the tracking home and the landing UI', () => {
    const { getByTestId } = renderWithProviders(<TrackingHomePage />)
    expect(getByTestId('helmet-tags').dataset.page).toBe('tracking_home')
    expect(getByTestId('tracking-home-ui')).toBeInTheDocument()
  })
})
