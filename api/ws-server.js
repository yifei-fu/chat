const WebSocket = require('ws')
var app = require('../app')
const common = require('./common')

// Create a server for both http and ws
const http_server = require('http').createServer(app)
const wss = new WebSocket.Server({ server: http_server })

// WebSocket API implementation
const default_username = 'ANON'
const ws_init_timeout = 10000 // time allowed for client to send init action request in ms

var ws_by_room = {} // object mapping room to clients

// Client info associated with each ws
var Client = function (init_request) {
    // check required fields
    if (!init_request.room_id) {
        return
    }
    this.room_id = init_request.room_id
    this.username = init_request.username || default_username
}

/*
    JSON messages from the server via WebSocket:
    * type: event | response
        For responses:
            * id: responding to which request
            * status: success | error
            * message
        For events:
            * event_type: chat_message | user_join | user_leave | user_change_username
            * ...
 */

// Two types of server responses
var build_response = function (ws, req, status, message) {
    return JSON.stringify(
        {
            type: 'response',
            status,
            message,
            id: (req && req.id) ? req.id : null
        }
    )
}
var build_event = function (ws, event_type, body) {
    const response = { type: 'event', event_type, ...body, time: Date.now() }
    return JSON.stringify(response)
}

var ws_send = function (ws, message) {
    if (ws.readyState !== ws.OPEN) {
        ws.close()
        return false
    }
    ws.send(message)
    return true
}
var broadcast = function (room_id, message) {
    if (!ws_by_room[room_id]) {
        return
    }
    ws_by_room[room_id].forEach(ws => {
        ws_send(ws, message)
    })
}

var handle_request = {
    actions: {
        init: (ws, req) => {
            var client = new Client(req)
            if (!client) {
                ws_send(ws, build_response(ws, req, 'error', 'Invalid init request'))
            }
            ws.client = client
            if (!ws_by_room[client.room_id]) {
                ws_by_room[client.room_id] = new Set()
            }
            ws_by_room[client.room_id].add(ws)

            broadcast(ws.client.room_id, build_event(ws, 'user_join', { user: ws.client.username }))
        },
        set_username: (ws, req) => {
            var old_name = ws.client.username
            var new_name = req.username
            if (!new_name) {
                ws.client.username = default_username
            }
            broadcast(ws.client.room_id, build_event(ws, 'user_change_username', { old_name, new_name })
            )
        },
        send: (ws, req) => {
            broadcast(ws.client.room_id,
                build_event(ws, 'chat_message', { user: ws.client.username, message: req.message || '' }))
        }
    },
    // method to handle request
    dispatch: function (ws, req) {
        // check if the connection is initialized
        if (!ws.client && req.action !== 'init') {
            ws_send(ws, build_response(ws, req, 'error', 'ws not initialized'))
            return
        }

        var handle_func = this.actions[req.action]
        if (!handle_func) {
            ws_send(ws, build_response(ws, req, 'error', 'Invalid request action'))
            return
        }
        handle_func(ws, req)
    }
}

wss.on('connection', function (ws) {
    // allow a certain time for init before closing the connection
    setTimeout(function () {
        if (!ws.client) {
            ws.close()
        }
    }, ws_init_timeout)

    ws.on('message', function (message) {
        try {
            var request = JSON.parse(message)
        } catch (error) {
            ws_send(ws, build_response(ws, request, 'error', 'Failed to parse request body'))
            return
        }
        handle_request.dispatch(ws, request)
    })

    ws.on('close', function () {
        if (!ws.client) {
            return
        }
        broadcast(ws.client.room_id,
            build_event(ws, 'user_leave', { user: ws.client.username }))

        // clean up empty room
        if (ws_by_room[ws.client.room_id] &&
            ws_by_room[ws.client.room_id].size === 0) {
            delete ws_by_room[ws.client.room_id]
        }
    })
})

module.exports = http_server
