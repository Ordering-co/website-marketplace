import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { SignUpApproval } from '../index'

vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

const baseProps = {
  content: {
    project: 'demo',
    dashboardUrl: 'https://dashboard.example.com',
    dashboardLoginUrl: 'https://dashboard.example.com/login',
    approvalType: 'automatic',
    businessType: 2,
    contactEmail: 'support@example.com'
  },
  onAccept: vi.fn(),
  onCancel: vi.fn()
}

describe('SignUpApproval', () => {
  it('renders automatic business approval content', () => {
    const { getByText } = renderWithProviders(<SignUpApproval {...baseProps} />, {
      theme: {
        colors: { primary: '#000' },
        fonts: { primary: { name: 'Helvetica' } },
        images: {
          general: {
            CongratulationApproval: '/approval.png',
            CongratulationNoApproval: '/no-approval.png',
            driverCongratulationApproval: '/driver-approval.png',
            driverCongratulationNoApproval: '/driver-no-approval.png'
          }
        }
      }
    })

    expect(getByText(/Get in our Dashboard/)).toBeInTheDocument()
    expect(getByText('(demo)')).toBeInTheDocument()
  })

  it('fires accept and cancel callbacks', () => {
    const onAccept = vi.fn()
    const onCancel = vi.fn()
    const { getByText } = renderWithProviders(
      <SignUpApproval {...baseProps} onAccept={onAccept} onCancel={onCancel} />,
      {
        theme: {
          colors: { primary: '#000' },
          fonts: { primary: { name: 'Helvetica' } },
          images: { general: { CongratulationApproval: '/approval.png' } }
        }
      }
    )

    fireEvent.click(getByText('Cancel'))
    fireEvent.click(getByText('Accept'))
    expect(onCancel).toHaveBeenCalled()
    expect(onAccept).toHaveBeenCalled()
  })
})
