import { describe, expect, it } from 'vitest'

import { buildPwaPromptCopy, shouldShowIosPwaPrompt } from '../pwaPromptCopy'

describe('buildPwaPromptCopy', () => {
  it('uses translated strings from t()', () => {
    const t = (key, fallback) => ({
      PWA_ADD_TO_HOME_SCREEN: 'Añadir a la pantalla de inicio',
      PWA_ADD_TO_HOME_BODY: 'Este sitio tiene funciones de app.',
      PWA_SHARE_BUTTON: "1) Pulsa el botón 'Compartir'",
      PWA_ADD_HOME_BUTTON: "2) Pulsa 'Añadir a pantalla de inicio'",
      PWA_CLOSE_PROMPT: 'Cerrar'
    }[key] || fallback)

    expect(buildPwaPromptCopy(t)).toEqual({
      copyTitle: 'Añadir a la pantalla de inicio',
      copyBody: 'Este sitio tiene funciones de app.',
      copyShareButtonLabel: "1) Pulsa el botón 'Compartir'",
      copyAddHomeButtonLabel: "2) Pulsa 'Añadir a pantalla de inicio'",
      copyClosePrompt: 'Cerrar'
    })
  })

  it('falls back to English when the dictionary has no key', () => {
    const t = (_key, fallback) => fallback

    expect(buildPwaPromptCopy(t).copyClosePrompt).toBe('Close')
    expect(buildPwaPromptCopy(t).copyTitle).toBe('Add to Home Screen')
  })
})

describe('shouldShowIosPwaPrompt', () => {
  it('hides the prompt until branding and language are ready', () => {
    expect(shouldShowIosPwaPrompt({ ready: false, languageLoading: false, userAgent: 'iPhone' })).toBe(false)
    expect(shouldShowIosPwaPrompt({ ready: true, languageLoading: true, userAgent: 'iPhone' })).toBe(false)
  })

  it('hides the prompt on Chrome iOS', () => {
    expect(shouldShowIosPwaPrompt({
      ready: true,
      languageLoading: false,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) CriOS/120.0.0.0'
    })).toBe(false)
  })

  it('shows the prompt on Safari iOS when ready', () => {
    expect(shouldShowIosPwaPrompt({
      ready: true,
      languageLoading: false,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    })).toBe(true)
  })
})
