import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { Pagination } from '../index'

describe('Pagination', () => {
  it('renders page buttons and changes page', () => {
    const handleChangePage = vi.fn()
    const { getByText } = renderWithProviders(
      <Pagination currentPage={1} totalPages={5} handleChangePage={handleChangePage} />
    )
    fireEvent.click(getByText('3'))
    expect(handleChangePage).toHaveBeenCalledWith(3)
  })
})
