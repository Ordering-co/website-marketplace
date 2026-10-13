import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { LinkableText } from '../index'

describe('LinkableText', () => {
  it('linkifies URLs in plain text', () => {
    const { getByRole } = render(<LinkableText text='Visit https://example.com today' />)
    expect(getByRole('link', { name: 'https://example.com' })).toHaveAttribute('href', 'https://example.com')
  })
})
