import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'

export const ScrollToTop = withRouter(({ history, children }) => {
  const pathsToAvoid = ['/messages']
  const isAvoidMinHeight = pathsToAvoid.some(path => window.location.pathname.includes(path))

  const styles = {
    minHeight: isAvoidMinHeight ? 'auto' : '100vh'
  }

  useEffect(() => {
    const elements = document.getElementsByTagName('title')
    const elementsToAvoid = []
    const routesToMatch = ['route-business']
    for (const item of elements) {
      elementsToAvoid.push(routesToMatch.includes(item?.id))
    }
    const unlisten = history.listen((data) => {
      if (!window.location.pathname.includes('/store/') && !elementsToAvoid.some(e => e)) {
        window.scrollTo(0, 0)
      }
    })
    return () => {
      unlisten()
    }
  }, [])

  return <div style={styles}>{children}</div>
})

export default ScrollToTop
