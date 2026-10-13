import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../../__tests__/helpers/testUtils'
import { SatisfactionSurvey } from '../SatisfactionSurvey'

const requests = vi.hoisted(() => ({ order: vi.fn(), driver: vi.fn() }))

vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~components/contexts/ApiContext', () => ({
  useApi: () => [{ root: 'https://api.test/v400/en/demo', appId: 'web' }]
}))
vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ token: null, user: null }]
}))
vi.mock('~ui-icon', () => ({
  Icon: ({ name }) => <span data-testid={`icon-${name}`} />
}))
vi.mock('../surveyRequests', () => ({
  sendOrderSurvey: (...args) => requests.order(...args),
  sendDriverSurvey: (...args) => requests.driver(...args)
}))

const order = { id: 1, business_id: 5, driver: { id: 9, name: 'Luis' } }

const render = (overrides = {}) => renderWithProviders(<SatisfactionSurvey order={{ ...order, ...overrides }} hashKey='abc' image='/bag.png' />)

describe('SatisfactionSurvey', () => {
  beforeEach(() => {
    requests.order.mockReset().mockResolvedValue(true)
    requests.driver.mockReset().mockResolvedValue(true)
  })

  it('starts with the intro, the image and the rate action', () => {
    const { getByText, container } = render()
    expect(container.querySelector('img[src="/bag.png"]')).toBeTruthy()
    expect(getByText('Tell us how your delivery and order experience went.')).toBeInTheDocument()
    expect(getByText('Rate')).toBeInTheDocument()
  })

  it('shows the enjoy message when declined and thanks when the order was already reviewed', () => {
    const declined = render()
    fireEvent.click(declined.getByText('Not now'))
    expect(declined.getByText('Enjoy your order.')).toBeInTheDocument()
    declined.unmount()
    const reviewed = render({ review: { id: 1 } })
    expect(reviewed.getByText('Thank you for your feedback!')).toBeInTheDocument()
  })

  it('requires ratings plus a reason before sending, then sends both reviews with the guest hash', async () => {
    const { getByText, container, queryByText } = render()
    fireEvent.click(getByText('Rate'))
    const submit = container.querySelector('[data-doc-control="order-tracking-survey-submit"]')
    expect(submit.disabled).toBe(true)

    fireEvent.click(container.querySelector('[data-doc-control="order-tracking-survey-star-2"]'))
    expect(getByText('What was the problem?')).toBeInTheDocument()
    expect(getByText('Select at least one reason to continue.')).toBeInTheDocument()
    fireEvent.click(getByText('Bad taste'))
    expect(getByText('Answer both questions to send your feedback.')).toBeInTheDocument()

    fireEvent.click(container.querySelector('[data-doc-control="order-tracking-survey-thumb-up"]'))
    expect(getByText('What was the best part?')).toBeInTheDocument()
    fireEvent.click(getByText('Punctuality'))
    expect(queryByText('Answer both questions to send your feedback.')).toBeNull()
    expect(submit.disabled).toBe(false)

    fireEvent.click(submit)
    await waitFor(() => expect(getByText('Thank you for your feedback!')).toBeInTheDocument())
    expect(requests.order).toHaveBeenCalledWith(
      expect.objectContaining({ hashKey: 'abc' }),
      expect.objectContaining({ id: 1 }),
      expect.objectContaining({ stars: 2, chips: [expect.objectContaining({ key: 'bad_taste' })] })
    )
    expect(requests.driver).toHaveBeenCalledWith(
      expect.objectContaining({ hashKey: 'abc' }),
      expect.objectContaining({ id: 1 }),
      expect.objectContaining({ thumb: 'up', chips: [expect.objectContaining({ key: 'punctuality' })] })
    )
  })

  it('only asks about the product when there is no driver and shows the error when sending fails', async () => {
    requests.order.mockResolvedValue(false)
    const { getByText, container, queryByText } = render({ driver: null })
    fireEvent.click(getByText('Rate'))
    expect(queryByText('How was the delivery?')).toBeNull()
    fireEvent.click(container.querySelector('[data-doc-control="order-tracking-survey-star-5"]'))
    fireEvent.click(getByText('Good taste'))
    fireEvent.click(container.querySelector('[data-doc-control="order-tracking-survey-submit"]'))
    await waitFor(() => expect(getByText('We could not send your feedback. Please try again.')).toBeInTheDocument())
    expect(requests.driver).not.toHaveBeenCalled()
  })
})
