import React, { Component } from 'react'
import ChatMessage from './ChatMessage'

export default class MessageList extends Component {
    get_list () {
        if (!this.props.data) {
            return (null)
        }
        return this.props.data.map((item, index) =>
            <ChatMessage data={item} key={index}></ChatMessage>
        )
    }
    render () {
        return (
            <div class='message-list'>
                {this.get_list()}
            </div>
        )
    }
}
