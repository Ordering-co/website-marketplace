import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { ProfessionalProfile } from '../index'

vi.mock('~ui/src/components/BusinessPreorder', () => ({
  BusinessPreorder: () => <div data-testid='preorder' />
}))

describe('ProfessionalProfile', () => {
  it('renders name and book action', () => {
    const handleChangeProfessionalSelected = vi.fn()
    const onClose = vi.fn()
    const { getByText } = renderWithProviders(
      <ProfessionalProfile
        currentProfessional={{ id: 1, name: 'Casey', lastname: 'Nguyen' }}
        handleChangeProfessionalSelected={handleChangeProfessionalSelected}
        onClose={onClose}
      />
    )
    expect(getByText(/Casey/)).toBeInTheDocument()
    expect(getByText('No schedule')).toBeInTheDocument()
    fireEvent.click(getByText('Book'))
    expect(handleChangeProfessionalSelected).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
