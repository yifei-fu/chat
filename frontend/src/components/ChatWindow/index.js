import React, { Component } from 'react'
import ChatAPI from '../../api/ChatAPI'

import { TextArea } from 'semantic-ui-react'
import MessageList from './MessageList'
import InputForm from './InputForm'

export default class ChatWindow extends Component {
    constructor (props) {
        super(props)
        this.state = {
            messages: []
        }
        this.chat_api = new ChatAPI(this.props.id)
        this.chat_api.on('event', (data) => {
            console.log(data)
            this.setState({
                messages: this.state.messages.concat([data])
            })
        })
    }
    render () {
        return (
            <div>
                <MessageList
                    data={this.state.messages}>
                </MessageList>
                <InputForm api={this.chat_api}></InputForm>
            </div>
        )
    }
}
