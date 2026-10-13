import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../__tests__/helpers/testUtils'
import { AddressMapBoxList } from '../index'

const retrieveSuggestResult = vi.hoisted(() => vi.fn())
const handleChangeAddress = vi.hoisted(() => vi.fn())
const handleChangeInput = vi.hoisted(() => vi.fn())
const setAddressValue = vi.hoisted(() => vi.fn())
const onBlurInput = vi.hoisted(() => vi.fn())

describe('AddressMapBoxList', () => {
  it('renders suggestions and handles selection', () => {
    retrieveSuggestResult.mockClear()
    const suggests = [
      { mapbox_id: 'mb-1', full_address: '123 Main St, NY' },
      { mapbox_id: 'mb-2', name: 'Broadway' }
    ]
    const { getByText } = renderWithProviders(
      <AddressMapBoxList
        mapBoxSuggests={suggests}
        retrieveSuggestResult={retrieveSuggestResult}
        handleChangeAddress={handleChangeAddress}
        handleChangeInput={handleChangeInput}
        setAddressValue={setAddressValue}
        onBlurInput={onBlurInput}
      />
    )
    fireEvent.click(getByText('123 Main St, NY'))
    expect(retrieveSuggestResult).toHaveBeenCalledWith('mb-1', handleChangeAddress)
    expect(setAddressValue).toHaveBeenCalledWith('123 Main St, NY')
    expect(onBlurInput).toHaveBeenCalled()
  })
})
