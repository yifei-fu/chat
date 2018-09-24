import React, { Component } from 'react'
import { Input, Label } from 'semantic-ui-react'
import './InputForm.css'

export default class ChatMessage extends Component {
    constructor (props) {
        super(props)
        this.api = props.api
        this.state = {
            value: '',
            status: this.api? this.api.status:'error'
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange (e) {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        this.setState({ form: { ...this.state.form, [e.target.name]: value } })
    }
    handleSubmit (e) {
        e.preventDefault()
        this.api && this.api.submit(this.data, (status, response) => {
            this.setState({ status, response })
        })
        return false
    }

    render () {
        return (
            <form className='input-form' onSubmit = {this.handleSubmit}>
                <Input fluid onChange={this.handleChange} icon={{ name: 'angle right', link: true, onClick:this.handleSubmit }} />
            </form>
        )
    }
}
