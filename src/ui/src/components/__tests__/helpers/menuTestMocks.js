import React from 'react'
import { vi } from 'vitest'

export const mockSwiper = () => {
  vi.mock('swiper/react', () => ({
    Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
    SwiperSlide: ({ children, onClick }) => (
      <div data-testid='swiper-slide' onClick={onClick} role='button'>
        {children}
      </div>
    )
  }))
  vi.mock('swiper/modules', () => ({ Navigation: {}, Pagination: {}, Thumbs: {} }))
  vi.mock('swiper/css', () => ({}))
  vi.mock('swiper/css/navigation', () => ({}))
  vi.mock('swiper/css/pagination', () => ({}))
}

export const mockSkeleton = () => {
  vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
  vi.mock('react-loading-skeleton', () => ({
    default: () => <div data-testid='skeleton' />
  }))
}

export const businessFixture = {
  id: 1,
  name: 'Demo Store',
  slug: 'demo-store',
  logo: 'logo.png',
  enabled: true,
  schedule: Array.from({ length: 7 }, () => ({ enabled: true, lapses: [{ open: { hour: 8, minute: 0 }, close: { hour: 22, minute: 0 } }] }))
}

export const productFixture = {
  id: 10,
  name: 'Burger',
  price: 9.5,
  images: 'burger.jpg'
}
