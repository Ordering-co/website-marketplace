import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { Image } from '../index'

describe('Image', () => {
  it('renders the source image when provided', () => {
    const { getByAltText } = render(<Image src='https://example.com/photo.jpg' />)
    expect(getByAltText('profile-image')).toHaveAttribute('src', 'https://example.com/photo.jpg')
  })

  it('renders fallback content when src is missing', () => {
    const { getByText } = render(<Image fallback={<span>fallback avatar</span>} />)
    expect(getByText('fallback avatar')).toBeInTheDocument()
  })

  it('swaps to fallback content after image error', () => {
    const { getByAltText, getByText } = render(
      <Image src='https://example.com/broken.jpg' fallback={<span>broken fallback</span>} />
    )
    fireEvent.error(getByAltText('profile-image'))
    expect(getByText('broken fallback')).toBeInTheDocument()
  })
})
