import React, { Component } from 'react'
import { Message, Label } from 'semantic-ui-react'
import './ChatMessage.css'

export default class ChatMessage extends Component {
    get_username () {
        const default_username = 'Anonymous'
        return this.props.data.user || default_username
    }
    get_event_message () {
        // returns descriptions for events other than user_message
        switch (this.props.data.event_type) {
        case 'user_join':
            return `${this.get_username()} joined the room.`
        case 'user_leave':
            return `${this.get_username()} left the room.`
        case 'user_change_username':
            return `${this.props.data.old_name} changed name to ${this.props.data.new_name}`
        }
    }
    render_chat_message () {
        const message_class = 'message-' + (this.props.data.sender_type || 'other')
        return (
            <div className={message_class}>
                <div className='username' style={{ display: 'block' }}>
                    {this.get_username()}
                </div>
                <Message compact className='ui message'>{this.props.data.message}</Message>
            </div>
        )
    }
    render () {
        if (!this.props.data) {
            return (null)
        }
        var content
        switch (this.props.data.event_type) {
        case 'chat_message':
            content = this.render_chat_message()
            break
        default:
            content = <label>{this.get_event_message()}</label>
        }

        return (
            <div className='message-wrapper'>
                {content}
            </div>
        )
    }
}
