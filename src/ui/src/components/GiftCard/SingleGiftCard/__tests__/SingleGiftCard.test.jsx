import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { sampleGiftCard } from '../../../__tests__/helpers/giftCardStudentTestMocks'
import { SingleGiftCard } from '../index'

const emit = vi.hoisted(() => vi.fn())

vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit, on: vi.fn(), off: vi.fn() }]
}))

describe('SingleGiftCard', () => {
  it('renders gift card details', () => {
    const { getByText } = renderWithProviders(
      <SingleGiftCard card={sampleGiftCard} />
    )
    expect(getByText('$25 Gift Card')).toBeInTheDocument()
    expect(getByText('$25')).toBeInTheDocument()
    expect(getByText('Pending')).toBeInTheDocument()
  })

  it('emits order detail navigation on click', () => {
    const { getByText } = renderWithProviders(
      <SingleGiftCard card={sampleGiftCard} />
    )
    fireEvent.click(getByText('$25 Gift Card'))
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'order_detail',
      params: { orderId: 10 }
    })
  })

  it('renders skeleton placeholder when loading', () => {
    const { getAllByTestId } = renderWithProviders(<SingleGiftCard isSkeleton />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })
})
