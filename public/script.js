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
const videoElem=document.getElementById("shareVide");
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
var displayMediaOptions = {
  video: {
      cursor: "always"
  },
  audio: false
};

myPeer.on('open', id => {
  $('form').submit(function (e) {
    e.preventDefault();
    socket.emit('chat message', $('#m').val(),NAME);
    $('#m').val('');
    return false;
  });
  document.getElementById("share").addEventListener("click",function(_event){
    navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then((stream)=>{
      startCapture(videoElem,stream);
      myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userShareScreen => {
          startCapture(video, userShareScreen)
        })
    
      })

    });
  },false)
  socket.emit('join-room', ROOM_ID, id)
})


//await 
async function startCapture(video,stream) {
  try {
    document.getElementById("video-grid").classList.add("video-grid-active")

    video.style.height = "100%"
    video.style.width = "90%"
    video.style.display = "block"
    video.style.zIndex = "5"
    var v = document.getElementsByClassName("video")
    for (var i = 0; i < v.length; i++) {
      v[i].classList.add("video-active")
    }
      video.srcObject = stream;
     
  } catch (err) {
      console.error("Error: " + err);
  }
}
function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
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

