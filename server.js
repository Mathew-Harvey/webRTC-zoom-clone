require ('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')



app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)

})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })
})

if (process.env.PROD) {
    app.use(express.static(path.join(__dirname, './build')))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './build/index.html'))
    })
}

const port = process.env.PORT || 3000
server.listen(port, () => console.log(`server is running on port ${port}`))