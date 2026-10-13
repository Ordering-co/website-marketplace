import { vi } from 'vitest'

export const sampleGiftCard = {
  id: 1,
  status: 'pending',
  created_at: '2026-07-01T12:00:00Z',
  order_product: {
    name: '$25 Gift Card',
    price: 25,
    order_id: 10,
    images: 'https://cdn.test/gift.jpg'
  }
}

export const sampleGiftProduct = {
  id: 1,
  name: '$25 Gift Card',
  price: 25
}

export const giftCardsListFixture = {
  loading: false,
  list: [sampleGiftCard]
}

export const giftCardPaginationFixture = {
  totalPages: 1,
  currentPage: 1
}

export const purchaseGiftCardFixture = {
  productsListState: { loading: false, products: [sampleGiftProduct] },
  selectedProduct: null,
  setSelectedProduct: vi.fn(),
  handleAccept: vi.fn(),
  isPage: true
}

export const redeemGiftCardFixture = {
  actionState: { loading: false, error: null },
  redeemedGiftCard: null,
  handleApply: vi.fn(),
  onClose: vi.fn(),
  hideTopPlaceholders: true
}

export const sendGiftCardFixture = {
  actionState: { loading: false, error: null },
  handleSendGiftCard: vi.fn()
}

export const schoolBusinessFixture = {
  id: 1,
  slug: 'test-school',
  vertical: 'school',
  name: 'Test School'
}

export const sampleStudent = {
  id: 7,
  name: 'Ada',
  lastname: 'Lovelace',
  school_id: 1,
  school: { id: 1, name: 'Test School' },
  classroom: { id: 10, name: 'Room A' },
  grade: { id: 5, name: '5th' },
  allergies: [],
  dietary_tags: []
}

export const secondStudent = {
  id: 8,
  name: 'Grace',
  lastname: 'Hopper',
  school_id: 1,
  school: { id: 1, name: 'Test School' },
  classroom: { id: 11, name: 'Room B' },
  grade: { id: 6, name: '6th' },
  allergies: [],
  dietary_tags: []
}

export const sampleSchool = {
  id: 1,
  name: 'Test School',
  classrooms: [{ id: 10, name: 'Room A' }],
  grades: [{ id: 5, name: '5th' }]
}

export const studentOrderFixture = {
  id: 42,
  student_id: 7,
  student: sampleStudent
}

export const schoolStudentsHookFixture = {
  students: [sampleStudent, secondStudent],
  loading: false,
  loaded: true,
  refresh: vi.fn(),
  createStudent: vi.fn().mockResolvedValue({ error: false, result: sampleStudent }),
  updateStudent: vi.fn().mockResolvedValue({ error: false, result: sampleStudent })
}

export const schoolsHookFixture = {
  schools: [sampleSchool],
  loading: false
}
