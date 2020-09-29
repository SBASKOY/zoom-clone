const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const colors=[
  "green","red","grey","aqua","yellow"
]
const myPeer = new Peer({
    host: location.hostname,
    port: location.port || (location.protocol === 'https:' ? 443 : 80),
    path: '/peerjs' 
 /*  host: "/",
  port: "3001" */
})
const myVideo = document.createElement('video')
myVideo.muted = true
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
})


socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})
socket.on('chat message', function (msg,name) {
  var  div=document.createElement("div");
  div.classList.add("chatdialog");
  div.style.backgroundColor=colors[Math.floor(Math.random() * colors.length)]
  var p=document.createElement("p");
  p.innerText=name;

  var p2=document.createElement("p");
  p2.innerText=msg;

  div.appendChild(p);
  div.appendChild(p2);

  $('#chatpanel').append(div);
});

myPeer.on('open', id => {
  $('form').submit(function (e) {
    e.preventDefault();
    socket.emit('chat message', $('#m').val(),NAME);
    $('#m').val('');
    return false;
  });

  socket.emit('join-room', ROOM_ID, id)
})


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
  videoGrid.append(video)
}
