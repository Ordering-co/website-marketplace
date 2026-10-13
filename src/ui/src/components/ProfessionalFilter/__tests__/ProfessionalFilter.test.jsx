import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { ProfessionalFilter } from '../index'

vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>
}))
vi.mock('~ui/src/components/SingleProfessionalCard', () => ({
  SingleProfessionalCard: ({ professional, handleProfessionalClick, handleUpdateProfessionals }) => (
    <div>
      <button
        type='button'
        data-testid='pro-card'
        onClick={(e) => handleProfessionalClick?.(e, professional)}
      >
        {professional?.name}
      </button>
      <button
        type='button'
        data-testid='pro-fav'
        onClick={() => handleUpdateProfessionals?.(professional.id, { favorite: true })}
      >
        fav
      </button>
    </div>
  )
}))
vi.mock('~ui/src/components/ProfessionalProfile', () => ({
  ProfessionalProfile: ({ onClose, handleChangeProfessionalSelected, currentProfessional }) => (
    <div data-testid='pro-profile'>
      <button type='button' data-testid='book' onClick={() => handleChangeProfessionalSelected?.(currentProfessional)}>book</button>
      <button type='button' data-testid='close-profile' onClick={onClose}>close</button>
    </div>
  )
}))
vi.mock('~ui/src/components/ProfessionalInfo', () => ({
  ProfessionalInfo: () => <div data-testid='pro-info' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children, onClose }) => (
    open
      ? (
        <div data-testid='modal'>
          <button type='button' data-testid='modal-close' onClick={onClose}>x</button>
          {children}
        </div>
        )
      : null
  )
}))

describe('ProfessionalFilter', () => {
  const professionals = [{ id: 1, name: 'Alex', last_name: 'Rivera' }]

  it('renders professionals heading and cards', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <ProfessionalFilter
        professionals={professionals}
        professionalSelected={null}
        handleChangeProfessionalSelected={vi.fn()}
        handleUpdateProfessionals={vi.fn()}
      />
    )
    expect(getByText('Professionals')).toBeInTheDocument()
    expect(getByText('Any professional member')).toBeInTheDocument()
    expect(getByTestId('pro-card')).toHaveTextContent('Alex')
  })

  it('opens profile modal and books professional', () => {
    const handleChangeProfessionalSelected = vi.fn()
    const { getByTestId, getByText } = renderWithProviders(
      <ProfessionalFilter
        professionals={professionals}
        professionalSelected={null}
        handleChangeProfessionalSelected={handleChangeProfessionalSelected}
        handleUpdateProfessionals={vi.fn()}
      />
    )
    fireEvent.click(getByTestId('pro-card'))
    expect(getByTestId('pro-profile')).toBeInTheDocument()
    fireEvent.click(getByTestId('book'))
    expect(handleChangeProfessionalSelected).toHaveBeenCalled()
    fireEvent.click(getByText('Any professional member'))
    expect(handleChangeProfessionalSelected).toHaveBeenCalledWith(null)
  })

  it('blocks open when cart status is 2', () => {
    const openAlertErrorStatus = vi.fn()
    const { getByTestId, queryByTestId } = renderWithProviders(
      <ProfessionalFilter
        professionals={professionals}
        professionalSelected={null}
        handleChangeProfessionalSelected={vi.fn()}
        handleUpdateProfessionals={vi.fn()}
        openAlertErrorStatus={openAlertErrorStatus}
        cart={{ status: 2 }}
      />
    )
    fireEvent.click(getByTestId('pro-card'))
    expect(openAlertErrorStatus).toHaveBeenCalled()
    expect(queryByTestId('pro-profile')).not.toBeInTheDocument()
  })

  it('updates professionals from card callback', () => {
    const handleUpdateProfessionals = vi.fn()
    const { getByTestId } = renderWithProviders(
      <ProfessionalFilter
        professionals={professionals}
        professionalSelected={null}
        handleChangeProfessionalSelected={vi.fn()}
        handleUpdateProfessionals={handleUpdateProfessionals}
      />
    )
    fireEvent.click(getByTestId('pro-fav'))
    expect(handleUpdateProfessionals).toHaveBeenCalled()
  })
})
