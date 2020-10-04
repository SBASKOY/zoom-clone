const socket = io('/')
const videoGrid = document.getElementById('video-grid1')
const colors = [
  "green", "red", "grey", "aqua", "yellow"
]
const myPeer = new Peer({
  host: location.hostname,
  port: location.port || (location.protocol === 'https:' ? 443 : 80),
  path: '/peerjs'
  /*  host: "/",
   port: "3001" */
})
const myVideo = document.createElement('video')


/* myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  });
}) */

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})
socket.on('chat message', function (msg, name) {
  var div = document.createElement("div");
  div.classList.add("chatdialog");
  div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
  var p = document.createElement("p");
  p.innerText = name;

  var p2 = document.createElement("p");
  var message=urlify(msg);
  p2.innerHTML =message;

  div.appendChild(p);
  div.appendChild(p2);

  $('#chatpanel').append(div);
});
myPeer.on('open', id => {
  $('form').submit(function (e) {
    e.preventDefault();
    socket.emit('chat message', $('#m').val(), NAME);
    $('#m').val('');
    return false;
  });

  socket.emit('join-room', ROOM_ID, id)
})
function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return '<a target="_blank"  href="' + url + '">' + url + '</a>';
  })
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
 
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })
  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  video.classList.add("video")
  videoGrid.append(video)
}

//SHARE CANVAS
var canvas;
var ctx;
var isMouseDown=false;
document.getElementById("shareCanvas").addEventListener("click", () => {
  document.getElementById("video-grid").classList.add("video-grid-active");
  document.getElementById("video-grid1").classList.add("video-grid1-active");
  document.getElementById("toolbar").classList.add("toolbar");
  document.getElementById("toolbar").style.display="block";
  var v = document.getElementsByTagName("video");
  for (var i = 0; i < v.length; i++) {
    v[i].classList.add("video-active");
    v[i].style.width="100px";
    v[i].style.height="100px";
  }
  document.getElementById("shareCanvas").style.display="none";
  document.getElementById("stopCanvas").style.display="block";
  canvas = document.getElementById("canvas");
  canvas.classList.add("canvas");
  canvas.style.display = "block";
  canvas.addEventListener("mousedown",startPainting,false)
  canvas.addEventListener("mousemove",sketch,false)
  canvas.addEventListener("mouseup",stopPainting,false)
  ctx = canvas.getContext("2d");
});
let coord = {x:0 , y:0};  
let paint = false; 
let color="green";
let lineWidth=1;
function getPosition(evt){ 
  var rect = canvas.getBoundingClientRect();

 let x= (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
  let y= (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
  coord.x=x;
  coord.y=y;
} 

function startPainting(event){ 
  getPosition(event); 
  paint = true; 
} 
function stopPainting(){ 
  paint = false; 
} 
    
function sketch(event){ 
  if (paint) {
    ctx.beginPath(); 
    
    ctx.lineWidth = lineWidth; 
    ctx.lineCap = 'round'; 
    ctx.strokeStyle = color; 
    ctx.moveTo(coord.x, coord.y); 
    getPosition(event); 
    ctx.lineTo(coord.x , coord.y);   
    ctx.stroke(); 
    ctx.closePath();
   socket.emit("draw",{
     cord:{
       x:coord.x,
       y:coord.y
     },
     color:color,
     lineWidth:lineWidth
   });
  }; 
}
var lastx;
var lasty;
socket.on("draw",data=>{
  document.getElementById("video-grid").classList.add("video-grid-active");
  document.getElementById("video-grid1").classList.add("video-grid1-active");
  var v = document.getElementsByTagName("video");
  for (var i = 0; i < v.length; i++) {
    v[i].classList.add("video-active");
  }
  canvas = document.getElementById("canvas");
  canvas.classList.add("canvas");
  canvas.style.display = "block";

  ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.lineCap = 'round'; 
  ctx.lineWidth=data.lineWidth;
  ctx.strokeStyle=data.color
  ctx.moveTo(lastx,lasty);
  ctx.lineTo(data.cord.x ,data.cord.y); 
  lastx=data.cord.x;
  lasty=data.cord.y; 
  ctx.stroke();
})
function stopCanvasShare(){
  document.getElementById("video-grid").classList.remove("video-grid-active");
  document.getElementById("toolbar").classList.remove("toolbar");
  document.getElementById("toolbar").style.display="none";
  var v = document.getElementsByTagName("video");
  for (var i = 0; i < v.length; i++) {
    v[i].classList.remove("video-active");
  }
  document.getElementById("shareCanvas").style.display="block";
  document.getElementById("stopCanvas").style.display="none";
  canvas = document.getElementById("canvas");
  canvas.classList.remove("canvas");
  canvas.style.display = "none";
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
document.getElementById("stopCanvas").addEventListener("click", () => {
  coord = {x:0 , y:0};
  stopCanvasShare();
  socket.emit("stopCanvas","stop")
});
socket.on("stopCanvas",data=>{
  stopCanvasShare();
})
$("button").click(function() {
  color=this.id;
});