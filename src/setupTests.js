import React from 'react'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

expect.extend(matchers)

const stableContext = vi.hoisted(() => {
  const t = (_key, fallback) => fallback
  const languageState = { language: { code: 'en' } }
  const configs = {
    order_types_allowed: { value: '1|2|3|4|5' },
    preorder_status_enabled: { value: '1' }
  }
  const ordering = {
    project: 'demo',
    root: 'https://api.ordering.test',
    appId: 'marketplace-test',
    pages: vi.fn(() => ({
      get: vi.fn().mockResolvedValue({
        content: { error: false, result: { body: '<p>Footer content</p>', enabled: true } }
      })
    })),
    languages: vi.fn(() => ({
      where: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue({ content: { result: [] } })
    }))
  }
  const user = {}
  const login = vi.fn()
  const showToast = vi.fn()
  const setOrdering = vi.fn()
  const emit = vi.fn()
  const events = { emit, on: vi.fn(), off: vi.fn() }

  return {
    languageTuple: [languageState, t],
    configTuple: [{ configs }],
    sessionTuple: [{ auth: false, user, token: 'test-token' }, { login }],
    toastTuple: [[], { showToast }],
    apiTuple: [[ordering], { setOrdering }],
    optimizationTuple: [{ loading: false, result: { configs } }],
    eventTuple: [events],
    recaptchaTuple: [{ version: 'v3', siteKey: 'key' }],
    orderTuple: [{ options: { type: 1 }, carts: {} }, { refreshOrderOptions: vi.fn() }],
    customerTuple: [{}, { deleteUserCustomer: vi.fn() }],
    businessTuple: [{ business: {} }, { setBusiness: vi.fn() }],
    utilsTuple: [{
      parseDate: (value) => value || 'now',
      parseTime: vi.fn(),
      parsePrice: (value) => `$${value}`,
      parseDistance: (value) => `${value} mi`,
      optimizeImage: (url) => url,
      timeFormat: 'HH:mm',
      is12Hours: false,
      preorderDateFormat: 'MM/DD',
      getMaxPreorderDays: () => 7,
      isWalletEnabled: () => true
    }],
    siteTuple: [{ site: { business_url_template: '/store/:business_slug', product_url_template: '/store/:business_slug?category=:category_id&product=:product_id' } }],
    configs,
    ordering,
    user
  }
})

vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => stableContext.languageTuple
}))
vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => stableContext.configTuple
}))
vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => stableContext.sessionTuple
}))
vi.mock('~components/contexts/ToastContext', () => ({
  useToast: () => stableContext.toastTuple,
  ToastType: { Error: 'error', Success: 'success', Info: 'info' }
}))
vi.mock('~components/contexts/ApiContext', () => ({
  useApi: () => stableContext.apiTuple
}))
vi.mock('~components/contexts/OptimizationLoadContext', () => ({
  useOptimizationLoad: () => stableContext.optimizationTuple
}))
vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => stableContext.eventTuple
}))
vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => stableContext.orderTuple
}))
vi.mock('~components/contexts/CustomerContext', () => ({
  useCustomer: () => stableContext.customerTuple
}))
vi.mock('~components/contexts/BusinessContext', () => ({
  useBusiness: () => stableContext.businessTuple
}))
vi.mock('~components/contexts/UtilsContext', () => ({
  useUtils: () => stableContext.utilsTuple
}))
vi.mock('~components/contexts/SiteContext', () => ({
  useSite: () => stableContext.siteTuple
}))
vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid='swiper'>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>
}))
vi.mock('swiper/modules', () => ({ Navigation: {}, Pagination: {}, Thumbs: {} }))
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/navigation', () => ({}))
vi.mock('swiper/css/pagination', () => ({}))

vi.mock('~components/components/Popup', () => ({
  Popup: ({ UIComponent, ...rest }) => (UIComponent ? <UIComponent {...rest} /> : null)
}))
vi.mock('~components/components/FirebaseGoogleLoginButton', () => ({
  FirebaseGoogleLoginButton: ({ UIComponent, ...rest }) => (UIComponent ? <UIComponent {...rest} /> : null)
}))

vi.mock('~ui/hooks/useRecaptcha', () => ({
  useRecaptcha: () => stableContext.recaptchaTuple
}))
vi.mock('~ui/hooks/useCountdownTimer', () => ({
  useCountdownTimer: () => [600, vi.fn(), vi.fn()]
}))
vi.mock('~ui/hooks/useWindowSize', () => ({
  useWindowSize: () => ({ width: 1024, height: 768 })
}))
vi.mock('~ui/hooks/useOnlineStatus', () => ({
  useOnlineStatus: () => true
}))
vi.mock('~ui/src/components/SpinnerLoader', () => ({
  SpinnerLoader: () => <div data-testid='spinner'>loading</div>
}))
vi.mock('~ui/src/components/InputPhoneNumber', () => ({
  InputPhoneNumber: ({ setValue }) => (
    <input data-testid='phone-input' onChange={(e) => setValue?.(e.target.value, true)} />
  )
}))
vi.mock('react-otp-input', () => ({
  default: ({ value, onChange }) => (
    <input data-testid='otp-input' value={value} onChange={(e) => onChange(e.target.value)} />
  )
}))

