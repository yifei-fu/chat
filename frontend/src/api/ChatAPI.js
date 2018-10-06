import { ws_url } from './common'
// todo: don't send when state is in connection.
export default class ChatAPI {
    constructor (room_id, username) {
        this.room_id = room_id
        this.username = username
        this.callbacks = {}
        this.events = ['open', 'message', 'response', 'event', 'error', 'close']

        // get WebSocket connection
        const ws = new WebSocket(ws_url)
        this.ws = ws
        // bind events
        ws.onopen = () => {
            var init_req = { action: 'init', room_id: this.room_id }
            if (username !== 'undefined') {
                init_req.username = username
            }
            ws.send(JSON.stringify(init_req))
            if (this.callbacks.open) {
                this.callbacks.open()
            }
        }
        // bind: set this to current ChatAPI instance
        ws.onmessage = this.handle_message.bind(this)
    }
    on (event, callback) {
        if (this.events.indexOf(event) === -1) {
            const error_message = 'Invalid event for ChatAPI'
            throw error_message
        }
        this.callbacks.event = callback
    }
    handle_message (event) {
        try {
            var data = JSON.parse(event.data)
        } catch (err) {
            console.log(`Unable to parse server response: ${err}`)
        }
        // message: all messages from the server (responses + events)
        // response: responses to requests
        // event: broadcasted events
        if (this.callbacks.message) {
            this.callbacks.message(data)
        }
        // dispatch by message type
        switch (data.type) {
        case 'response':
            if (this.callbacks.response) {
                this.callbacks.response(data)
            }
            break
        case 'event':
            if (this.callbacks.event) {
                this.callbacks.event(data)
            }
        }
    }
    ready () {
        return this.ws && this.ws.readyState
    }
    send_message(message) {
        const not_ready_exception = 'WebSocket is not in ready state'
        if (!this.ready())
            throw not_ready_exception
        this.ws.send(JSON.stringify({
            action: 'send',
            message
        }))
    }
}
