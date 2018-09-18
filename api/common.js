const environment = process.env.NODE_ENV

// Get db and WebSocket port config from environmental variables
if (environment === 'production') {
    console.assert(process.env.MONGODB, 'MongoDB connection URL not specified in environment variables')
}
const mongodb_url = process.env.MONGODB || 'mongodb://localhost:27017/chat'

module.exports = { mongodb_url }