vi.mock('react-phone-number-input', () => ({
  default: () => null,
  parsePhoneNumber: () => null,
  isValidPhoneNumber: () => true,
  formatPhoneNumber: (v) => v,
  formatPhoneNumberIntl: (v) => v
}))
vi.mock('react-phone-number-input/min', () => ({
  default: () => null
}))
vi.mock('react-phone-number-input/input', () => ({
  default: () => null
}))

vi.mock('libphonenumber-js', () => ({
  default: () => null,
  parsePhoneNumber: (value) => {
    if (!value) return null
    return {
      nationalNumber: String(value).replace(/\D/g, '').slice(-10) || '5551234567',
      countryCallingCode: '1'
    }
  }
}))

vi.mock('react-loading-skeleton', () => ({
  default: (props) => <div data-testid='skeleton' data-height={props?.height} />
}))

vi.mock('~ui/utils', () => ({
  getTraduction: (_key, fallback) => fallback,
  formatSeconds: (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  },
  sortInputFields: ({ values } = {}) => {
    if (Array.isArray(values)) return values
    if (values && typeof values === 'object') return Object.values(values)
    return []
  },
  checkSiteUrl: (url, fallback) => {
    if (!url) return fallback
    return url[0] === '/' ? url : `/${url}`
  },
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  verifyDecimals: (rate) => `${rate}`,
  getIconCard: () => null,
  getHourMin: (hour, min) => `${hour || 0}h ${min || 0}m`,
  getOrderStatusPrefix: () => '',
  getDistance: () => 0,
  getCateringValues: () => ({}),
  lightenDarkenColor: (color) => color || '#000000',
  shape: {
    rectangle: 'rectangle',
    rectangleRound: 'rectangle_round',
    capsuleShape: 'capsule_shape'
  },
  generalUtilities: () => ({
    convertHoursToMinutes: (time) => time || '0 min',
    getTypes: (business) => business?.types?.map((type) => type.name).join(', ') || '',
    getOrderType: () => 'Delivery',
    getOrderStatus: () => 'Pending',
    getStatusPrefix: () => '',
    orderTypes: [],
    orderTypeList: [],
    walletName: {},
    getIconCard: () => null
  }),
  orderTypeList: ['delivery', 'pickup', 'eatin', 'curbside', 'drivethru', 'seatdelivery'],
  scrollTo: vi.fn(),
  getTimes: () => [{ value: '12:00', text: '12:00' }],
  reviewCommentList: () => ({
    like: [{ key: 0, content: 'Tasty' }],
    dislike: [{ key: 0, content: 'Not tasty' }]
  })
}))

vi.mock('@loadable/component', () => ({
  default: (loader) => {
    const Component = (props) => {
      const resolved = typeof loader === 'function' ? loader() : loader
      if (resolved && typeof resolved.then === 'function') {
        return null
      }
      const Loaded = resolved?.default || resolved
      return Loaded ? <Loaded {...props} /> : null
    }
    Component.displayName = 'LoadableMock'
    return Component
  }
}))

vi.mock('~ui/src/components/Confirm', () => ({
  Alert: ({ open, content }) => (open ? <div data-testid='alert'>{content}</div> : null),
  Confirm: ({ open, content, onAccept, acceptText = 'Accept' }) => (
    open
      ? (
        <div data-testid='confirm'>
          {content}
          <button type='button' onClick={onAccept}>{acceptText}</button>
        </div>
        )
      : null
  )
}))

vi.mock('~ui-icon', () => ({
  Icon: ({ name, onClick }) => (
    <span data-testid={`icon-${name}`} onClick={onClick} role={onClick ? 'button' : undefined} />
  )
}))

vi.mock('~components/components/ReCaptcha', () => ({
  ReCaptcha: () => null
}))

vi.mock('~ui/src/components/LoginForm/styles', async () => {
  return await import('./ui/src/components/__tests__/mocks/loginFormStyles.mock.js')
})
vi.mock('~ui/src/components/SignUpForm/styles', async () => {
  return await import('./ui/src/components/__tests__/mocks/signUpFormStyles.mock.js')
})
vi.mock('~ui/src/components/UserVerification/styles', async () => {
  return await import('./ui/src/components/__tests__/mocks/userVerificationStyles.mock.js')
})

const createMemoryStorage = () => {
  const store = new Map()
  return {
    get length () {
      return store.size
    },
    clear () {
      store.clear()
    },
    getItem (key) {
      return store.has(String(key)) ? store.get(String(key)) : null
    },
    key (index) {
      return Array.from(store.keys())[index] ?? null
    },
    removeItem (key) {
      store.delete(String(key))
    },
    setItem (key, value) {
      store.set(String(key), String(value))
    }
  }
}

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  writable: true,
  value: createMemoryStorage()
})
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  writable: true,
  value: window.localStorage
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

global.IntersectionObserver = class IntersectionObserver {
  observe () {}
  unobserve () {}
  disconnect () {}
}

global.ResizeObserver = class ResizeObserver {
  observe () {}
  unobserve () {}
  disconnect () {}
}

window.scroll = window.scroll || (() => {})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  window.localStorage.clear()
})
