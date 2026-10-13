import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { SessionsList } from '../index'
import { baseSessionsUIProps } from '../../__tests__/helpers/authTestUtils'

const { sessionsPropsRef } = vi.hoisted(() => ({
  sessionsPropsRef: { current: null }
}))

let sessionsListState = { loading: false, sessions: [] }

vi.mock('~components/components/Sessions', () => ({
  Sessions: ({ UIComponent, ...rest }) => (
    <UIComponent
      {...baseSessionsUIProps}
      {...sessionsPropsRef.current}
      sessionsList={sessionsListState}
      {...rest}
    />
  )
}))
vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ user: { session_strategy: 'jwt_session' } }]
}))
vi.mock('~components/contexts/UtilsContext', () => ({
  useUtils: () => [{ parseDate: (value) => value }]
}))

describe('SessionsList', () => {
  beforeEach(() => {
    sessionsListState = { loading: false, sessions: [] }
    sessionsPropsRef.current = {
      handleDeleteSession: vi.fn(),
      handleDeleteAllSessions: vi.fn()
    }
  })

  it('renders empty sessions message for jwt strategy', () => {
    const { getByText } = renderWithProviders(<SessionsList />)
    expect(getByText("You don't have any sessions")).toBeInTheDocument()
  })

  it('lists sessions and wires delete all action', () => {
    sessionsListState = {
      loading: false,
      sessions: [{ id: 1, created_at: '2026-01-01', valid_thru: '2026-02-01', current: true }]
    }

    const { getByText } = renderWithProviders(<SessionsList />)
    fireEvent.click(getByText('Delete all sessions'))
    fireEvent.click(getByText('Accept'))
    expect(sessionsPropsRef.current.handleDeleteAllSessions).toHaveBeenCalledWith(true)
  })

  it('deletes a single session after confirmation', () => {
    sessionsListState = {
      loading: false,
      sessions: [
        { id: 1, created_at: '2026-01-01', valid_thru: '2026-02-01', current: false },
        { id: 2, created_at: '2026-01-02', valid_thru: '2026-02-02', current: true }
      ]
    }
    const { getAllByTestId, getByText } = renderWithProviders(<SessionsList />)
    fireEvent.click(getAllByTestId('icon-closeMd')[0])
    fireEvent.click(getByText('Accept'))
    expect(sessionsPropsRef.current.handleDeleteSession).toHaveBeenCalled()
  })

  it('hides session actions while loading', () => {
    sessionsListState = { loading: true, sessions: [] }
    const { queryByText } = renderWithProviders(<SessionsList />)
    expect(queryByText('Delete all sessions')).not.toBeInTheDocument()
  })
})
