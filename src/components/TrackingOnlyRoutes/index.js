import React from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import loadable from '@loadable/component'

import { lazyRetry } from '../LazyRetry'
import { useSession } from '~components/contexts/SessionContext'

const TrackingHomePage = loadable(() => lazyRetry(() => import('../../pages/TrackingHome')))
const OrderDetailsPage = loadable(() => lazyRetry(() => import('../../pages/OrderDetails')))

export const TrackingOnlyRoutes = () => {
  const location = useLocation()
  const [{ auth }] = useSession()
  const hashKey = new URLSearchParams(location.search).get('hash') || null
  const canOpenOrder = !!auth || !!hashKey

  return (
    <Switch>
      <Route exact path={['/', '/home']}>
        <TrackingHomePage />
      </Route>
      <Route exact path='/orders/:orderId'>
        {canOpenOrder ? <OrderDetailsPage /> : <Redirect to='/' />}
      </Route>
      <Route path='*'>
        <Redirect to='/' />
      </Route>
    </Switch>
  )
}

export default TrackingOnlyRoutes
