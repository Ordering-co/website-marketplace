import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

import {
  StepsContainer,
  AccordionStep,
  AccordionHeader,
  AccordionBody,
  AccordionBodyInner,
  StepBadge,
  HeaderText,
  StepTitle,
  StepSubtitle,
  StepSelectedValue,
  HeaderChevron,
  StepHint,
  TimeGrid,
  TimeGridItem,
  TimeGridLabel
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { getMaxPreorderDays } from '~components/utils/configHelpers'
import { WeekCalendarPicker } from '../WeekCalendarPicker'

import { Icon } from '~ui-icon'

const STEP_DATE = 'date'
const STEP_TIME = 'time'

export const PreorderDateTimeSteps = (props) => {
  const {
    datesList,
    dateSelected,
    timeSelected,
    timeList,
    isEnabled,
    handleChangeDate,
    handleChangeTime,
    isUseWeekPicker,
    configs,
    cateringPreorder,
    preorderMinimumDays,
    preorderMaximumDays,
    maxDays,
    isProfessional,
    isDisabled,
    isAppoint,
    formatTimeDisplay,
    is12Hours,
    showTimeRange,
    business,
    getMomentTime,
    isBusyTime,
    closedMessage,
    hasExistingMoment,
    scheduleSelected,
    DateWrapper,
    DaysSwiper,
    Day,
    DayName,
    DayNumber,
    ClosedBusinessMsg,
    MonthYearLayer
  } = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const maxPreorderDays = getMaxPreorderDays(configs, orderState?.options?.type)

  const hasScheduledMoment = !!(hasExistingMoment || scheduleSelected || timeSelected)

  const [dateConfirmed, setDateConfirmed] = useState(hasScheduledMoment)
  const [expandedStep, setExpandedStep] = useState(hasScheduledMoment ? null : STEP_DATE)

  useEffect(() => {
    if (hasExistingMoment || scheduleSelected) {
      setDateConfirmed(true)
      setExpandedStep(null)
    }
  }, [hasExistingMoment, scheduleSelected])

  const onSelectDate = (date) => {
    handleChangeDate(date)
    setDateConfirmed(true)
    setExpandedStep(STEP_TIME)
  }

  const onSelectTime = (time) => {
    handleChangeTime(time)
    setExpandedStep(null)
  }

  const toggleDateStep = () => {
    if (!dateConfirmed) return
    setExpandedStep(expandedStep === STEP_DATE ? null : STEP_DATE)
  }

  const toggleTimeStep = () => {
    if (!dateConfirmed) return
    setExpandedStep(expandedStep === STEP_TIME ? null : STEP_TIME)
  }

  const datesSliceStart = (cateringPreorder && preorderMinimumDays) || 0
  const resolvedDays = cateringPreorder ? preorderMaximumDays : (maxDays ?? maxPreorderDays)
  const datesSliceEnd = resolvedDays > 0 ? Number(resolvedDays) : 0
  const visibleDates = datesList.slice(datesSliceStart, datesSliceEnd)

  const formattedSelectedDate = dateSelected
    ? moment(dateSelected).format('dddd, MMM D')
    : ''

  const formattedSelectedTime = timeSelected && formatTimeDisplay
    ? (() => {
        const slot = timeList?.find(item => item.value === timeSelected)
        if (!slot) return timeSelected
        const parts = formatTimeDisplay(slot.text)
        if (!parts) return timeSelected
        return parts.period ? `${parts.hours}:${parts.minutes} ${parts.period}` : `${parts.hours}:${parts.minutes}`
      })()
    : ''

  const isDateExpanded = expandedStep === STEP_DATE
  const isTimeExpanded = expandedStep === STEP_TIME
  const isDateCollapsed = dateConfirmed && !isDateExpanded
  const isTimeCollapsed = !!timeSelected && !isTimeExpanded

  const renderDatePicker = () => (
    <>
      {MonthYearLayer && (
        <MonthYearLayer>
          <span>{moment(dateSelected).format('MMMM, yyyy')}</span>
        </MonthYearLayer>
      )}
      {isUseWeekPicker
        ? (
          <DateWrapper>
            <DaysSwiper left={<Icon name="caretLeftFill" />}>
              <Swiper
                spaceBetween={0}
                navigation
                modules={[Navigation]}
                breakpoints={{
                  0: { slidesPerView: 4, spaceBetween: 0 },
                  400: { slidesPerView: 5, spaceBetween: 0 },
                  550: { slidesPerView: 6, spaceBetween: 0 },
                  769: {
                    slidesPerView: (maxPreorderDays > 0 && maxPreorderDays < 7) ? maxPreorderDays : 7,
                    spaceBetween: 0
                  }
                }}
                freeMode
                watchSlidesProgress
                className='swiper-datelist'
                preventClicksPropagation={false}
              >
                {visibleDates.map((date, i) => {
                  const dateParts = date.split('-')
                  const _date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                  const dayName = t('DAY' + (_date.getDay() >= 1 ? _date.getDay() : 7)).substring(0, 2)
                  const dayNumber = (_date.getDate() < 10 ? '0' : '') + _date.getDate()
                  return (
                    <SwiperSlide key={i}>
                      <Day selected={dateSelected === date} onClick={() => onSelectDate(date)}>
                        <DayName isAppoint={isAppoint}>{dayName}</DayName>
                        <DayNumber isAppoint={isAppoint}>{dayNumber}</DayNumber>
                      </Day>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </DaysSwiper>
          </DateWrapper>
          )
        : (
          <WeekCalendarPicker
            datesList={datesList}
            dateSelected={dateSelected}
            handleChangeDate={onSelectDate}
            maxDays={maxDays}
            configs={configs}
            cateringPreorder={cateringPreorder}
            preorderMinimumDays={preorderMinimumDays}
            preorderMaximumDays={preorderMaximumDays}
          />
          )}
    </>
  )

  return (
    <StepsContainer>
      <AccordionStep>
        <AccordionHeader
          type='button'
          isExpanded={isDateExpanded}
          onClick={dateConfirmed ? toggleDateStep : undefined}
          disabled={!dateConfirmed}
          aria-expanded={isDateExpanded}
        >
          <StepBadge completed={dateConfirmed} active={!dateConfirmed || isDateExpanded}>1</StepBadge>
          <HeaderText>
            <StepTitle>{t('CHOOSE_DATE', 'Choose Date')}</StepTitle>
            {isDateCollapsed
              ? (
                <StepSelectedValue>{formattedSelectedDate}</StepSelectedValue>
                )
              : (
                <StepSubtitle>
                  {t('PREORDER_DATE_HINT', 'Only available days can be selected')}
                </StepSubtitle>
                )}
          </HeaderText>
          {dateConfirmed && (
            <HeaderChevron isExpanded={isDateExpanded}>
              <Icon name="chevronDown" />
            </HeaderChevron>
          )}
        </AccordionHeader>
        <AccordionBody isExpanded={isDateExpanded || !dateConfirmed}>
          <AccordionBodyInner>
            {renderDatePicker()}
          </AccordionBodyInner>
        </AccordionBody>
      </AccordionStep>

      <AccordionStep isLocked={!dateConfirmed}>
        <AccordionHeader
          type='button'
          isExpanded={isTimeExpanded}
          onClick={dateConfirmed ? toggleTimeStep : undefined}
          disabled={!dateConfirmed}
          aria-expanded={isTimeExpanded}
        >
          <StepBadge completed={!!timeSelected} active={dateConfirmed && (!timeSelected || isTimeExpanded)}>2</StepBadge>
          <HeaderText>
            <StepTitle>{t('CHOOSE_TIME', 'Choose Time')}</StepTitle>
            {isTimeCollapsed
              ? (
                <StepSelectedValue>{formattedSelectedTime}</StepSelectedValue>
                )
              : (
                <StepSubtitle>
                  {!dateConfirmed
                    ? t('PREORDER_SELECT_DATE_FIRST', 'Select a day first to see available times')
                    : t('PREORDER_TIME_HINT', 'Pick a time slot for your order')}
                </StepSubtitle>
                )}
          </HeaderText>
          {dateConfirmed && (
            <HeaderChevron isExpanded={isTimeExpanded}>
              <Icon name="chevronDown" />
            </HeaderChevron>
          )}
        </AccordionHeader>
        <AccordionBody isExpanded={isTimeExpanded}>
          <AccordionBodyInner>
            {!dateConfirmed && (
              <StepHint>{t('PREORDER_SELECT_DATE_FIRST', 'Select a day first to see available times')}</StepHint>
            )}
            {dateConfirmed && (isEnabled && timeList?.length > 0)
              ? (
                <TimeGrid>
                  {timeList.map((time, i) => {
                    const startParts = formatTimeDisplay(time.text) || {}
                    const startLabel = `${startParts.hours}:${startParts.minutes}${startParts.period ? ` ${startParts.period}` : ''}`
                    // For delivery, show a window (e.g. "9:00 AM – 9:30 AM"); for
                    // pickup keep the exact start time. Display-only — the stored
                    // value is still time.value.
                    const endParts = (showTimeRange && time.endText) ? (formatTimeDisplay(time.endText) || null) : null
                    const endLabel = endParts ? `${endParts.hours}:${endParts.minutes}${endParts.period ? ` ${endParts.period}` : ''}` : ''
                    const busy = isProfessional && isBusyTime?.(business, getMomentTime?.(time.value))
                    return (
                      <TimeGridItem
                        key={i}
                        type='button'
                        active={timeSelected === time.value}
                        disabled={isDisabled || busy}
                        busy={busy}
                        onClick={() => onSelectTime(time.value)}
                      >
                        <TimeGridLabel is12Hours={is12Hours}>
                          {endLabel ? `${startLabel} – ${endLabel}` : startLabel}
                        </TimeGridLabel>
                      </TimeGridItem>
                    )
                  })}
                </TimeGrid>
                )
              : dateConfirmed && (
                <ClosedBusinessMsg>
                  {closedMessage || (!isProfessional
                    ? t('ERROR_ADD_PRODUCT_BUSINESS_CLOSED', 'The business is closed at the moment')
                    : t('PROFESSIONAL_NOT_AVAILABLE', 'Professional is not available at the moment'))}
                </ClosedBusinessMsg>
              )}
          </AccordionBodyInner>
        </AccordionBody>
      </AccordionStep>
    </StepsContainer>
  )
}
