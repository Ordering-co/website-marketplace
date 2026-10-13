import { describe, expect, it, vi, beforeEach } from 'vitest'
import { sendOrderSurvey, sendDriverSurvey } from '../surveyRequests'

const auth = { ordering: { root: 'https://api.test/v400/en/demo', appId: 'web', appInternalName: 'website' }, token: null, hashKey: 'abc', userId: undefined }
const order = { id: 7, business_id: 5, driver: { id: 9 } }

describe('surveyRequests', () => {
  beforeEach(() => {
    global.fetch = vi.fn(async () => ({ json: async () => ({ error: false }) }))
  })

  it('posts the order review with the guest hash header and the tags', async () => {
    const ok = await sendOrderSurvey(auth, order, { stars: 4, chips: [{ key: 'good_taste' }], comment: ' nice ' })
    expect(ok).toBe(true)
    const [url, options] = global.fetch.mock.calls[0]
    expect(url).toBe('https://api.test/v400/en/demo/business/5/reviews')
    expect(options.headers['X-uuid-access-X']).toBe('abc')
    expect(options.headers.Authorization).toBeUndefined()
    expect(JSON.parse(options.body)).toEqual(expect.objectContaining({ order_id: 7, quality: 4, quality_tags: ['good_taste'], comment: 'nice' }))
  })

  it('posts the driver review with a bearer token when logged in and reports API errors', async () => {
    global.fetch = vi.fn(async () => ({ json: async () => ({ error: true }) }))
    const ok = await sendDriverSurvey({ ...auth, token: 'tok', userId: 3 }, order, { thumb: 'down', chips: [{ key: 'delivery_time' }], comment: '' })
    expect(ok).toBe(false)
    const [url, options] = global.fetch.mock.calls[0]
    expect(url).toBe('https://api.test/v400/en/demo/users/9/user_reviews')
    expect(options.headers.Authorization).toBe('Bearer tok')
    expect(options.headers['X-uuid-access-X']).toBeUndefined()
    expect(JSON.parse(options.body)).toEqual(expect.objectContaining({ user_id: 9, qualification: 1, tags: ['delivery_time'] }))
    expect(JSON.parse(options.body).comment).toBeUndefined()
  })
})
