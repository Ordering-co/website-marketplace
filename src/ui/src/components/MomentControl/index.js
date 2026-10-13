import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useLocation } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import {
  Title,
  CheckBoxWrapper,
  CheckedIcon,
  ButtonWrapper,
  OrderTimeWrapper,
  Divider,
  ScheduleBody,
  DateWrapper,
  ClosedBusinessMsg,
  MonthYearLayer,
  DaysSwiper,
  Day,
  DayName,
  DayNumber
} from './styles'

import { MomentOption } from '~components/components/MomentOption'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useOrder } from '~components/contexts/OrderContext'
import { createDayjsWithTimezone, parseBusinessDateTime, getPreorderMaxDate } from '~components/constants/timezones'

import { Button } from '~ui/src/styles/Buttons'
import { PreorderDateTimeSteps } from '~ui/src/components/PreorderDateTimeSteps'
import { getTimes as getTimesUtils } from '~ui/utils'

import { CustomLayout } from './layouts/CustomLayout'

import { Icon } from '~ui-icon'

const MomentControlUI = (props) => {
  const {
    isAsap,
    datesList,
    hoursList,
    dateSelected,
    timeSelected,
    handleAsap,
    handleChangeDate,
    handleChangeTime,
    onClose,
    isAppoint,
    cateringPreorder,
    isCart,
    preorderLeadTime,
    business,
    getActualSchedule,
    preorderMaximumDays,
    preorderMinimumDays,
    isUseWeekPicker,
    scheduleSelected
  } = props

  const [{ configs }] = useConfig()
  const [{ parseTime, timeFormat, is12Hours: is12hours }] = useUtils()
  const { pathname } = useLocation()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [isASP, setIsASP] = useState(!orderState?.options?.moment)
  const [timeList, setTimeList] = useState([])
  const [scheduleList, setScheduleList] = useState(null)
  const [isEnabled, setIsEnabled] = useState(true)
  const [nextTime, setNextTime] = useState(null)

  const businessTimezone = business?.timezone
  const businessNow = () => businessTimezone ? createDayjsWithTimezone(businessTimezone) : moment()

  // Slot interval (minutes) — configurable per business, defaults to 30.
  const slotInterval = parseInt(configs?.preorder_slot_interval?.value, 10) > 0
    ? parseInt(configs?.preorder_slot_interval?.value, 10)
    : 30
  // Show a time window (range) for delivery; an exact time for pickup/other.
  const showTimeRange = orderState?.options?.type === 1 || orderState?.options?.type === 7

  /**
   * Reduce a slot list to starts ~slotInterval apart and attach a window end
   * (start + interval) for the range label. Robust to any source granularity
   * (the listing's slots come from the submodule at 15-min) and always keeps the
   * earliest available slot. Display-only — each slot's `value` (the moment that
   * gets stored) is left untouched, so checkout/backend is unaffected.
   */
  const normalizeSlots = (list) => {
    if (!Array.isArray(list) || list.length === 0) return list
    const out = []
    let lastKept = null
    for (const slot of list) {
      const start = moment(slot?.value, 'HH:mm')
      if (!start.isValid()) { out.push(slot); continue }
      if (!lastKept || start.diff(lastKept, 'minutes') >= slotInterval) {
        const end = start.clone().add(slotInterval, 'minutes')
        out.push({
          ...slot,
          endText: is12hours
            ? parseTime(end, { outputFormat: 'hh:mma' })
            : parseTime(end, { outputFormat: 'HH:mm' })
        })
        lastKept = start
      }
    }
    return out
  }

  const isSlotWithinSchedule = (hour, schedule) => {
    return schedule?.lapses?.some((lapse) => {
      const slotStart = businessTimezone
        ? parseBusinessDateTime(dateSelected, hour.startTime, businessTimezone)
        : moment(`${dateSelected} ${hour.startTime}`)
      const slotEnd = businessTimezone
        ? parseBusinessDateTime(dateSelected, hour.endTime, businessTimezone)
        : moment(`${dateSelected} ${hour.endTime}`)
      const openHour = lapse.open.hour < 10 ? `0${lapse.open.hour}` : lapse.open.hour
      const openMinute = lapse.open.minute < 10 ? `0${lapse.open.minute}` : lapse.open.minute
      const closeHour = lapse.close.hour < 10 ? `0${lapse.close.hour}` : lapse.close.hour
      const closeMinute = lapse.close.minute < 10 ? `0${lapse.close.minute}` : lapse.close.minute
      const openTime = businessTimezone
        ? parseBusinessDateTime(dateSelected, `${openHour}:${openMinute}`, businessTimezone).add(preorderLeadTime, 'minutes')
        : moment(`${dateSelected} ${openHour}:${openMinute}`).add(preorderLeadTime, 'minutes')
      const closeTime = businessTimezone
        ? parseBusinessDateTime(dateSelected, `${closeHour}:${closeMinute}`, businessTimezone)
        : moment(`${dateSelected} ${closeHour}:${closeMinute}`)
      return slotStart.valueOf() >= openTime.valueOf() && slotEnd.valueOf() <= closeTime.valueOf()
    })
  }

  const isFutureSlot = (hour) => {
    const slotStart = businessTimezone
      ? parseBusinessDateTime(dateSelected, hour.startTime, businessTimezone)
      : moment(`${dateSelected} ${hour.startTime}`)
    const earliest = businessNow().add(preorderLeadTime, 'minutes')
    return earliest.isBefore(slotStart) || !cateringPreorder
  }

  const handleCheckBoxChange = (index) => {
    if (index) {
      !orderState.loading && handleAsap()
      setIsASP(true)
    } else setIsASP(false)
  }

  const validateSelectedDate = (curdate, schedule) => {
    const day = businessTimezone
      ? createDayjsWithTimezone(businessTimezone, curdate).day()
      : moment(curdate).format('d')
    setIsEnabled(schedule[day].enabled)
  }

  const getTimes = (curdate, schedule) => {
    validateSelectedDate(curdate, schedule)
    const dateParts = curdate?.split?.('-')
    const dateSeleted = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
    return getTimesUtils(dateSeleted, schedule, is12hours, { timezone: businessTimezone })
  }

  const setLocalMoment = () => {
    moment.updateLocale('custom', {
      months: [
        t('MONTH1', 'January'),
        t('MONTH2', 'February'),
        t('MONTH3', 'March'),
        t('MONTH4', 'April'),
        t('MONTH5', 'May'),
        t('MONTH6', 'June'),
        t('MONTH7', 'July'),
        t('MONTH8', 'August'),
        t('MONTH9', 'September'),
        t('MONTH10', 'October'),
        t('MONTH11', 'November'),
        t('MONTH12', 'December')
      ],
      monthsShort: [
        t('MONTHSHORT1', 'Jan'),
        t('MONTHSHORT2', 'Feb'),
        t('MONTHSHORT3', 'Mar'),
        t('MONTHSHORT4', 'Apr'),
        t('MONTHSHORT5', 'May'),
        t('MONTHSHORT6', 'Jun'),
        t('MONTHSHORT7', 'Jul'),
        t('MONTHSHORT8', 'Aug'),
        t('MONTHSHORT9', 'Sep'),
        t('MONTHSHORT10', 'Oct'),
        t('MONTHSHORT11', 'Nov'),
        t('MONTHSHORT12', 'Dec')
      ],
      weekdays: [
        t('DAY7', 'Sunday'),
        t('DAY1', 'Monday'),
        t('DAY2', 'Tuesday'),
        t('DAY3', 'Wednesday'),
        t('DAY4', 'Thursday'),
        t('DAY5', 'Friday'),
        t('DAY6', 'Saturday')
      ],
      weekdaysShort: [
        t('DAYSHORT7', 'Sun'),
        t('DAYSHORT1', 'Mon'),
        t('DAYSHORT2', 'Tue'),
        t('DAYSHORT3', 'Wed'),
        t('DAYSHORT4', 'Thu'),
        t('DAYSHORT5', 'Fri'),
        t('DAYSHORT6', 'Sat')
      ],
      weekdaysMin: [
        t('DAYMIN7', 'Su'),
        t('DAYMIN1', 'Mo'),
        t('DAYMIN2', 'Tu'),
        t('DAYMIN3', 'We'),
        t('DAYMIN4', 'Th'),
        t('DAYMIN5', 'Fr'),
        t('DAYMIN6', 'Sa')
      ],
      meridiem: function (hours) {
        return hours < 12 ? t('AM', 'AM') : t('PM', 'PM')
      }
    })
  }

  const formatTimeDisplay = (time) => {
    if (!time) return ''
    if (is12hours) {
      if (time.includes('PM') || time.includes('AM')) {
        const period = time.includes('PM') ? 'PM' : 'AM'
        const timeStr = time.replace(/PM|AM/g, '').trim()
        const [hours, minutes] = timeStr.split(':')
        return {
          hours,
          minutes,
          period
        }
      }
      const [timeStr, period] = time.split(' ')
      const [hours, minutes] = timeStr.split(':')
      return {
        hours,
        minutes,
        period
      }
    }

    const [hours, minutes] = time.split(':')
    return {
      hours,
      minutes,
      period: null
    }
  }

  useEffect(() => {
    let _timeLists = []
    if (!scheduleList || cateringPreorder) {
      const schedule = business && Object.keys(business || {})?.length > 0 && getActualSchedule()
      if (!schedule && cateringPreorder && Object.keys(business)?.length > 0) {
        setIsEnabled(false)
        return
      }
      _timeLists = hoursList
        .filter(hour => (Object.keys(business || {})?.length === 0 || isSlotWithinSchedule(hour, schedule)) &&
          (businessTimezone
            ? parseBusinessDateTime(dateSelected, hour.startTime, businessTimezone).isBefore(parseBusinessDateTime(dateSelected, hour.endTime, businessTimezone))
            : moment(`${dateSelected} ${hour.startTime}`).isBefore(moment(`${dateSelected} ${hour.endTime}`))) &&
          isFutureSlot(hour))
        .map(hour => {
          return {
            value: hour.startTime,
            text: is12hours
              ? (
                  hour.startTime.includes('12')
                    ? `${hour.startTime}PM`
                    : parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
                )
              : (
                  parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
                ),
            endText: is12hours
              ? (
                  hour.endTime.includes('12')
                    ? `${hour.endTime}PM`
                    : parseTime(moment(hour.endTime, 'HH:mm'), { outputFormat: 'hh:mma' })
                )
              : (
                  parseTime(moment(hour.endTime, 'HH:mm'), { outputFormat: 'HH:mm' })
                )
          }
        })
      setIsEnabled(true)
    } else {
      _timeLists = getTimes(dateSelected, scheduleList)
    }
    setTimeList(normalizeSlots(_timeLists))
  }, [dateSelected, hoursList, scheduleList, cateringPreorder, JSON.stringify(business)])

  useEffect(() => {
    handleCheckBoxChange(isAsap && ((preorderMinimumDays === 0 && preorderLeadTime === 0) || !cateringPreorder))
  }, [isAsap])

  useEffect(() => {
    if ((!pathname.includes('store') || isCart) && !props.business) {
      setScheduleList(null)
      return
    }

    const schedules = JSON.parse(window.localStorage.getItem('business_schedule'))
    setScheduleList(schedules)
  }, [pathname])

  useEffect(() => {
    setLocalMoment()
  }, [])

  useEffect(() => {
    if (preorderMinimumDays === 0 && preorderLeadTime === 0) return
    const isToday = dateSelected === (businessTimezone ? businessNow().format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
    if (isCart && isToday && !orderState?.loading && timeList?.length > 0) {
      setNextTime(timeList?.[0] ?? null)
    }
  }, [timeList?.length])

  useEffect(() => {
    if (nextTime?.value && timeList?.length > 0 && isCart && !orderState?.loading && !(preorderMinimumDays === 0 && preorderLeadTime === 0)) {
      const notime = timeList?.filter((_, i) => i !== 0)?.find?.(time => time?.value === timeSelected)
      if (!notime) {
        handleChangeTime(nextTime?.value)
      }
    }
  }, [nextTime?.value])

  return (
    <div id='moment_control'>
      {!isAppoint && (
        <>
          {!isCart && (
            <Title>{t('DELIVERY_TIME', 'Delivery time')}</Title>
          )}
          {((preorderMinimumDays === 0 && preorderLeadTime === 0) || !cateringPreorder) && (
            <CheckBoxWrapper
              highlight={isAsap && isASP}
              onClick={() => handleCheckBoxChange(true)}
              isLoading={orderState?.loading}
            >
              <span>{t('CHECKOUT_ASAP', 'ASAP')} ({(businessTimezone ? businessNow() : moment()).format(`dddd, MMMM DD, YYYY ${timeFormat}`)} + {t('DELIVERY_TIME', 'delivery time')})</span>
              {isASP ? <CheckedIcon /> : <Icon name="radioCheck" />}
            </CheckBoxWrapper>
          )}
          <CheckBoxWrapper
            highlight={!isASP}
            onClick={() => handleCheckBoxChange(null)}
          >
            <span>{t('SCHEDULE_FOR_LATER', 'Schedule for later')}</span>
            {isASP ? <Icon name="radioCheck" /> : <CheckedIcon />}
          </CheckBoxWrapper>
        </>
      )}
      {
        (!isASP || isAppoint) && (
          !props.isCustomLayout
            ? (
              <>
                <Divider />
                <OrderTimeWrapper>
                  {!isAppoint && !isCart && <p>{t('ORDER_TIME', 'Order time')}</p>}
                  <ScheduleBody>
                    <PreorderDateTimeSteps
                      datesList={datesList}
                      dateSelected={dateSelected}
                      timeSelected={timeSelected}
                      timeList={timeList}
                      isEnabled={isEnabled}
                      handleChangeDate={handleChangeDate}
                      handleChangeTime={handleChangeTime}
                      isUseWeekPicker={isUseWeekPicker}
                      configs={configs}
                      cateringPreorder={cateringPreorder}
                      preorderMinimumDays={preorderMinimumDays}
                      preorderMaximumDays={preorderMaximumDays}
                      isAppoint={isAppoint}
                      formatTimeDisplay={formatTimeDisplay}
                      is12Hours={is12hours}
                      showTimeRange={showTimeRange}
                      hasExistingMoment={!!orderState?.options?.moment}
                      scheduleSelected={scheduleSelected}
                      DateWrapper={DateWrapper}
                      DaysSwiper={DaysSwiper}
                      Day={Day}
                      DayName={DayName}
                      DayNumber={DayNumber}
                      ClosedBusinessMsg={ClosedBusinessMsg}
                      MonthYearLayer={MonthYearLayer}
                      closedMessage={!business
                        ? t('ERROR_SHEDULE_UNAVAILABLE', 'There are no schedules for this date')
                        : undefined}
                    />
                  </ScheduleBody>
                </OrderTimeWrapper>
              </>
              )
            : (
            <CustomLayout
              handleChangeDate={handleChangeDate}
              datesList={datesList}
              hoursList={hoursList}
              isEnabled={isEnabled}
              timeList={timeList}
              timeSelected={timeSelected}
              handleChangeTime={handleChangeTime}
            />
              )
        )
      }
      {!isAppoint && !isCart && (isASP || (dateSelected && timeSelected)) && (
        <ButtonWrapper>
          <Button
            color='primary'
            onClick={() => onClose()}
            disabled={!isASP && !timeSelected}
          >
            <span>{t('SAVE', 'Save')}</span>
          </Button>
        </ButtonWrapper>
      )}
    </div>
  )
}

export const MomentControl = (props) => {
  const { business } = props
  const [orderState] = useOrder()
  const [{ getMaxPreorderDays }] = useUtils()
  const limitDays = parseInt(props.preorderMaximumDays ?? getMaxPreorderDays(orderState?.options?.type), 10)

  const maxDate = business?.timezone
    ? getPreorderMaxDate(business.timezone, limitDays)
    : (() => {
        const currentDate = new Date()
        const time = limitDays > 1
          ? currentDate.getTime() + ((limitDays - 1) * 24 * 60 * 60 * 1000)
          : limitDays === 1 ? currentDate.getTime() : currentDate.getTime() + (6 * 24 * 60 * 60 * 1000)
        currentDate.setTime(time)
        currentDate.setHours(23)
        currentDate.setMinutes(59)
        return currentDate
      })()

  const momentProps = {
    ...props,
    UIComponent: MomentControlUI,
    maxDate
  }
  return <MomentOption {...momentProps} />
}
