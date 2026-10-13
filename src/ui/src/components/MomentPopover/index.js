import React, { useRef, useEffect } from 'react'
import { usePopper } from 'react-popper'
import { HeaderItem, PopoverBody, PopoverArrow } from './styles'

import { useOrder } from '~components/contexts/OrderContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { MomentContent } from '~ui/src/components/MomentContent'
import { useTheme } from 'styled-components'

import { Icon } from '~ui-icon'

export const MomentPopover = (props) => {
  const { open, isBanner, customView, noWidth } = props
  const [orderStatus] = useOrder()
  const [, t] = useLanguage()
  const [{ parseDate, timeFormat, preorderDateFormat, getMaxPreorderDays }] = useUtils()
  const maxPreorderDays = getMaxPreorderDays(orderStatus.options?.type)
  const isPreorderDisabled = maxPreorderDays === -1 || maxPreorderDays === 0
  const theme = useTheme()
  const referenceElement = useRef()
  const popperElement = useRef()
  const arrowElement = useRef()

  const modifiers = [
    { name: 'arrow', options: { element: arrowElement.current } },
    {
      name: 'offset',
      options: {
        offset: [0, isBanner ? 15 : 12]
      }
    }
  ]
  if (isBanner) {
    modifiers.push({
      name: 'computeStyles',
      options: {
        gpuAcceleration: false
      }
    })
  }
  const popper = usePopper(referenceElement.current, popperElement.current, {
    placement: isBanner ? 'bottom' : 'auto',
    modifiers
  })

  const { styles, attributes } = popper

  const handleClickOutside = (e) => {
    if (!open) return
    const outsidePopover = !popperElement.current?.contains(e.target)
    const outsidePopoverMenu = !referenceElement.current?.contains(e.target)
    const outsideModal = !window.document.getElementById('app-modals') || !window.document.getElementById('app-modals').contains(e.target)
    if (outsidePopover && outsidePopoverMenu && outsideModal) {
      props.onClose && props.onClose()
    }
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      props.onClose && props.onClose()
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mouseup', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const popStyle = {
    ...styles.popper,
    visibility: open ? 'visible' : 'hidden',
    width: `${noWidth ? '0px' : isBanner ? '80vw' : '450px'} `,
    maxHeight: '70vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transform: `${isBanner ? theme?.rtl ? 'translateX(5vw)' : 'translateX(-5vw)' : ''}`
  }
  if (!open) {
    popStyle.transform = 'translate3d(0px, 0px, 0px)'
  }

  return (
    <div className='moment-popover' style={{ overflow: 'hidden' }}>
      <HeaderItem
        ref={referenceElement}
        onClick={isPreorderDisabled ? null : props.onClick}
        $isHome={props.isHome}
        $isBanner={isBanner}
        $customView={customView}
      >
        <Icon name="clockOutline" />
        {orderStatus.options?.moment
          ? parseDate(orderStatus.options?.moment, { outputFormat: `${preorderDateFormat} ${timeFormat}` })
          : t('ASAP_ABBREVIATION', 'ASAP')}
        {isBanner && <Icon name="chevronDown" />}
      </HeaderItem>
      <PopoverBody ref={popperElement} style={popStyle} {...attributes.popper} $customView={customView}>
        <MomentContent />
        <PopoverArrow key='arrow' ref={arrowElement} style={styles.arrow} />
      </PopoverBody>
    </div>
  )
}
