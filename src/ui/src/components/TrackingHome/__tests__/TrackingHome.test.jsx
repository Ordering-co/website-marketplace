import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { TrackingHome } from '../index'

vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('TrackingHome', () => {
  it('renders the title and message without a logo', () => {
    const { getByText, container } = renderWithProviders(<TrackingHome />)
    expect(getByText('Follow your order')).toBeInTheDocument()
    expect(getByText('To see the status of your order, open the link we sent you.')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })
})
