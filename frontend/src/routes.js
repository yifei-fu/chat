import React from 'react'
import { Switch, Route } from 'react-router-dom'

/**
 * Import all page components here
 */
import NewRoom from './components/NewRoom'

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
    <Switch>
        <Route exact path='/' component={NewRoom} />
    </Switch>
)
