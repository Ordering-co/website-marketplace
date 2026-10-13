import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { PWAPrompt } from '../index'

const languageState = { loading: false }

vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [languageState, (key, fallback) => fallback]
}))

vi.mock('react-ios-pwa-prompt', () => ({
  default: (props) => <div data-testid='ios-pwa-prompt' data-close={props.copyClosePrompt} />
}))

describe('PWAPrompt', () => {
  it('renders translated library props when ready on Safari iOS', () => {
    render(
      <PWAPrompt
        ready
        userAgent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'
      />
    )

    expect(screen.getByTestId('ios-pwa-prompt')).toHaveAttribute('data-close', 'Close')
  })

  it('does not render while language is loading', () => {
    languageState.loading = true
    const { container } = render(
      <PWAPrompt
        ready
        userAgent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'
      />
    )

    expect(container).toBeEmptyDOMElement()
    languageState.loading = false
  })
})
