import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { pastOrder } from '../../__tests__/helpers/ordersTestMocks'
import { ReviewTrigger } from '../index'

describe('ReviewTrigger', () => {
  it('renders review prompt and calls handleOpenOrderReview', () => {
    const handleOpenOrderReview = vi.fn()
    const { getByText } = renderWithProviders(
      <ReviewTrigger order={pastOrder} handleOpenOrderReview={handleOpenOrderReview} />
    )
    expect(getByText(/Your feedback is very important/i)).toBeInTheDocument()
    expect(getByText('Pizza Place')).toBeInTheDocument()
    fireEvent.click(getByText('Review'))
    expect(handleOpenOrderReview).toHaveBeenCalledWith(5)
  })
})
