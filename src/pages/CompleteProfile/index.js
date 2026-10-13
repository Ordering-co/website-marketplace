import React from 'react'
import { HelmetTags } from '../../components/HelmetTags'
import { CompleteProfile as CompleteProfileController } from '~ui/src/components/CompleteProfile'
import { useProfileCompletion } from '../../contexts/CheckoutFieldsContext'

export const CompleteProfile = (props) => {
  const { missingFields, checkoutFields, canSkip, skip } = useProfileCompletion()

  return (
    <>
      <HelmetTags page='complete-profile' />
      <CompleteProfileController
        {...props}
        missingFields={missingFields}
        checkoutFields={checkoutFields}
        canSkip={canSkip}
        onSkip={skip}
      />
    </>
  )
}

export default CompleteProfile
