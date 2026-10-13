import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { professionalFixture } from '../../../__tests__/helpers/ordersTestMocks'
import { PreviousProfessionalOrdered } from '../index'

vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>
}))

vi.mock('~ui/src/components/SingleProfessionalCard', () => ({
  SingleProfessionalCard: ({ professional }) => <div>{professional.name}</div>
}))

describe('PreviousProfessionalOrdered', () => {
  it('renders previously ordered professionals', () => {
    const { getByText } = renderWithProviders(
      <PreviousProfessionalOrdered professionals={[professionalFixture]} handleUpdateProfessionals={vi.fn()} />
    )
    expect(getByText('Dr. Smith')).toBeInTheDocument()
  })
})
