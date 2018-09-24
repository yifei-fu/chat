import React, { Component } from 'react'
import { base_url, create_room } from '../../api/room'
import { TextArea } from 'semantic-ui-react'
import MessageList from './MessageList'
import InputForm from './InputForm'

export default class ChatWindow extends Component {
    constructor (props) {
        super(props)
        this.state = {
            messages: []
        }
    }
    render () {
        return (
            <div>
                <MessageList
                    data={this.state.messages}>
                </MessageList>
                <InputForm></InputForm>
            </div>
        )
    }
}
