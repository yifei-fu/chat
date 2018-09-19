import React, { Component } from 'react'
import { base_url, create_room } from '../api/room'

export default class Room extends Component {
    constructor (props) {
        super(props)
        this.state = {
            room_id: this.props.match.params.room_id
        }
    }
    render () {
        return (
            <p>{this.state.room_id}</p>
        )
    }
}
