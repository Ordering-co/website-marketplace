import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { WebsocketStatus } from '../index'

vi.mock('~components/components/WebsocketStatus', () => ({
  WebsocketStatus: ({ UIComponent, ...rest }) => (
    <UIComponent
      socketStatus={1}
      reconnectAttemptCount={0}
      connectedDate='2026-01-01T12:00:00Z'
      {...rest}
    />
  )
}))

describe('WebsocketStatus', () => {
  it('opens connection status modal', () => {
    const { getByText } = renderWithProviders(<WebsocketStatus />)
    fireEvent.click(getByText('Connection status'))
    expect(getByText(/Last update/)).toBeInTheDocument()
  })
})
