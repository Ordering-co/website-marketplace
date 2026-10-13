import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const html = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '../../../index.html'),
  'utf8'
)

describe('index.html PWA bootstrap', () => {
  it('does not point Chrome at the English template manifest on first paint', () => {
    expect(html).not.toMatch(/href=["']\/manifest\.json["']/)
    expect(html).not.toMatch(/rel=["']manifest["']/)
  })
})
