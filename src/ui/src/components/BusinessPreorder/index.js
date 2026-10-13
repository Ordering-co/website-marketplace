import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import { useTheme } from 'styled-components'

import {
  BusinessPreorderContainer,
  LogoWrapper,
  BusinessLogo,
  PreorderTypeWrapper,
  SelectWrapper,
  OrderTimeWrapper,
  Title,
  ButtonWrapper,
  DateWrapper,
  TypeContent,
  Layer,
  MonthYearLayer,
  DaysSwiper,
  Day,
  DayName,
  DayNumber,
  ClosedBusinessMsg,
  Divider,
  ScheduleBody
} from './styles'

import { useUtils } from '~components/contexts/UtilsContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { MomentOption } from '~components/components/MomentOption'
import { useConfig } from '~components/contexts/ConfigContext'
import { useOrder } from '~components/contexts/OrderContext'
import { createDayjsWithTimezone, parseBusinessDateTime, getPreorderMaxDate } from '~components/constants/timezones'

import { Select } from '~ui/src/styles/Select'
import { Button } from '~ui/src/styles/Buttons'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { SpinnerLoader } from '~ui/src/components/SpinnerLoader'
import { getTimes } from '~ui/utils'
import { BusinessMenuList } from '~ui/src/components/BusinessMenuList'
import { PreorderDateTimeSteps } from '~ui/src/components/PreorderDateTimeSteps'

import { Icon } from '~ui-icon'

