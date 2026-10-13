import React, { useState, useEffect } from 'react'
import { Title } from '../styles'
import { Icon } from '~ui-icon'

export const FilterAccordion = ({ title, children, onClick, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  const [setRotate, setRotateState] = useState(defaultOpen ? 'accordion__icon rotate' : 'accordion__icon')

  useEffect(() => {
    setOpen(defaultOpen)
    setRotateState(defaultOpen ? 'accordion__icon rotate' : 'accordion__icon')
  }, [defaultOpen])

  const activeAccordion = (value) => {
    setRotateState(value ? 'accordion__icon rotate' : 'accordion__icon')
    setOpen(value)
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) {
      onClick()
    } else {
      activeAccordion(!open)
    }
  }

  return (
    <>
      {!defaultOpen && (
        <Title onClick={handleClick}>
          <h3>{title}</h3>
          <Icon name="arrowUp" className={`${setRotate}`} />
        </Title>
      )}
      {open && children}
    </>
  )
}
