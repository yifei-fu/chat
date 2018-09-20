import React, { Component } from 'react'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import { create_room } from '../api/room'
import { frontend_url } from '../api/common'
import TermsModal from './TermsModal'
var QRCode = require('qrcode.react')

export default class NewRoom extends Component {
    constructor (props) {
        super(props)
        this.state = {
            form: {
                name: '',
                description: '',
                public: false
            },
            status: 'ready',
            response: null
        }
        this.api = create_room()
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    get_link () {
        if (!this.state.response) {
            return null
        }
        return frontend_url + `/${this.state.response.id}`
    }
    handleChange (e) {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        this.setState({ form: { ...this.state.form, [e.target.name]: value } })
    }
    handleSubmit (e) {
        this.setState({ status: 'loading' })
        this.api.submit(this.data, (status, response) => {
            this.setState({ status, response })
        })
    }
    render_form () {
        var error_message = ''
        if (this.state.status === 'error') {
            error_message =
                <div class="ui negative message">
                    <p>Network error. Please try again later.</p>
                </div>
        }
        return (
            <div class={`ui ${this.state.status === 'loading' ? 'loading' : ''} form`} >
                {error_message}
                <div class='field'>
                    <label>Name</label>
                    <input placeholder='Name' name='name' value={this.state.name} onChange={this.handleChange} />
                </div>
                <div class='field'>
                    <label>Description</label>
                    <textarea placeholder='Description' name='description' value={this.state.description} onChange={this.handleChange}
                        rows='3' />
                </div>
                <div class='ui toggle checkbox'>
                    <input type='checkbox' name='public' checked={this.state.form.public} onChange={this.handleChange}></input>
                    <label>Public</label>
                </div>
                <div class="ui label">
                    {this.state.form.public ? 'People can discover your room via search' : 'Only people with the link can enter'}
                </div>
                <div class='ui divider' />

                <div class='ui message'>
                    <p>By using this website, you agree to the <TermsModal trigger={<a>Terms of Services</a>}></TermsModal></p>
                </div>
                <button class='ui primary button' onClick={this.handleSubmit}>
                    OK
                </button>
            </div >
        )
    }
    render_response () {
        return (
            <div>
                <p>Here is your chatroom:</p>
                <div class='ui centered card'>
                    <QRCode value={this.get_link()} class='ui centered image' />
                    <div class='content'>
                        <div class='header'>{this.state.form.name}</div>
                        <div class='meta'>{this.state.form.public ? 'Public chatroom' : 'Private chatroom'}</div>
                        <div class='description'>
                            {this.state.form.description}
                        </div>
                    </div>
                    <div class='extra content'>
                        <div class='ui action input'>
                            <input readOnly type='text' value={this.get_link()} />
                            <CopyToClipboard text={this.get_link()}>
                                <button class='ui teal icon right button'>
                                    <i aria-hidden='true' class='copy icon' />

                                </button>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render () {
        if (this.state.status === 'success' && this.state.response) {
            return this.render_response()
        } else {
            return this.render_form()
        }
    }
}
