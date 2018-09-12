var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true })
mongoose.connection.on('error', console.error.bind(console, 'connection error:'))

var roomSchema = new mongoose.Schema({
    name: String,
    description: String,
    expire_time: Number,
    public: Boolean
})

roomSchema.methods.json = function () {
    return { id: this._id, name: this.name, description: this.description, public: this.public }
}

var Room = mongoose.model('Room', roomSchema)

/* GET list of public rooms */
router.get('/', function (req, res, next) {
    Room.find({ public: true }, (err, rooms) => {
        if (err) {
            console.error(err)
            res.json(500, { 'message': err.message })
        }

        // rename _id to id and remove __v member
        rooms = rooms.map((room) => room.json())

        res.json({ result: rooms })
    })
})

/* GET details of a public room */
router.get('/:id', function (req, res, next) {
    Room.findById(req.params.id, function (err, room) {
        if (err) {
            console.log(err.message)
            res.status(400).json({ message: err.message })
            return
        }
        if (!room) {
            res.status(404).json({ message: `Room with ${req.params.id} not found.` })
            return
        }
        res.json(room.json())
    })
})

/* PUT update details of a public room */
router.put('/:id', function (req, res, next) {
    Room.findById(req.params.id, function (err, room) {
        if (err) {
            console.log(err.message)
            res.status(400).json({ message: err.message })
            return
        }
        if (!room) {
            res.status(404).json({ message: `Room with ${req.params.id} not found.` })
            return
        }
        const attrs = ['name', 'description', 'expire_time', 'public']
        attrs.forEach((attr) => {
            if (req.body[attr]) {
                room[attr] = req.body[attr]
            }
        })
        room.save(function (err, room) {
            if (err) {
                res.status(400).json({ message: err.message })
            } else {
                res.json(room.json())
            }
        })
    })
})

/* POST create a new room */
router.post('/', function (req, res, next) {
    var data = req.body
    // remove unsafe attrs
    delete data._id

    var room = new Room(data)
    room.save(function (err, obj) {
        if (err) return console.error(err)
        res.json(500, { message: err.message })
    })
    res.json({ id: room._id })
})

module.exports = router
