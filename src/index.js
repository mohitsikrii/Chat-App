const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('./utils/messages')
const { getAllUsersInRoom,addUser,removeUser,getUser } = require('./utils/users')

//=====

const app = express()
const server = http.createServer(app)
const io = socketio(server)
//=======


const port = process.env.PORT || 3000
const directoryPath = path.join(__dirname, '../public')

app.use(express.static(directoryPath))


//===========================
io.on('connection', (socket) => {

    socket.on('join', ( options,callback) => {
        const {error , user} = addUser({id: socket.id ,...options})
        if (error){
            return callback(error)
        }


        socket.emit('message', generateMessage('Admin','welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined!`))
        socket.join(user.room)
        io.to(user.room).emit('RoomData' ,{
            room:user.room,
            users:getAllUsersInRoom(user.room)
        })
        callback()
    }) 

    //=================

    socket.on('sendMessage', (message, callback) => {
        const user= getUser(socket.id)

        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback("Ye nhi chalega yaha par")
        }
        //===================

        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
    })
    socket.on('disconnect', () => {
        const user=removeUser(socket.id)
        if (user)
        {
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left`))
            io.to(user.room).emit('RoomData',{
                room:user.room,
                users:getAllUsersInRoom(user.room)

            })
        }
        
    })
    socket.on('locsent', (location, callback) => {
        const user= getUser(socket.id)

        io.to(user.room).emit('locationmessage', generateLocation(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })
})
//=============================
// let count=0
// io.on('connection',(socket)=>{
//     console.log('hi there')
//     socket.emit('Updated Count is :', count)

//     socket.on('increment',()=>{
//         count++
//         io.emit('Updated Count is :', count)
//     })
// })
//===============================

server.listen(port, () => {
    console.log('Server is up on port 3000')
})
