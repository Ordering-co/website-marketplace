import React from 'react'
import {
  MaxFilterContainer,
  MaxItem,
  MaxItemContainer,
  ProgressBar,
  ProgressContentWrapper,
  Description
} from '../styles'
import { useConfig } from '~components/contexts/ConfigContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { FilterAccordion } from '../Accordion'
import { capitalize } from '~ui/utils'

import { Icon } from '~ui-icon'

export const MaxSectionItem = (props) => {
  const {
    filters,
    handleChangeFilters,
    title,
    options,
    filter,
    onClick,
    defaultOpen = false,
    description
  } = props

  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const [{ configs }] = useConfig()

  const distanceUnit = configs?.distance_unit?.value

  const units = {
    mi: 1609,
    km: 1000
  }

  const parseValue = (option) => {
    return filter === 'max_distance'
      ? `${(option / units[distanceUnit]).toFixed(0)} ${t(`${distanceUnit?.toUpperCase()}`, capitalize(distanceUnit))}`
      : filter === 'max_eta'
        ? `${option} ${t('TIME_MIN', 'min')}`
        : parsePrice(option)
  }

  const handleBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const position = ((e.clientX - rect.left) / rect.width) * 100
    const stepSize = 100 / (options.length - 1)
    const selectedIndex = Math.round(position / stepSize)
    const selectedOption = options[selectedIndex]
    handleChangeFilters(filter, selectedOption)
  }

  const defaultIndex = options.indexOf('default') >= 0
    ? options.indexOf('default')
    : options.length - 1
  const selectedIndex = options.indexOf(filters?.[filter])
  // When the filter is unset (selectedIndex === -1), default to the rightmost
  // 'default' stop ("show all" / no limit) so the handle position matches the
  // value actually applied instead of looking like the first option is selected.
  const activeIndex = selectedIndex >= 0 ? selectedIndex : defaultIndex
  const currentPosition = options.length > 1
    ? (activeIndex / (options.length - 1)) * 100
    : 0
  const selectedDeliveryFee = filters?.[filter] === 'default'
    ? options[options.length - 2]
    : filters?.[filter]

  return (
    <MaxFilterContainer>
      <FilterAccordion title={title} onClick={onClick} defaultOpen={defaultOpen}>
        {description && <Description>{description}</Description>}
        {filter === 'max_delivery_price' && !!filters?.[filter] && (
          <p className='under-price'>{t('UNDER', 'Under')} {parsePrice(selectedDeliveryFee)}</p>
        )}
        <ProgressContentWrapper onClick={handleBarClick}>
          <Icon name="circleFill" style={{ left: '0%', fontSize: '10px' }} />
          <Icon name="circleFill" style={{ left: `${currentPosition}%`, fontSize: '36px' }} />
          <ProgressBar style={{ width: `${currentPosition}%` }} />
        </ProgressContentWrapper>
        <MaxItemContainer>
          {options.map((option, i) => (
            <MaxItem
              key={option}
              active={i === activeIndex}
              onClick={() => handleChangeFilters(filter, option)}
            >
              {option === 'default' ? `${parseValue(options[i - 1])}+` : parseValue(option)}
            </MaxItem>
          ))}
        </MaxItemContainer>
      </FilterAccordion>
    </MaxFilterContainer>
  )
}
