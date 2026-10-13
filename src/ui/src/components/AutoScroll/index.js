import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useTheme } from 'styled-components'
import { AutoscrollContainer } from './styles'

import { Icon } from '~ui-icon'

export const AutoScroll = (props) => {
  const {
    children,
    modal,
    special,
    scrollId,
    onHandleRightEnd,
    isColumnMode,
    isFlex
  } = props

  const [parentElement, setParentElement] = useState([])
  const [containerElement, setContainerElement] = useState([])
  const theme = useTheme()
  const autoScrollId = scrollId || 'autoscroll'
  let handleEndFired = false
  useLayoutEffect(() => {
    const element = document?.getElementById(`${autoScrollId}`)?.parentNode
    element && element.parentNode.addEventListener('scroll', handleScroll)
    const containerElement = element?.parentNode
    setParentElement(element)
    setContainerElement(containerElement)

    return () => {
      if (containerElement) {
        containerElement.removeEventListener('scroll', handleScroll)
      }
    }
  })

  useEffect(() => {
    handleScroll()
  })

  const handleScroll = () => {
    const autoScrollContainer = document?.getElementById(`${autoScrollId}`)
    const botonRight = autoScrollContainer?.querySelector?.('.right-autoscroll')
    const botonLeft = autoScrollContainer?.querySelector?.('.left-autoscroll')
    if (botonLeft || botonRight) {
      if (theme?.rtl) {
        if ((containerElement?.scrollLeft * -1) < 40) {
          if (!botonRight.classList.contains('hidden') && onHandleRightEnd && !handleEndFired) {
            handleEndFired = true
            onHandleRightEnd()
          }
          botonRight && botonRight.classList.add('hidden')
        } else {
          botonRight && botonRight.classList.remove('hidden')
        }
        if ((containerElement?.scrollLeft * -1) > parentElement?.scrollWidth - containerElement?.offsetWidth - 40) {
          botonLeft && botonLeft.classList.add('hidden')
        } else {
          botonLeft && botonLeft.classList.remove('hidden')
        }
      } else {
        if (containerElement?.scrollLeft < 40) {
          botonLeft && botonLeft.classList.add('hidden')
        } else {
          botonLeft && botonLeft.classList.remove('hidden')
        }
        if (containerElement?.scrollLeft > parentElement?.scrollWidth - containerElement?.offsetWidth - 40) {
          if (!botonRight.classList.contains('hidden') && onHandleRightEnd && !handleEndFired) {
            handleEndFired = true
            onHandleRightEnd()
          }
          botonRight && botonRight.classList.add('hidden')
        } else {
          handleEndFired = false
          botonRight && botonRight.classList.remove('hidden')
        }
      }
    }
  }

  const scrolling = (left) => {
    if (left) {
      containerElement.scrollBy({
        top: 0,
        left: (((-parentElement.offsetWidth / 10) > -200) ? -200 : -parentElement.offsetWidth / 10),
        behavior: 'smooth'
      })
    } else {
      containerElement.scrollBy({
        top: 0,
        left: (((+parentElement.offsetWidth / 10) < 200) ? 200 : +parentElement.offsetWidth / 10),
        behavior: 'smooth'
      })
    }
  }

  return (
    <AutoscrollContainer modal={modal} id={`${autoScrollId}`} isColumnMode={isColumnMode} isFlex={isFlex} gap={props?.gap ?? null}>
      {
        (!special ? containerElement?.offsetWidth < parentElement?.offsetWidth + 50 : containerElement?.offsetWidth < parentElement?.offsetWidth) && !isColumnMode ? <Icon name="keyboardArrowLeft" className='left-autoscroll' onMouseDown={() => scrolling(true)} /> : ''
      }
      {children}
      {
        (!special ? containerElement?.offsetWidth < parentElement?.offsetWidth + 50 : containerElement?.offsetWidth < parentElement?.offsetWidth) && !isColumnMode ? <Icon name="keyboardArrowRight" className='right-autoscroll' onMouseDown={() => scrolling()} /> : ''
      }
    </AutoscrollContainer>
  )
}
