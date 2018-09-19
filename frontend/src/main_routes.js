import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NewRoom from './components/NewRoom'
import PageNotFound from './views/PageNotFound'
import Room from './views/Room'
const MainRoutes = () => (
    <main>
        <Switch>
            <Route exact path='/' component={NewRoom} />
            <Route exact path='/:room_id' component={Room} />
            <Route exact path='*' component={PageNotFound} />
        </Switch>
    </main>
)
export default MainRoutes
