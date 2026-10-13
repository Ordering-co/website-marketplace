import React from 'react'

import { Container, Layer } from './styles'

import { useOrder } from '~components/contexts/OrderContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { getPreorderMaxDate } from '~components/constants/timezones'
import { SpinnerLoader } from '~ui/src/components/SpinnerLoader'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { MomentControl } from '~ui/src/components/MomentControl'

export const MomentContent = (props) => {
  const [{ loading }] = useConfig()
  const [orderState] = useOrder()
  const [{ getMaxPreorderDays }] = useUtils()
  const limitDays = parseInt(props.preorderMaximumDays ?? getMaxPreorderDays(orderState?.options?.type), 10)

  const maxDate = props.business?.timezone
    ? getPreorderMaxDate(props.business.timezone, limitDays)
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
    maxDate
  }

  const { width } = useWindowSize()
  const momentControl = document?.getElementById('moment_control')?.getBoundingClientRect()

  return (
    <Container isLoading={orderState?.loading}>
      {((!props.cateringPreorder) || (!loading)) && (
        <MomentControl
          {...momentProps}
          onClose={props.onClose}
          cateringPreorder={props.cateringPreorder}
          isCart={props.isCart}
          preorderSlotInterval={props.preorderSlotInterval}
          preorderLeadTime={props.preorderLeadTime}
          preorderTimeRange={props.preorderTimeRange}
          preorderMaximumDays={props.preorderMaximumDays}
          preorderMinimumDays={props.preorderMinimumDays}
          business={props.business}
        />
      )}
      {orderState?.loading && !props.isHeader && (
        <Layer height={momentControl?.height && `${momentControl?.height}px`}>
          {(window.location.pathname !== '/search' || orderState?.options?.address?.location) && (
            <SpinnerLoader
              style={{
                top: width <= 768 ? '50%' : '40%',
                position: width <= 768 ? 'absolute' : 'sticky',
                height: 'auto'
              }}
            />
          )}
        </Layer>
      )}
    </Container>
  )
}
