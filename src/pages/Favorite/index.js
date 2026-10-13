import React from 'react'
import { HelmetTags } from '../../components/HelmetTags'

import { Favorite as FavoriteController } from '~ui/src/components/Favorite'

export const Favorite = (props) => {
  return (
    <>
      <HelmetTags page='favorite' />
      <FavoriteController {...props} />
    </>
  )
}

export default Favorite
