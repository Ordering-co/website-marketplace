import { describe, expect, it } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { FilterAccordion } from '../index'

describe('FilterAccordion', () => {
  it('renders title and toggles children', () => {
    const { getByText, queryByText } = renderWithProviders(
      <FilterAccordion title='Price'>
        <div>accordion-body</div>
      </FilterAccordion>
    )
    expect(getByText('Price')).toBeInTheDocument()
    expect(queryByText('accordion-body')).not.toBeInTheDocument()
    fireEvent.click(getByText('Price'))
    expect(getByText('accordion-body')).toBeInTheDocument()
  })

  it('shows children when defaultOpen', () => {
    const { getByText, queryByText } = renderWithProviders(
      <FilterAccordion title='Distance' defaultOpen>
        <div>open-body</div>
      </FilterAccordion>
    )
    expect(queryByText('Distance')).not.toBeInTheDocument()
    expect(getByText('open-body')).toBeInTheDocument()
  })
})
