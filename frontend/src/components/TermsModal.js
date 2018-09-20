import React, { Component } from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'

import Terms from './Terms'

export default class TermsModal extends Component {
    state = { modalOpen: false }
    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })
    render() {
        return (
            <Modal trigger={React.cloneElement(this.props.trigger, {onClick: this.handleOpen})}
                open={this.state.modalOpen}
                onClose={this.handleClose}>
                <Modal.Header>Terms of Services</Modal.Header>
                <Modal.Content scrolling>
                    <Terms />
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={this.handleClose}>
                        <Icon name='checkmark' /> Got it
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}