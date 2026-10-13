import React from 'react'

export const Primitive = ({ children, ...props }) =>
  React.createElement('div', props, children)
