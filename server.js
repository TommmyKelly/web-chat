const path = require('path')
const express = require('express');
const app = express();
const http = require('http')
const PORT = process.env.PORT || 3000;
const socketio = require('socket.io')
const server = http.createServer(app)
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')
//const   EmojiButton =  require('@joeattardi/emoji-button');

const botName = 'ChatCord Bot'

io = socketio(server)
// Use Static folder

app.use(express.static(path.join(__dirname, 'public')))


//Run when a client connects

io.on('connection', socket =>{
    socket.on('joinRoom', ({username, room}) =>{
        const user = userJoin(socket.id, username, room)

        socket.join(user.room);

        //welcome user
     socket.emit('message', formatMessage(botName,'Welcome to chatCord'))

    // brodcast when a user joins

        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined`))

        //send users and room info

     io.to(user.room).emit('roomUsers',{
         room: user.room,
         users: getRoomUsers(user.room)
     })
    })

    //Listen for chat message form client
        socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username, msg))
    })

     // run when a client has disconnected

     socket.on('disconnect', () => {
         const user = userLeave(socket.id);

         if(user){
            io.to(user.room).emit('message',formatMessage(botName, `${user.username} has left the chat`)) 
            // Send users and room info on disconnect
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            })
         }



        
    })

    
})


server.listen(PORT,() => console.log(`listening on port ${PORT}`))
