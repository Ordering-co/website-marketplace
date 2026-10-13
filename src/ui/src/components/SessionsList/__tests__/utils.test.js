import { describe, expect, it } from 'vitest'
import { getUtil } from '../utils'

describe('SessionsList utils', () => {
  it('returns empty-state icon markup', () => {
    const { getIconNoSession } = getUtil()
    expect(getIconNoSession()).toBeTruthy()
  })
})
