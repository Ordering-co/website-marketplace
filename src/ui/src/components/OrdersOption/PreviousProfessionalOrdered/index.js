import React from 'react'

import {
  ProductsList,
  ProductsListContainer
} from './styles'

import { AutoScroll } from '~ui/src/components/AutoScroll'
import { SingleProfessionalCard } from '~ui/src/components/SingleProfessionalCard'

export const PreviousProfessionalOrdered = (props) => {
  const {
    professionals,
    handleUpdateProfessionals
  } = props

  return (
    <ProductsListContainer isLoading={professionals?.length < 1}>
      <ProductsList>
        <AutoScroll>
          {professionals?.map(professional => (
            <SingleProfessionalCard
              key={professional?.id}
              professional={professional}
              handleUpdateProfessionals={handleUpdateProfessionals}
            />
          ))}
        </AutoScroll>
      </ProductsList>
    </ProductsListContainer>
  )
}
