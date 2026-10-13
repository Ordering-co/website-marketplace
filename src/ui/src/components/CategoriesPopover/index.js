import React, { useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'
import { usePopper } from 'react-popper'
import {
  PopoverBody,
  PopoverArrow,
  TitleContainer
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { Modal } from '~ui/src/components/Modal'
import { Button } from '~ui/src/styles/Buttons'
import { useWindowSize } from '~ui/hooks/useWindowSize'

import { Icon } from '~ui-icon'

export const CategoriesPopover = (props) => {
  const { open, CategoriesPopoverUI } = props
  const theme = useTheme()
  const [, t] = useLanguage()
  const windowSize = useWindowSize()
  const referenceElement = useRef()
  const popperElement = useRef()
  const arrowElement = useRef()
  const openRef = useRef(open)
  openRef.current = open
  const popper = usePopper(referenceElement.current, popperElement.current, {
    placement: theme?.rtl ? 'bottom' : 'bottom-end',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement.current } },
      {
        name: 'offset',
        options: {
          offset: [0, 12]
        }
      }
    ]
  })

  const { styles, attributes } = popper

  const isSlideBar = windowSize.width < 993

  const handleClickOutside = (e) => {
    if (!openRef.current) return
    const outsidePopover = !popperElement.current?.contains(e.target)
    const outsidePopoverMenu = !referenceElement.current?.contains(e.target)
    // The category-bar filter icon owns the toggle. Ignore clicks that
    // originate from it so its onClick toggle is not immediately undone
    // by this outside-click handler firing on the same physical click.
    const onToggleIcon = !!(e.target?.closest && e.target.closest('.category-popover-toggle'))
    const outsideModal = !window.document.getElementById('app-modals') || !window.document.getElementById('app-modals').contains(e.target)
    if (outsidePopover && outsidePopoverMenu && outsideModal && !onToggleIcon) {
      props.onClose && props.onClose()
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleClickOutside)
    return () => window.removeEventListener('mouseup', handleClickOutside)
  }, [])

  const popStyle = { ...styles.popper, visibility: open ? 'visible' : 'hidden', width: '450px', maxHeight: '70vh', overflowY: 'auto' }

  if (!open) {
    popStyle.transform = 'translate3d(0px, 0px, 0px)'
  }

  const positionPopover = () => {
    const categoryLists = document.getElementById('category-lists')
    const popoverElement = document.getElementById('categories-popover')
    if (!categoryLists || !popoverElement) return
    const rect = categoryLists.getBoundingClientRect()
    popoverElement.style.position = 'fixed'
    popoverElement.style.top = `${rect.bottom + 12}px`
    popoverElement.style.left = `${rect.left}px`
  }

  useEffect(() => {
    if (open) positionPopover()
  }, [open])

  useEffect(() => {
    if (!open) return
    window.addEventListener('scroll', positionPopover)
    window.addEventListener('resize', positionPopover)
    return () => {
      window.removeEventListener('scroll', positionPopover)
      window.removeEventListener('resize', positionPopover)
    }
  }, [open, windowSize?.width])

  return (
    <div style={{ overflow: 'hidden' }}>
      {isSlideBar
        ? (open
            ? <Modal
                open={open}
                onClose={props?.onClose}
                hideCloseDefault
                isSlideBar
              >
                <TitleContainer>
                  <Button outline color='primary' onClick={props?.onClose}>
                    <Icon name="close" /> {t('CLOSE', 'Close')}
                  </Button>
                </TitleContainer>
                <div onClick={props?.onClose}>
                  <CategoriesPopoverUI />
                </div>
              </Modal>
            : null)
        : (
            <PopoverBody onClick={props?.onClose} id='categories-popover' className='categories-popover' ref={popperElement} style={popStyle} {...attributes.popper}>
              <CategoriesPopoverUI />
              <PopoverArrow key='arrow' ref={arrowElement} style={styles.arrow} />
            </PopoverBody>
          )}
    </div>
  )
}
