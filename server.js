const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid');
const fs=require("fs");
const path = require("path");
const bodyParser = require('body-parser');
var filesSystem = './filesSystem/';

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.json());
app.use('/peerjs', require('peer').ExpressPeerServer(server, {
  debug: true
}))

var allfiles=[]
app.get('/', (req, res) => {

  fs.readdirSync(filesSystem).forEach(file => {
  
    allfiles.push(file)
  });
  
  res.render("index")
})
// ! DİKKAT
app.post("/folder",(req,res)=>{
  console.log(filesSystem+req.body.path)
   var files=[]
  fs.readdirSync(filesSystem+req.body.path).forEach(file => {
    files.push(file)
  });
  
  res.send({folder:files})
})

app.get("/room/:name", (req, res) => {
  res.redirect(`/${uuidV4()}`)
})
app.get('/:room', (req, res) => {
  try{

     // res.render('room', { roomId:req.params.room})
      res.render('room2',{ roomId:req.params.room})
    
  }catch(e){
    console.log(e)
    res.redirect("/");
  }
})
var timer;
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('chat message', (msg,name,color) => {
      io.to(roomId).emit("chat message", msg,name,color);
    });

    socket.on("draw",data=>{
      socket.broadcast.to(roomId).emit('draw', data);
      //io.to(roomId).emit("draw",data)
    })
    socket.on("stopCanvas",data=>{
      socket.broadcast.to(roomId).emit("stopCanvas",data)
    })
 
    socket.on("share",_=>{
      io.to(roomId).emit("share",userId)
    });


    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("listening 3000 port")
})