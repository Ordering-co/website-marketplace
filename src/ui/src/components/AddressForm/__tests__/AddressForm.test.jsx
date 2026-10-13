import { describe, expect, it, vi } from 'vitest'
import { createLanguageWrapper } from '../../../../../__tests__/helpers/languageTestUtils'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { AddressForm } from '../index'

const addressFixture = vi.hoisted(() => ({
  id: 1,
  address: '123 Main St',
  location: { lat: 40.7, lng: -74.0 }
}))

const formStateFixture = vi.hoisted(() => ({
  loading: false,
  changes: {}
}))

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: (fn) => fn,
    formState: { errors: {} },
    errors: {},
    setValue: vi.fn(),
    watch: vi.fn(() => ({}))
  })
}))
vi.mock('~components/components/GoogleAutocompleteInput', () => ({
  AutocompleteInput: (props) => <input data-testid='google-autocomplete' placeholder={props.placeholder} />
}))
vi.mock('~components/components/GoogleMaps', () => ({
  GoogleMaps: () => <div data-testid='google-maps' />
}))
vi.mock('~ui/src/components/GoogleGpsButton', () => ({
  GoogleGpsButton: () => <button type='button'>GPS</button>
}))

vi.mock('~components/components/AddressForm', () => ({
  AddressForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      addressesList={[]}
      googleMapsControls={{ center: { lat: 0, lng: 0 }, zoom: 15 }}
      formState={formStateFixture}
      addressState={{ address: addressFixture, loading: false }}
      isRequiredField={() => false}
      showField={() => true}
      updateChanges={vi.fn()}
      onCancel={vi.fn()}
      handleChangeInput={vi.fn()}
      saveAddress={vi.fn()}
      setIsEdit={vi.fn()}
      getSuggestedResult={vi.fn()}
      mapBoxSuggests={[]}
      retrieveSuggestResult={vi.fn()}
      {...rest}
    />
  )
}))

describe('AddressForm', () => {

  it.each([
    ['es', 'Inicio', 'Casa'],
    ['bg', 'Начало', 'Дом']
  ])('translates the address label independently and keeps its home tag in %s', async (code, nav, address) => {
    const handleChangeInput = vi.fn()
    const dictionary = { WEBSITE_HOME: nav, WEBSITE_ADDRESS_HOME: address }
    const { findByRole, queryByText, rerender } = renderWithProviders(
      <AddressForm handleChangeInput={handleChangeInput} />,
      { wrapper: createLanguageWrapper(dictionary, code) }
    )
    const button = await findByRole('button', { name: address })
    fireEvent.click(button)
    expect(handleChangeInput).toHaveBeenCalledWith({ target: { name: 'tag', value: 'home' } })
    expect(button).toHaveClass('active')
    dictionary.WEBSITE_HOME = 'Custom navigation label'
    rerender(<AddressForm handleChangeInput={handleChangeInput} />)
    expect(await findByRole('button', { name: address })).toHaveClass('active')
    expect(queryByText('Custom navigation label')).not.toBeInTheDocument()
  })

  it('uses an address fallback when only the legacy navigation key exists', async () => {
    const { findByRole, queryByText } = renderWithProviders(<AddressForm />, {
      wrapper: createLanguageWrapper({ WEBSITE_HOME: 'Inicio', WEBSITE_OFFICE: 'Oficina' }, 'es')
    })
    expect(await findByRole('button', { name: 'Oficina' })).toBeInTheDocument()
    expect(await findByRole('button', { name: 'Home' })).toBeInTheDocument()
    expect(queryByText('Inicio')).not.toBeInTheDocument()
  })

  it('renders address form fields', () => {
    const { getByTestId } = renderWithProviders(<AddressForm />)
    expect(getByTestId('google-autocomplete')).toBeInTheDocument()
  })
})
