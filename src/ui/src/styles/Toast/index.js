import React, { useEffect, useRef } from 'react'
import styled, { useTheme } from 'styled-components'
import { useToast, ToastType } from '~components/contexts/ToastContext'

const ToastBar = styled.div`
  visibility: hidden;
  opacity: 0;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  bottom: 80px;
  z-index: 99999;
  font-size: 14px;
  min-width: 200px;
  max-width: 200px;

  /* Animations to fade the snackbar in and out */
  @-webkit-keyframes fadein {
    from {opacity: 0; transform: translateY(20px);}
    to {opacity: 1; transform: translateY(0);}
  }

  @keyframes fadein {
    from {opacity: 0; transform: translateY(20px);}
    to {opacity: 1; transform: translateY(0);}
  }

  @-webkit-keyframes fadeout {
    from {opacity: 1; transform: translateY(0);}
    to {opacity: 0; transform: translateY(20px);}
  }

  @keyframes fadeout {
    from {opacity: 1; transform: translateY(0);}
    to {opacity: 0; transform: translateY(20px);}
  }

  @media(min-width: 380px){
    font-size: 16px;
    min-width: 250px;
    max-width: initial;
  }

  @media(min-width: 1000px){
    bottom: 30px;
  }
`

const ToastContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

export const Toast = () => {
  const [toastConfig, { hideToast }] = useToast()
  const toastRef = useRef()

  const theme = useTheme()

  useEffect(() => {
    if (!toastConfig && !toastRef.current) {
      return
    }

    const toast = document.getElementById('toast-bar')
    if (!toast) return

    toast.style.visibility = 'visible'
    toast.style.animation = 'none'
    const rafId = requestAnimationFrame(() => {
      toast.style.animation = 'fadein 0.5s ease forwards, fadeout 0.5s ease 2.5s forwards'
    })
    const timeoutId = setTimeout(() => {
      toast.style.visibility = 'hidden'
      hideToast()
    }, duration)
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timeoutId)
    }
  }, [toastConfig])

  if (!toastConfig) {
    return null
  }

  const { type, message, duration } = toastConfig

  let backgroundColor = '#6ba4ff'

  switch (type) {
    case ToastType.Info:
      backgroundColor = theme.colors.primary ?? backgroundColor
      break
    case ToastType.Error:
      backgroundColor = '#D83520'
      break
    case ToastType.Success:
      backgroundColor = '#73bd24'
      break
  }

  return (
    <ToastContainer>
      <ToastBar backgroundColor={backgroundColor} id='toast-bar' ref={toastRef}>{message}</ToastBar>
    </ToastContainer>
  )
}
