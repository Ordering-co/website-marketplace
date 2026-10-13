import { describe, expect, it } from 'vitest'
import { getForterSnippet } from '../snippet'

describe('ForterScript snippet', () => {
  it('returns sandbox snippet when environment is sandbox', () => {
    const snippet = getForterSnippet('site-123', 'sandbox')
    expect(snippet).toContain("var siteId = 'site-123'")
    expect(snippet).toContain('window.ftr__config')
  })

  it('returns production snippet by default', () => {
    const snippet = getForterSnippet('site-456')
    expect(snippet).toContain("var siteId = 'site-456'")
  })
})
