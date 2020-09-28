
var app=require("express")();
var http=require("http").createServer(app);
var io=require("socket.io")(http); 

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")
})
 
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("sendmessage",(msg)=>{
        console.log("message:"+msg)
        socket.broadcast.emit('hi');
        io.emit("sendmessage",msg);
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

const PORT = process.env.PORT || 3000;
http.listen(PORT,()=>{
    console.log("listening 3000 port")
})
