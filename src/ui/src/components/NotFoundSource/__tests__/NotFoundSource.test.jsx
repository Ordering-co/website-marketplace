import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { NotFoundSource } from '../index'

describe('NotFoundSource', () => {
  it('renders not-found content and action button', () => {
    const onClickButton = vi.fn()
    const { getByText } = renderWithProviders(
      <NotFoundSource content='Nothing here' btnTitle='Go back' onClickButton={onClickButton} />
    )
    fireEvent.click(getByText('Go back'))
    expect(getByText('Nothing here')).toBeInTheDocument()
    expect(onClickButton).toHaveBeenCalled()
  })
})
