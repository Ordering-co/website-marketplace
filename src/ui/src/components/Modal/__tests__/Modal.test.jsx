import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { Modal } from '../index'

describe('Modal', () => {
  it('renders title and children when open', () => {
    const onClose = vi.fn()
    const { getByText } = renderWithProviders(
      <Modal open title='Test modal' onClose={onClose}>
        <p>Modal body</p>
      </Modal>
    )
    expect(getByText('Test modal')).toBeInTheDocument()
    expect(getByText('Modal body')).toBeInTheDocument()
  })

  it('calls onAccept when accept button is clicked', () => {
    const onAccept = vi.fn()
    const { getByText } = renderWithProviders(
      <Modal open title='Confirm' onAccept={onAccept} acceptText='Save' />
    )
    fireEvent.click(getByText('Save'))
    expect(onAccept).toHaveBeenCalled()
  })
})
