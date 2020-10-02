const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const path = require("path");
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use('/peerjs', require('peer').ExpressPeerServer(server, {
  debug: true
}))

app.get('/', (req, res) => {
  res.render("index")
})

app.get("/room/:name", (req, res) => {
  res.redirect(`/${uuidV4()}_${req.params.name}`)
})
app.get('/:room', (req, res) => {
  try{
    var query=req.params.room.split("_");
    if(query[1]==""||query==null){
      res.redirect("/");
    }else{
      res.render('room', { roomId:query[0],name:query[1]})
    }
  }catch(e){
    res.redirect("/");
  }
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('chat message', (msg,name) => {
      io.to(roomId).emit("chat message", msg,name);
    });

    socket.on("draw",data=>{
      io.to(roomId).emit("draw",data)
    })
    socket.on("stopCanvas",data=>{
      io.to(roomId).emit("stopCanvas",data)
    })
    socket.on("share",data=>{
     
      io.to(roomId).emit("share",userId)
    })
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("listening 3000 port")
})