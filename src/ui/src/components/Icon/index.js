import React from 'react'
import PropTypes from 'prop-types'
import { ICON_REGISTRY } from './iconRegistry'

export const Icon = ({ name, size, color, className, style, title, ...rest }) => {
  const Component = ICON_REGISTRY[name]

  if (!Component) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Icon: unknown name "${name}"`)
    }
    return null
  }

  return (
    <Component
      size={size}
      color={color}
      className={className}
      style={style}
      title={title}
      {...rest}
    />
  )
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string
}
