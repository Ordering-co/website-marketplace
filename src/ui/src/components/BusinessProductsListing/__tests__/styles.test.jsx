import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { describe, expect, it } from 'vitest'
import { MobileCartActions } from '../styles'

describe('MobileCartActions', () => {
  it('retains the desktop total typography when the action row is split from the progress message', () => {
    const sheet = new ServerStyleSheet()
    try {
      renderToString(sheet.collectStyles(<MobileCartActions><span>$12</span></MobileCartActions>))
      const css = sheet.getStyleTags()
      expect(css).toContain('@media (min-width:1200px)')
      expect(css).toContain('font-size:18px')
      expect(css).toContain('padding-left:20px')
    } finally {
      sheet.seal()
    }
  })
})
