import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PlaceSpot } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/styles/Select', () => ({
  Select: ({ options = [] }) => (
    <div data-testid='select'>
      {options.map((opt) => <span key={opt.content}>{opt.content}</span>)}
    </div>
  )
}))

vi.mock('~components/components/PlaceSpot', () => ({
  PlaceSpot: ({ UIComponent, ...rest }) => (
    <UIComponent
      cart={{
        delivery_type: 3,
        place: { place_group_id: 1, id: 1 },
        place_id: 1
      }}
      orderTypes={[{ id: 3, name: 'Eat in' }]}
      placesState={{
        loading: false,
        placeGroups: [{ id: 1, name: 'Tables', enabled: true }],
        places: [{ id: 1, name: 'Table 1', enabled: true, place_group_id: 1 }]
      }}
      spotNumber=''
      spotState={{}}
      isCheckout={false}
      vehicle=''
      isInputMode={false}
      onClose={vi.fn()}
      setSpotNumber={vi.fn()}
      setVehicle={vi.fn()}
      setSpotState={vi.fn()}
      handleChangeSpot={vi.fn()}
      setHasBusinessPlaces={vi.fn()}
      setPlaceSpotNumber={vi.fn()}
      {...rest}
    />
  )
}))

describe('PlaceSpot', () => {
  it('renders spot selection title', () => {
    const { getByText } = renderWithProviders(<PlaceSpot />)
    expect(getByText(/Select your table/i)).toBeInTheDocument()
  })
})
