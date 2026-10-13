import React from 'react'
import { vi } from 'vitest'
import { ApiContext } from '~components/contexts/ApiContext'
import { LanguageProvider } from '~components/contexts/LanguageContext'

// Keep the production translation lookup and WEBSITE_ prefix handling real.
// Only replace the API and storage boundaries used to load the dictionary.
vi.unmock('~components/contexts/ApiContext')
vi.unmock('~components/contexts/LanguageContext')

export const createLanguageWrapper = (dictionary, code) => {
  const language = { id: 1, code, rtl: false }
  const ordering = {
    language: code,
    languages: () => ({
      where: () => ({
        get: async () => ({ content: { error: false, result: [language] } })
      })
    }),
    translations: () => ({
      parameters: () => ({
        where: () => ({
          asDictionary: () => ({
            get: async () => ({ content: { error: false, result: dictionary } })
          })
        })
      })
    })
  }
  const api = [ordering, { setLanguage: () => {} }]
  const strategy = { getItem: async (key) => key === 'language' ? language : null }
  const settings = {}
  const restOfProps = { app_internal_name: 'website' }

  return function LanguageTestWrapper ({ children }) {
    return (
      <ApiContext.Provider value={api}>
        <LanguageProvider settings={settings} strategy={strategy} restOfProps={restOfProps}>
          {children}
        </LanguageProvider>
      </ApiContext.Provider>
    )
  }
}
