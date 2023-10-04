const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
const server = require('http').Server(app)
const pjs = require('http').Server(app)

const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(pjs, {
  debug: true
});
pjs.listen(3000)

const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}` + "?name=User")
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId, chatname) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId, chatname)
    // messages
    socket.on('message', (message, name) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message, name)
  }); 

    socket.on('byebye', (chatname) => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId, chatname)
      socket.broadcast.to(roomId).emit('user-disconnected', userId, chatname)
      socket.broadcast.to(roomId).emit('user-disconnected', userId, chatname)
    })

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId, undefined)
      socket.broadcast.to(roomId).emit('user-disconnected', userId, undefined)
      socket.broadcast.to(roomId).emit('user-disconnected', userId, undefined)
    })
  })
})

server.listen(process.env.PORT||3030)
