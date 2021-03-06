import axios from 'axios'
import { api_url } from './common'
// functions that return api objects for generic resources
// callback accepts two params: status ('success' or 'error') and data (all loaded data)

export function fetch_room_by_id (id, callback) {
    var api = {
        response: null,
        callback,
        status: 'loading'
    }
    axios.request({
        url: api_url + `/api/room/${id}`,
        method: 'get'
    }).then(response => {
        api.status = 'success'
        api.response = response.data
        if (callback) { api.callback('success', api.response) }
    }).catch(error => {
        api.status = 'error'
        console.log(error)
        if (callback) { api.callback('error', null) }
    })
    return api
}

export function create_room () {
    var api = {
        response: null,
        status: 'ready',
        submit: function (data, callback) {
            this.status = 'loading'
            axios.post(
                api_url + '/api/room',
                data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                api.status = 'success'
                api.response = response.data
                if (callback) { callback('success', api.response) }
            }).catch(error => {
                this.status = 'error'
                console.log(error)
                if (callback) { callback('error', null) }
            })
        }
    }
    return api
}
