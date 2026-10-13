import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { Dropdown, DropdownToggle, DropDownMenu } from '../index'

describe('Dropdown', () => {
  it('renders toggle and menu children', () => {
    const { getByText } = renderWithProviders(
      <Dropdown open>
        <DropdownToggle>Toggle menu</DropdownToggle>
        <DropDownMenu>Menu item</DropDownMenu>
      </Dropdown>
    )
    expect(getByText('Toggle menu')).toBeInTheDocument()
    expect(getByText('Menu item')).toBeInTheDocument()
  })
})
