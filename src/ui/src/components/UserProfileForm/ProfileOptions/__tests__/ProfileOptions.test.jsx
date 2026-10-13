import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { ProfileOptions } from '../index'

describe('ProfileOptions', () => {
  it('renders profile navigation tabs', () => {
    const { getByText } = renderWithProviders(<ProfileOptions value='account' />)
    expect(getByText('My Account')).toBeInTheDocument()
    expect(getByText('My orders')).toBeInTheDocument()
  })
})
