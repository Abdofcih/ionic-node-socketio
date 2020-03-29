const express = require('express')
const path = require('path')
const http = require('http');
const socketio = require('socket.io');
const  Filter = require('bad-words')
const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server);

const {generateMessage, generateLocationMessage} = require('./utils/message')
const { addUser, removeUser, getUser,getUsersInRoom} = require('./utils/users')


io.on('connection', function(socket){
    console.log('a user connected');


   socket.on('join',(userData ,callback)=>{
       console.log("a user joined")
       console.log(userData)
       const {error, user} = addUser({id:socket.id, ...userData})

       if(error)
        return callback(error);

       socket.join(user.room)

       socket.broadcast.to(user.room).emit('serverSendMsg',generateMessage('Admin',`${user.username} has joined the game`));
     
       io.to(user.room).emit('roomData',{
           room: user.room,
           users:getUsersInRoom(user.room)
       })
       callback()
   })


   socket.on("userVisitChatPage",()=>{
    socket.emit('serverSendMsg',generateMessage('Admin','Welcome to Tic Tac Toe!'));
   })

   socket.on("sendTurnResult",({player, index})=>{
    const user = getUser(socket.id)
    io.to(user.room).emit("sendTurnResult",{username:user.username, index})
   })


    socket.on('clientSendMsg',(msg,callback)=>{
        var filter = new Filter()
        filter.addWords('bad')
        const user = getUser(socket.id)
        io.to(user.room).emit('serverSendMsg',generateMessage(user.username,filter.clean(msg)))
        callback(filter.clean(msg))
    })

    socket.on('disconnect',()=>{

        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('serverSendMsg',generateMessage('Admin',`${user.username} Leave`));
            io.to(user.room).emit('roomData',{
                room: user.room,
                users:getUsersInRoom(user.room)
            })
        }
         
    })
  });

server.listen(port, () => console.log(`App listening on port ${port}`))