import { useRef, useEffect, useState, useCallback } from 'react'
import { getDistance } from '../../utils'

export const useDriverLocationInterpolation = (rawLocation, options = {}) => {
  const {
    defaultDuration = 15000,
    teleportThresholdKm = 0.1,
    teleportDuration = 20000,
    snapThresholdKm = 2.0,
    onPositionUpdate = null
  } = options

  const [interpolatedLocation, setInterpolatedLocation] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const prevLocationRef = useRef(null)
  const targetLocationRef = useRef(null)
  const animStartTimeRef = useRef(null)
  const animDurationRef = useRef(defaultDuration)
  const rafIdRef = useRef(null)
  const currentPositionRef = useRef(null)
  const onPositionUpdateRef = useRef(onPositionUpdate)

  useEffect(() => {
    onPositionUpdateRef.current = onPositionUpdate
  }, [onPositionUpdate])

  const lerp = (a, b, t) => a + (b - a) * t

  const animate = useCallback((timestamp) => {
    const start = animStartTimeRef.current
    const duration = animDurationRef.current
    const prev = prevLocationRef.current
    const target = targetLocationRef.current

    if (!start || !prev || !target) return

    const elapsed = timestamp - start
    const t = Math.min(elapsed / duration, 1)

    const lat = lerp(prev.lat, target.lat, t)
    const lng = lerp(prev.lng, target.lng, t)
    const position = { lat, lng }

    currentPositionRef.current = position

    if (onPositionUpdateRef.current) {
      onPositionUpdateRef.current(position)
    }

    if (t >= 1) {
      setInterpolatedLocation(position)
      setIsAnimating(false)
      return
    }

    rafIdRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (!rawLocation || rawLocation.lat == null || rawLocation.lng == null) return

    const newTarget = { lat: Number(rawLocation.lat), lng: Number(rawLocation.lng) }

    if (!currentPositionRef.current) {
      prevLocationRef.current = newTarget
      targetLocationRef.current = newTarget
      currentPositionRef.current = newTarget
      setInterpolatedLocation(newTarget)
      if (onPositionUpdateRef.current) onPositionUpdateRef.current(newTarget)
      return
    }

    const current = currentPositionRef.current
    const distKm = getDistance(current.lat, current.lng, newTarget.lat, newTarget.lng)

    if (distKm > snapThresholdKm) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      prevLocationRef.current = newTarget
      targetLocationRef.current = newTarget
      currentPositionRef.current = newTarget
      setInterpolatedLocation(newTarget)
      setIsAnimating(false)
      if (onPositionUpdateRef.current) onPositionUpdateRef.current(newTarget)
      return
    }

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)

    prevLocationRef.current = { ...current }
    targetLocationRef.current = newTarget

    const duration = distKm > teleportThresholdKm ? teleportDuration : defaultDuration
    animDurationRef.current = duration
    animStartTimeRef.current = performance.now()
    setIsAnimating(true)

    rafIdRef.current = requestAnimationFrame(animate)
  }, [rawLocation?.lat, rawLocation?.lng, snapThresholdKm, teleportThresholdKm, teleportDuration, defaultDuration, animate])

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return { interpolatedLocation, isAnimating }
}
