import { beforeAll, describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'

vi.unmock('~ui/src/components/Confirm')

let Confirm

beforeAll(async () => {
  ;({ Confirm } = await import('../index'))
})

describe('Confirm', () => {
  it('renders confirmation content when open', () => {
    const { getByText } = renderWithProviders(
      <Confirm open title='Delete item' content='Are you sure?' onAccept={vi.fn()} onClose={vi.fn()} />
    )
    expect(getByText('Delete item')).toBeInTheDocument()
    expect(getByText('Are you sure?')).toBeInTheDocument()
  })

  it('fires onAccept from the accept button', () => {
    const onAccept = vi.fn()
    const { getByText } = renderWithProviders(
      <Confirm open content='Proceed?' onAccept={onAccept} acceptText='Yes' onClose={vi.fn()} />
    )
    fireEvent.click(getByText('Yes'))
    expect(onAccept).toHaveBeenCalled()
  })
})
