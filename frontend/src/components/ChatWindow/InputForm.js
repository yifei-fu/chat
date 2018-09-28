import React, { Component } from 'react'
import { Input, Label } from 'semantic-ui-react'
import './InputForm.css'

export default class InputForm extends Component {
    constructor (props) {
        super(props)
        this.api = props.api
        this.state = {
            value: '',
            status: this.api ? this.api.status : 'error'
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange (e) {
        this.setState({ value: e.target.value })
    }
    handleSubmit (e) {
        e.preventDefault()
        if (this.api) {
            this.api.send_message(this.state.value)
            this.setState({ value: '' })
        }

        return false
    }

    render () {
        return (
            <form className='input-form' onSubmit = {this.handleSubmit}>
                <Input fluid value={this.state.value} onChange={this.handleChange} icon={{ name: 'angle right', link: true, onClick: this.handleSubmit }} />
            </form>
        )
    }
}
