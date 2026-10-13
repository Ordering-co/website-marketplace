import React from 'react'
import { useTheme } from 'styled-components'
import { SearchIconWrapper, SearchWrapper, WrapperSearch } from './styles'
import { Select } from '~ui/src/styles/Select'
import { Icon } from '~ui-icon'

export const SearchComponent = (props) => {
  const {
    setOpenSearchProducts,
    handleChangeSortBy,
    sortByValue,
    sortByOptions,
    isResponsive
  } = props

  const theme = useTheme()

  const hideSort = theme?.business_view?.components?.header?.components?.business?.components?.sort?.hidden

  return (
    <WrapperSearch id='search-component' isResponsive={isResponsive}>
      <SearchWrapper>
        <SearchIconWrapper
          onClick={() => setOpenSearchProducts(true)}
        >
          <Icon name="search" />
        </SearchIconWrapper>
        {!hideSort && (
          <Select
            notAsync
            notReload
            options={sortByOptions}
            defaultValue={sortByValue}
            onChange={(val) => handleChangeSortBy && handleChangeSortBy(val)}
          />
        )}
      </SearchWrapper>
    </WrapperSearch>
  )
}
