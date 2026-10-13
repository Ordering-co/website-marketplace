import React, { useState } from 'react'
import {
  Accordion,
  AccordionSection,
  ClosedSchedule,
  DropdownWrapper,
  HoursWrappers
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'

import { Icon } from '~ui-icon'

export const ScheduleAccordion = (props) => {
  const {
    isDisableAccordion,
    timeFormated,
    schedule,
    weekIndex
  } = props

  const [isActive, setActiveState] = useState(false)
  const [, t] = useLanguage()

  const daysOfWeek = [
    t('DAY7', 'Sunday'),
    t('DAY1', 'Monday'),
    t('DAY2', 'Tuesday'),
    t('DAY3', 'Wednesday'),
    t('DAY4', 'Thursday'),
    t('DAY5', 'Friday'),
    t('DAY6', 'Saturday')
  ]

  return (
    <AccordionSection isClosed={!schedule?.enabled}>
      {!isDisableAccordion && (
        <Accordion
          onClick={() => setActiveState(!isActive)}
        >
          <DropdownWrapper>
            <h4>{daysOfWeek[weekIndex]}</h4>
            <Icon name="arrowDownIos" />
          </DropdownWrapper>
          <HoursWrappers style={{ display: isActive ? 'flex' : 'none' }}>
            {schedule?.lapses?.map((lapse, i) => (
              schedule?.enabled
                ? <p key={`${i}-${timeFormated(lapse.open)}`}>
                    {timeFormated(lapse.open) +
                      ' - ' +
                      timeFormated(lapse.close)}
                  </p>
                : <ClosedSchedule key={i}>
                    {t('CLOSED', 'Closed')}
                  </ClosedSchedule>
            ))}
          </HoursWrappers>
        </Accordion>
      )}
      {isDisableAccordion && (
        <div className='info-wrapper'>
          <h4>{daysOfWeek[weekIndex]}</h4>
          <div>
            {schedule?.lapses?.map((lapse, i) => (
              schedule?.enabled
                ? <p key={`${i}-${timeFormated(lapse.open)}`}>
                    {timeFormated(lapse.open) +
                      ' - ' +
                      timeFormated(lapse.close)}
                  </p>
                : <ClosedSchedule key={i}>
                    {t('CLOSED', 'Closed')}
                  </ClosedSchedule>
            ))}
          </div>
        </div>
      )}
    </AccordionSection>
  )
}
