import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useTheme } from 'styled-components'
import { BusinessTypeFilter as BusinessTypeFilterController } from '~components/components/BusinessTypeFilter'
import { useLanguage } from '~components/contexts/LanguageContext'

import { Tabs, Tab } from '../../styles/Tabs'
import { Button } from '../../styles/Buttons'
import { TypeContainer, ImageContainer, PillCategoriesRow, PillSkeletonRow } from './styles'
import { AutoScroll } from '../AutoScroll'

const BusinessTypesUI = (props) => {
  const {
    typesState,
    currentTypeSelected,
    handleChangeBusinessType
  } = props
  const { loading, error, types } = typesState
  const [, t] = useLanguage()
  const theme = useTheme()
  const [load, setLoad] = useState(false)

  const defaultImage = (name) => theme.images?.categories?.[name.toLowerCase()]

  const hasAnyCategoryImage = types?.some(
    (type) => type.enabled && Boolean(type.image)
  ) ?? false
  const usePillLayout = !loading && !error && types?.length > 0 && !hasAnyCategoryImage

  const handleChangeCategory = (category) => {
    handleChangeBusinessType && handleChangeBusinessType(category)
  }

  const getCategoryLabel = (type) =>
    t(`BUSINESS_TYPE_${type.name.replace(/\s/g, '_').toUpperCase()}`, type.name)

  return (
    <>
      <TypeContainer id='container' $pillMode={usePillLayout || loading}>
        {loading && (
          <PillSkeletonRow style={styles.wrapperSkeleton}>
            {[...Array(6)].map((_, i) => (
              <Skeleton id='skeleton' key={i} height={36} width={90} borderRadius={50} />
            ))}
          </PillSkeletonRow>
        )}
        {usePillLayout && (
          <PillCategoriesRow>
            {types.map((type) => type.enabled && (
              <Button
                key={type.id}
                color={type.id === currentTypeSelected ? 'green' : 'lightGray'}
                onClick={() => handleChangeCategory(type.id)}
              >
                {getCategoryLabel(type)}
              </Button>
            ))}
          </PillCategoriesRow>
        )}
        {!loading && !error && types && types.length > 0 && !usePillLayout && (
          <Tabs variant='primary' disableBackground>
            <AutoScroll>
              {types.map((type) => type.enabled && (
                <Tab
                  key={type.id}
                  active={type.id === currentTypeSelected}
                  className='category'
                  onClick={() => handleChangeCategory(type.id)}
                >
                  {type.name !== 'All' && !!(type.image || defaultImage(type.name)) && (
                    <ImageContainer
                      active={type.id === currentTypeSelected}
                      load={load}
                    >
                      <img
                        src={type.image || defaultImage(type.name)}
                        alt={type.name.toLowerCase()}
                        onLoad={() => setLoad(true)}
                        width='150px'
                        height='150px'
                        loading='lazy'
                      />
                    </ImageContainer>
                  )}
                  <span className='category-name'>{getCategoryLabel(type)}</span>
                </Tab>
              ))}
            </AutoScroll>
          </Tabs>
        )}
      </TypeContainer>
    </>
  )
}

const styles = {
  wrapperSkeleton: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  }
}

export const BusinessTypes = (props) => {
  const businessTypeFilterProps = {
    ...props,
    UIComponent: BusinessTypesUI,
    defaultBusinessType: props.defaultBusinessType || null,
    onChangeBusinessType: props.handleChangeBusinessType
  }

  return (
    <BusinessTypeFilterController {...businessTypeFilterProps} />
  )
}
