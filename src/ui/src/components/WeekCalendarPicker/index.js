import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import moment from 'moment'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { getMaxPreorderDays } from '~components/utils/configHelpers'

import { CalendarWrapper } from './styles'

import { Icon } from '~ui-icon'

export const WeekCalendarPicker = (props) => {
  const {
    datesList,
    handleChangeDate,
    dateSelected,
    maxDays,
    configs,
    cateringPreorder,
    preorderMinimumDays,
    preorderMaximumDays
  } = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const maxPreorderDays = getMaxPreorderDays(configs, orderState?.options?.type)
  const [value, onChange] = useState(new Date())
  const [minDate, setMinDate] = useState(new Date())
  const [maxDate, setMaxDate] = useState(new Date())

  const onDateChange = (value) => {
    onChange(value)
    if (handleChangeDate) {
      const date = (value.getDate() < 10 ? '0' : '') + value.getDate()
      const month = ((value.getMonth() + 1) < 10 ? '0' : '') + (value.getMonth() + 1)
      const year = value.getFullYear()
      const fullDate = `${year}-${month}-${date}`
      handleChangeDate(fullDate)
    }
  }

  const formatMonthYear = (date) => {
    return moment(date).format('MMMM YYYY')
  }

  const formatShortWeekday = (date) => {
    const days = {
      0: t('WEEKDAY_MIN_7', 'Su'),
      1: t('WEEKDAY_MIN_1', 'Mo'),
      2: t('WEEKDAY_MIN_2', 'Tu'),
      3: t('WEEKDAY_MIN_3', 'We'),
      4: t('WEEKDAY_MIN_4', 'Th'),
      5: t('WEEKDAY_MIN_5', 'Fr'),
      6: t('WEEKDAY_MIN_6', 'Sa')
    }
    return days[date.getDay()]
  }

  useEffect(() => {
    if (datesList?.length > 0) {
      const startIndex = (cateringPreorder && preorderMinimumDays) || 0
      const resolvedDays = cateringPreorder ? preorderMaximumDays : (maxDays ?? maxPreorderDays)
      const endIndex = resolvedDays > 0 ? Number(resolvedDays) : 0
      const _datesList = datesList.slice(startIndex, endIndex)

      if (_datesList.length > 0) {
        const minDateParts = _datesList[0].split('-')
        const maxDateParts = _datesList[_datesList.length - 1].split('-')
        const _minDate = new Date(minDateParts[0], minDateParts[1] - 1, minDateParts[2])
        const _maxDate = new Date(maxDateParts[0], maxDateParts[1] - 1, maxDateParts[2])
        setMinDate(_minDate)
        setMaxDate(_maxDate)
      }
    }
  }, [datesList, maxDays, configs, cateringPreorder, preorderMinimumDays, preorderMaximumDays, maxPreorderDays])

  useEffect(() => {
    if (dateSelected) {
      const dateParts = dateSelected.split('-')
      onChange(new Date(dateParts[0], dateParts[1] - 1, dateParts[2]))
    }
  }, [dateSelected])

  const tileDisabled = ({ date }) => {
    if (!datesList?.length) return true

    const startIndex = (cateringPreorder && preorderMinimumDays) || 0
    const resolvedDays = cateringPreorder ? preorderMaximumDays : maxPreorderDays
    const endIndex = resolvedDays > 0 ? Number(resolvedDays) : 0
    const availableDates = datesList.slice(startIndex, endIndex)

    const dateString = moment(date).format('YYYY-MM-DD')
    return !availableDates.includes(dateString)
  }

  return (
    <CalendarWrapper>
      <Calendar
        onChange={(val) => onDateChange(val)}
        value={value}
        next2Label=''
        prev2Label=''
        prevLabel={<Icon name="keyboardArrowLeft" />}
        nextLabel={<Icon name="keyboardArrowRight" />}
        minDate={minDate}
        maxDate={maxDate}
        formatMonthYear={(locale, date) => formatMonthYear(date)}
        formatShortWeekday={(locale, date) => formatShortWeekday(date)}
        calendarType='US'
        tileDisabled={tileDisabled}
      />
    </CalendarWrapper>
  )
}
