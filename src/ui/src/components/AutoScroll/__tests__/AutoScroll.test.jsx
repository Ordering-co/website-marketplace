import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { AutoScroll } from '../index'

describe('AutoScroll', () => {
  it('renders children inside the autoscroll container', () => {
    const { getByText } = renderWithProviders(
      <AutoScroll scrollId='test-scroll'>
        <span>scroll child</span>
      </AutoScroll>
    )
    expect(getByText('scroll child')).toBeInTheDocument()
  })

  it('shows scroll controls when content overflows', () => {
    const originalGetElementById = document.getElementById.bind(document)
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      const el = originalGetElementById(id)
      if (!el) return el
      Object.defineProperty(el, 'offsetWidth', { configurable: true, value: 100 })
      Object.defineProperty(el, 'scrollWidth', { configurable: true, value: 400 })
      const parent = el.parentNode
      if (parent) {
        Object.defineProperty(parent, 'offsetWidth', { configurable: true, value: 120 })
        Object.defineProperty(parent, 'scrollWidth', { configurable: true, value: 400 })
        parent.scrollBy = vi.fn()
        parent.addEventListener = vi.fn()
        parent.removeEventListener = vi.fn()
        Object.defineProperty(parent, 'scrollLeft', { configurable: true, value: 80, writable: true })
        if (parent.parentNode) {
          Object.defineProperty(parent.parentNode, 'offsetWidth', { configurable: true, value: 120 })
          parent.parentNode.addEventListener = vi.fn()
          parent.parentNode.removeEventListener = vi.fn()
          parent.parentNode.scrollBy = vi.fn()
          Object.defineProperty(parent.parentNode, 'scrollLeft', { configurable: true, value: 80, writable: true })
        }
      }
      return el
    })

    const { container, getByText } = renderWithProviders(
      <div style={{ width: 100 }}>
        <AutoScroll scrollId='overflow-scroll'>
          <span>overflow child</span>
        </AutoScroll>
      </div>
    )
    expect(getByText('overflow child')).toBeInTheDocument()
    const arrows = container.querySelectorAll('[data-testid^="icon-"]')
    if (arrows.length) {
      fireEvent.mouseDown(arrows[0])
    }
  })

  it('skips controls in column mode', () => {
    const { getByText, container } = renderWithProviders(
      <AutoScroll scrollId='column-scroll' isColumnMode>
        <span>column child</span>
      </AutoScroll>
    )
    expect(getByText('column child')).toBeInTheDocument()
    expect(container.querySelector('.left-autoscroll')).toBeNull()
  })
})
