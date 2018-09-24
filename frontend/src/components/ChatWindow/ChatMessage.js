import React, { Component } from 'react'
import { Message, Label } from 'semantic-ui-react'
import './ChatMessage.css'

export default class ChatMessage extends Component {
    render () {
        const default_username = 'Anonymous'
        const message_class = 'message-' + (this.props.data.sender_type || 'other')

        return (
            <div className='message-wrapper'>
                {
                    this.props.data && (
                        <div className={message_class}>
                            <div className='username' style={{ display: 'block' }}>{this.props.data.username || default_username}</div>
                            <Message compact className='ui message'>{this.props.data.text}</Message>
                        </div>
                    )
                }
            </div>
        )
    }
}
