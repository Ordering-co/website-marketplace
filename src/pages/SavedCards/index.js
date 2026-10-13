import React from 'react'
import { HelmetTags } from '../../components/HelmetTags'

import { SavedCards as SavedCardsController } from '~ui/src/components/SavedCards'

export const SavedCards = (props) => {
  return (
    <>
      <HelmetTags page='cards' />
      <SavedCardsController {...props} />
    </>
  )
}

export default SavedCards
