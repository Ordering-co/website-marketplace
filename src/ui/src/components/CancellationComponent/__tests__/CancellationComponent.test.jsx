import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CancellationComponent } from '../index'

const Button = ({ children, ...props }) => <button type='button' {...props}>{children}</button>
const Input = (props) => <input {...props} />

describe('CancellationComponent', () => {
  it('renders outage title and contact actions', () => {
    const { getByText } = renderWithProviders(
      <CancellationComponent ButtonComponent={Button} InputComponent={Input} />
    )
    expect(getByText('SITE OUT OF SERVICE')).toBeInTheDocument()
    expect(getByText('Contact us')).toBeInTheDocument()
    expect(getByText('Send')).toBeInTheDocument()
  })
})
