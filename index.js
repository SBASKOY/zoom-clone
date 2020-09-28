
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);


let socketsArray = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

io.on('connection', (socket) => {

  socket.broadcast.emit('add-users', {
    users: [socket.id]
  });

  socket.on('disconnect', () => {
    socketsArray.splice(socketsArray.indexOf(socket.id), 1);
    io.emit('remove-user', socket.id);
  });

  socket.on('make-offer', function (data) {
    socket.to(data.to).emit('offer-made', {
      offer: data.offer,
      socket: socket.id
    });
  });
  socket.on('make-answer', function (data) {
    socket.to(data.to).emit('answer-made', {
      socket: socket.id,
      answer: data.answer
    });
  });

});



const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("listening 3000 port")
})
