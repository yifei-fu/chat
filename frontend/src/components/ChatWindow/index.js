import React, { Component } from 'react'
import ChatAPI from '../../api/ChatAPI'

import { Header } from 'semantic-ui-react'
import MessageList from './MessageList'
import InputForm from './InputForm'
import './ChatWindow.css'

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
                <Header as='h1' color='grey' inverted block>
                    Room ID = {this.props.id}
                </Header>
                <div className='chat-window-container'>

                    <MessageList
                        className='message-list'
                        data={this.state.messages}>
                    </MessageList>
                    <InputForm className='input-form' api={this.chat_api}></InputForm>
                </div>
            </div>
            
        )
    }
}
