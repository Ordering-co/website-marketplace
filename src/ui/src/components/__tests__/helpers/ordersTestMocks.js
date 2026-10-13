export const sampleBusiness = {
  id: 1,
  name: 'Pizza Place',
  slug: 'pizza-place',
  logo: 'logo.png',
  available: true,
  header: 'header.png'
}

export const sampleOrder = {
  id: 42,
  uuid: 'order-uuid-42',
  status: 9,
  delivery_type: 1,
  total: 15.5,
  summary: { total: 15.5 },
  created_at: '2026-07-01T12:00:00Z',
  delivery_datetime: '2026-07-01T13:00:00Z',
  delivery_datetime_utc: '2026-07-01T17:00:00Z',
  favorite: false,
  review: null,
  cart: true,
  business_id: 1,
  business: sampleBusiness,
  products: [{ id: 10, name: 'Cheese Slice', price: 5 }],
  driver: { name: 'Alex', last_name: 'Driver', photo: 'driver.png' },
  customer: { address: '123 Main St' }
}

export const pastOrder = {
  ...sampleOrder,
  id: 41,
  uuid: 'order-uuid-41',
  status: 1,
  delivery_datetime_utc: '2026-06-28T17:00:00Z'
}

export const activeOrder = {
  ...sampleOrder,
  id: 43,
  uuid: 'order-uuid-43',
  status: 9
}

export const sampleProductReorder = {
  id: 100,
  name: 'Cheese Slice',
  price: 5,
  inventoried: false,
  quantity: 10,
  business: sampleBusiness,
  category_id: 10,
  product_id: 100
}

export const professionalFixture = {
  id: 1,
  name: 'Dr. Smith',
  lastname: 'Jones',
  image: 'pro.png'
}

export const paginationFixture = {
  currentPage: 1,
  totalPages: 2
}

export const orderListFixture = {
  loading: false,
  error: null,
  orders: [pastOrder]
}

export const getOrderStatus = (status) => ({ value: `Status ${status}`, percentage: 0.5 })
