const current_domain = function () {
    var domain = window.location.hostname
    if (window.location.port !== 80) {
        domain += `:${window.location.port}`
    }
    return domain
}

var api_url
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    api_url = current_domain()
} else {
    api_url = 'http://localhost:3000'
}

const frontend_url = current_domain()

export { api_url, frontend_url }