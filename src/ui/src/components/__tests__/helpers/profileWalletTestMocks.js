export const userFixture = {
  id: 1,
  name: 'Jane',
  lastname: 'Doe',
  email: 'jane@example.com',
  cellphone: '+12025550123',
  photo: 'avatar.png',
  addresses: []
}

export const formStateFixture = {
  loading: false,
  changes: { name: 'Jane', email: 'jane@example.com' },
  result: { error: false }
}

export const validationFieldsFixture = {
  loading: false,
  fields: []
}

export const walletFixture = {
  id: 1,
  type: 'cash',
  balance: 25,
  name: 'Cash Wallet'
}

export const walletListFixture = {
  loading: false,
  wallets: [walletFixture, { id: 2, type: 'credit_point', balance: 100 }]
}

export const walletTransactionFixture = {
  amount: 10,
  created_at: '2026-07-01T12:00:00Z',
  description: 'Top up',
  event_type: 'credit'
}

export const serviceProductFixture = {
  id: 50,
  name: 'Haircut',
  price: 45,
  duration: 30,
  description: 'Professional haircut',
  gallery: ['photo.jpg'],
  calendar_event: null
}