const BusinessPreorderUI = (props) => {
  const {
    business,
    handleClick,
    datesList,
    dateSelected,
    timeSelected,
    handleChangeDate,
    handleChangeTime,
    showButton,
    isAsap,
    handleAsap,
    isProfessional,
    isDisabled,
    maxDays,
    hoursList,
    cateringPreorder,
    preorderLeadTime,
    getActualSchedule,
    isUseWeekPicker,
    scheduleSelected
  } = props

  const { pathname } = useLocation()
  const [{ optimizeImage, parseTime, is12Hours }] = useUtils()
  const theme = useTheme()
  const [{ configs }] = useConfig()
  const [orderState] = useOrder()
  const [, t] = useLanguage()
  const windowSize = useWindowSize()

  const [type, setType] = useState(null)
  const [menu, setMenu] = useState(null)
  const [timeList, setTimeList] = useState([])
  const [isEnabled, setIsEnabled] = useState(false)

  const isPreOrderSetting = configs?.preorder_status_enabled?.value === '1'
  const hideBusinessNameLogo = true

  const businessTimezone = business?.timezone
  const businessNow = () => businessTimezone ? createDayjsWithTimezone(businessTimezone) : moment()

  const isSlotWithinSchedule = (hour, schedule) => {
    return schedule?.lapses?.some((lapse) => {
      const openHour = lapse.open.hour < 10 ? `0${lapse.open.hour}` : lapse.open.hour
      const openMinute = lapse.open.minute < 10 ? `0${lapse.open.minute}` : lapse.open.minute
      const closeHour = lapse.close.hour < 10 ? `0${lapse.close.hour}` : lapse.close.hour
      const closeMinute = lapse.close.minute < 10 ? `0${lapse.close.minute}` : lapse.close.minute
      const slotStart = businessTimezone
        ? parseBusinessDateTime(dateSelected, hour.startTime, businessTimezone)
        : moment(`${dateSelected} ${hour.startTime}`)
      const slotEnd = businessTimezone
        ? parseBusinessDateTime(dateSelected, hour.endTime, businessTimezone)
        : moment(`${dateSelected} ${hour.endTime}`)
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

  const preOrderType = [
    { value: 'business_menu', content: <TypeContent>{t('BUSINESS_MENU', 'Business menu')}</TypeContent> },
    { value: 'business_hours', content: <TypeContent>{t('BUSINESS_HOURS', 'Business hours')}</TypeContent> }
  ]

  const goToBusinessPage = () => {
    handleClick && handleClick(business)
  }

  const validateSelectedDate = (curdate, menu) => {
    const day = businessTimezone
      ? createDayjsWithTimezone(businessTimezone, curdate).day()
      : moment(curdate).format('d')
    setIsEnabled(menu.schedule[day].enabled || false)
  }

  const getMomentTime = (time) => {
    if (businessTimezone) {
      return parseBusinessDateTime(dateSelected, time, businessTimezone).toDate()
    }
    return moment(`${moment(dateSelected).format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm').toDate()
  }

  const isBusyTime = (professional, selectedMoment) => {
    if (!selectedMoment) return false
    const startDay = moment(selectedMoment).utc().format('d')
    const isStartScheduleEnabled = professional?.schedule?.[startDay]?.enabled
    if (!isStartScheduleEnabled) return true

    if (professional?.busy_times?.length === 0) return false

    const busyTimes = professional?.busy_times

    const valid = busyTimes.some(item => {
      return (moment.utc(item?.start).local().valueOf() <= moment(selectedMoment).valueOf() &&
        moment(selectedMoment).valueOf() < moment.utc(item?.end).local().valueOf())
    })
    return valid
  }

  const getTimeList = (curdate, menu) => {
    validateSelectedDate(curdate, menu)
    const dateParts = curdate.split('-')
    const dateSeleted = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
    const times = getTimes(dateSeleted, menu?.schedule, is12Hours, { timezone: businessTimezone })
    return times
  }

  const formatTimeDisplay = (time) => {
    if (!time) return ''
    if (is12Hours) {
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
    if (cateringPreorder) {
      let _timeLists = []
      const schedule = business && getActualSchedule()
      if (!schedule && business) {
        setTimeList([])
        return
      }

      _timeLists = hoursList
        .filter(hour => {
          return (Object.keys(business || {})?.length === 0 || isSlotWithinSchedule(hour, schedule)) &&
            (businessTimezone
              ? parseBusinessDateTime(dateSelected, hour.startTime, businessTimezone).isBefore(parseBusinessDateTime(dateSelected, hour.endTime, businessTimezone))
              : moment(`${dateSelected} ${hour.startTime}`).isBefore(moment(`${dateSelected} ${hour.endTime}`))) &&
            isFutureSlot(hour)
        })
        .map(hour => {
          return {
            value: hour.startTime,
            text: is12Hours
              ? (
                  hour.startTime.includes('12')
                    ? `${hour.startTime}PM`
                    : parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
                )
              : (
                  parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
                ),
            endText: is12Hours
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
      if (_timeLists?.length > 0) {
        setTimeList(_timeLists)
      }
    } else {
      const selectedMenu = menu ? (menu?.use_business_schedule ? business : menu) : business
      const _times = getTimeList(dateSelected, selectedMenu)
      setTimeList(_times)
    }
  }, [dateSelected, menu, JSON.stringify(business), cateringPreorder, JSON.stringify(hoursList), dateSelected])

  useEffect(() => {
    if (type === 'business_hours') setMenu(null)
  }, [type])

  useEffect(() => {
    if (pathname.includes('store') || isProfessional || cateringPreorder) return
    handleAsap && handleAsap()
  }, [])

  return (
    <BusinessPreorderContainer>
      {!isProfessional && <Title>{t('PREORDER', 'Preorder')}</Title>}
      {!hideBusinessNameLogo && !isProfessional && (
        <LogoWrapper>
          <BusinessLogo bgimage={optimizeImage(business?.logo || theme.images?.dummies?.businessLogo, 'h_200,c_limit')} />
          <p>{business.name}</p>
        </LogoWrapper>
      )}
      {!isProfessional && isPreOrderSetting && !cateringPreorder && (
        <PreorderTypeWrapper>
          <SelectWrapper>
            <Select
              defaultValue={type}
              options={preOrderType}
              placeholder={t('PREORDER_TYPE', 'Preorder type')}
              onChange={(value) => setType(value)}
              showOptionsOnClick
            />
          </SelectWrapper>
        </PreorderTypeWrapper>
      )}
      {!isProfessional && (type === 'business_menu') && (
        <BusinessMenuList
          businessId={business.id}
          setMenu={setMenu}
        />
      )}
      {(isPreOrderSetting || isProfessional) && (
        <>
          <Divider />
          <OrderTimeWrapper>
            {!isProfessional && <p>{t('ORDER_TIME', 'Order time')}</p>}
            <ScheduleBody>
              <PreorderDateTimeSteps
                datesList={datesList}
                dateSelected={dateSelected}
                timeSelected={timeSelected}
                timeList={timeList}
                isEnabled={isEnabled || cateringPreorder}
                handleChangeDate={handleChangeDate}
                handleChangeTime={handleChangeTime}
                isUseWeekPicker={isUseWeekPicker}
                configs={configs}
                cateringPreorder={cateringPreorder}
                maxDays={maxDays}
                isProfessional={isProfessional}
                isDisabled={isDisabled}
                formatTimeDisplay={formatTimeDisplay}
                is12Hours={is12Hours}
                hasExistingMoment={!!orderState?.options?.moment}
                scheduleSelected={scheduleSelected}
                business={business}
                getMomentTime={getMomentTime}
                isBusyTime={isBusyTime}
                DateWrapper={DateWrapper}
                DaysSwiper={DaysSwiper}
                Day={Day}
                DayName={DayName}
                DayNumber={DayNumber}
                ClosedBusinessMsg={ClosedBusinessMsg}
                MonthYearLayer={MonthYearLayer}
              />
            </ScheduleBody>
          </OrderTimeWrapper>
        </>
      )}
      {!isPreOrderSetting && !isProfessional && (
        <ClosedBusinessMsg>{t('ERROR_ADD_PRODUCT_BUSINESS_CLOSED', 'The business is closed at the moment')}</ClosedBusinessMsg>
      )}
      {showButton && dateSelected && timeSelected && (
        <ButtonWrapper>
          <Button
            color='primary'
            onClick={goToBusinessPage}
            disabled={isAsap}
          >
            {t('GO_TO_MENU', 'Go to menu')}
            <Icon name="arrowRight" />
          </Button>
        </ButtonWrapper>
      )}
      {orderState?.loading && (
        <Layer nobg={!!isProfessional}>
          {(window.location.pathname !== '/search' || orderState?.options?.address?.location) && (
            <SpinnerLoader
              style={{
                top: windowSize.width <= 768 ? '50%' : '40%',
                position: windowSize.width <= 768 ? 'absolute' : 'sticky',
                height: 'auto'
              }}
            />
          )}
        </Layer>
      )}
    </BusinessPreorderContainer>
  )
}

export const BusinessPreorder = (props) => {
  const { maxDays, business } = props
  const [orderState] = useOrder()
  const [{ getMaxPreorderDays }] = useUtils()

  const limitDays = maxDays ?? getMaxPreorderDays(orderState?.options?.type)

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

  const businessPreorderProps = {
    ...props,
    UIComponent: BusinessPreorderUI,
    maxDate
  }
  return <MomentOption {...businessPreorderProps} />
}
