export const checkoutCartFixture = {
  uuid: 'cart-1',
  status: 0,
  business_id: 1,
  business: { id: 1, name: 'Demo Store', slug: 'demo-store', logo: 'logo.png' },
  products: [{ id: 10, name: 'Burger', code: 'BRG-1', price: 9.5 }],
  total: 9.5,
  subtotal: 9.5
}

export const feeFixture = {
  name: 'Service Fee',
  fixed: 0,
  percentage: 0,
  summary: { amount: 2.5 }
}

export const taxFixture = {
  id: 1,
  name: 'Sales Tax',
  rate: 8.5,
  target: 'product',
  type: 2,
  summary: { tax: 1.2 }
}

export const walletFixture = {
  id: 1,
  type: 'cash',
  balance: 25,
  name: 'Wallet credits'
}

export const paymethodFixture = {
  id: 1,
  name: 'Cash',
  gateway: 'cash',
  paymethod: { gateway: 'cash' }
}

export const studentFixture = {
  id: 1,
  name: 'Jane',
  lastname: 'Doe',
  school_id: 1,
  allergies: ['peanut'],
  dietary_tags: ['vegetarian']
}
