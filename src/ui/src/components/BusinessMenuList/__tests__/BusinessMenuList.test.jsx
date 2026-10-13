import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { BusinessMenuList } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/styles/Select', () => ({
  Select: ({ options = [] }) => (
    <div data-testid='menu-select'>
      {options.map((opt) => <span key={opt.value}>{opt.content}</span>)}
    </div>
  )
}))

const menuState = vi.hoisted(() => ({
  current: {
    loading: false,
    menus: [{ id: 1, name: 'Lunch' }, { id: 2, name: 'Dinner' }]
  }
}))

vi.mock('~components/components/BusinessMenuListing', () => ({
  BusinessMenuListing: ({ UIComponent, ...rest }) => (
    <UIComponent
      businessMenuList={menuState.current}
      setMenu={vi.fn()}
      {...rest}
    />
  )
}))

describe('BusinessMenuList', () => {
  beforeEach(() => {
    menuState.current = {
      loading: false,
      menus: [{ id: 1, name: 'Lunch' }, { id: 2, name: 'Dinner' }]
    }
  })

  it('renders menu options when loaded', () => {
    const { getByText } = renderWithProviders(<BusinessMenuList />)
    expect(getByText('Lunch')).toBeInTheDocument()
    expect(getByText('Dinner')).toBeInTheDocument()
  })
})
