import { vi } from 'vitest'
import { businessFixture, productFixture } from './menuTestMocks'

export const cartFixture = {
  uuid: 'cart-1',
  business_id: 1,
  products: [{ ...productFixture, code: 'BRG-1' }],
  valid_address: true,
  valid_maximum: true,
  minimum: 0,
  subtotal: 9.5
}

export const addressFixture = {
  id: 1,
  address: '123 Main St',
  location: { lat: 40.7, lng: -74.0 }
}

export const studentFixture = {
  id: 1,
  name: 'Jane',
  lastname: 'Doe',
  allergies: ['peanut'],
  dietary_tags: ['vegetarian']
}

export const orderTypesFixture = [
  { value: 1, text: 'Delivery', image: 'delivery.png' },
  { value: 2, text: 'Pickup', image: 'pickup.png' }
]

export const mockPopper = () => {
  vi.mock('react-popper', () => ({
    usePopper: () => ({
      styles: { popper: {}, arrow: {} },
      attributes: { popper: {}, arrow: {} }
    })
  }))
}

export { businessFixture, productFixture }
