import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { sampleBusiness } from '../../../__tests__/helpers/ordersTestMocks'
import { PreviousBusinessOrdered } from '../index'

vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>
}))

vi.mock('~ui/src/components/BusinessController', () => ({
  BusinessController: ({ business }) => <div>{business.name}</div>
}))

describe('PreviousBusinessOrdered', () => {
  it('renders previously ordered businesses', () => {
    const { getByText } = renderWithProviders(
      <PreviousBusinessOrdered
        businesses={{ loading: false, result: [sampleBusiness] }}
        onRedirectPage={vi.fn()}
        handleUpdateBusinesses={vi.fn()}
      />
    )
    expect(getByText('Pizza Place')).toBeInTheDocument()
  })
})
