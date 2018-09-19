const current_domain = function () {
    var domain = window.location.hostname
    // add port number if necessary
    if (!new Set(['', 80, '80']).has(window.location.port)) {
        domain += `:${window.location.port}`
    }
    return domain
}

const api_url = ''

const frontend_url = current_domain()

export { api_url, frontend_url }
