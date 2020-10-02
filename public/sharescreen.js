
const sharePeer = new Peer({
    host: location.hostname,
    port: location.port || (location.protocol === 'https:' ? 443 : 80),
    path: '/peerjs'
    /*  host: "/",
     port: "3001" */
})

var videoElem = document.getElementById("shareScreenVideo")
var startElem = document.getElementById("startShare");
var stopElem = document.getElementById("stopShare");
var peers2 = {}
videoElem.muted = true;

var displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false
};
startElem.addEventListener("click", function (evt) {
    document.getElementById("video-grid").classList.add("video-grid-active");
    document.getElementById("video-grid1").classList.add("video-grid1-active");
    startElem.style.display = "none";
    stopElem.style.display = "block";
    var v = document.getElementsByTagName("video");
    for (var i = 0; i < v.length; i++) {
        v[i].classList.add("video-active");
    }
    videoElem.style.display = "block";
    videoElem.style.height = "500px";
    videoElem.style.width = "100%";

    startCapture();
}, false);

stopElem.addEventListener("click", function (evt) {
    stopShare();
    stopCapture();
}, false);

async function startCapture() {
    try {
        navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(stram => {
            videoElem.srcObject = stram;
            socket.emit("share", "share");
            sharePeer.on('call', call => {
                alert();
                call.answer(stream)
                const video = document.getElementById('shareScreenVideo')
                call.on('stream', userVideoStream => {
                    addShareStream(video, userVideoStream)
                })
            })
            socket.on('share', userId => {
                connectToNewUser(userId, stram)
            });
        });

    } catch (err) {
        console.error("Error: " + err);
    }
}
function connectNewShare(userId, stream) {
    const call = sharePeer.call(userId, stream)
    const video = document.getElementById('shareScreenVideo')
    call.on('stream', userShareStream => {
        addShareStream(video, userShareStream)
    })
    call.on('close', () => {
        video.remove()
    })
    peers2[userId] = call
}
function addShareStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    document.getElementById("video-grid").classList.add("video-grid-active");
    document.getElementById("video-grid1").classList.add("video-grid1-active");
    var v = document.getElementsByTagName("video");
    for (var i = 0; i < v.length; i++) {
        v[i].classList.add("video-active");
    }
    video.style.display = "block";
    videvideooElem.style.height = "500px";
    video.style.width = "100%";
}
function stopCapture(evt) {
    let tracks = videoElem.srcObject.getTracks();

    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
}
function stopShare() {
    document.getElementById("video-grid").classList.remove("video-grid-active");
    startElem.style.display = "block";
    stopElem.style.display = "none";
    var v = document.getElementsByTagName("video");
    for (var i = 0; i < v.length; i++) {
        v[i].classList.remove("video-active");
    }
    videoElem.style.display = "none";
    videoElem.style.height = "0px";
    videoElem.style.width = "0px";
}