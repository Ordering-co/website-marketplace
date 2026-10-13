import { beforeAll, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.unmock('~ui-icon')

let Icon

beforeAll(async () => {
  ;({ Icon } = await import('../index'))
})

describe('Icon', () => {
  it('renders a known icon from the registry', () => {
    const { container } = render(<Icon name='close' />)
    expect(container.firstChild).toBeTruthy()
  })

  it('returns null for unknown icon names', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(<Icon name='not-a-real-icon' />)
    expect(container.firstChild).toBeNull()
    warn.mockRestore()
  })
})
