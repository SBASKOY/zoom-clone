function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a target="_blank"  href="' + url + '">' + url + '</a>';
    })

}


const socket = io('/')

const myPeer = new Peer({
    host: location.hostname,
    port: location.port || (location.protocol === 'https:' ? 443 : 80),
    path: '/peerjs'
    /*  host: "/",
     port: "3001" */
})
const colors = [
    "green", "red", "grey", "aqua", "yellow"
]
var currentColor;




$(document).ready(function () {

    socket.on('chat message', function (msg, name, color) {
        var div = document.createElement("div");
        div.classList.add("chatdialog");

        div.style.backgroundColor = color;
        var p = document.createElement("p");
        p.innerText = name;

        var p2 = document.createElement("p");
        var message = urlify(msg);
        p2.innerHTML = message;

        div.appendChild(p);
        div.appendChild(p2);

        $('#chatpanel').append(div);
        $("#chatpanel").animate(
            {
                scrollTop: $('#chatpanel').prop("scrollHeight")
            }, 100);
    });

    myPeer.on('open', id => {
        $('form').submit(function (e) {
            e.preventDefault();
            if (!currentColor) {
                currentColor = colors[Math.floor(Math.random() * colors.length)]
            }
            socket.emit('chat message', $('#m').val(), NAME, currentColor);
            $('#m').val('');
            return false;
        });

        socket.emit('join-room', ROOM_ID, id)
    })
})


// VİDEO İŞLEMLERİ

var connection = new RTCMultiConnection();
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

var videoElem = document.createElement("video");
var displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false,
    oneway: true,
};

var fullScreen = false;
var isCanvas=false;

connection.openOrJoin(ROOM_ID);
connection.videosContainer = document.getElementById('video-grid');



connection.onstream = function (event) {

    console.log("Connection")
    event.mediaElement.removeAttribute('src');
    event.mediaElement.removeAttribute('srcObject');
    event.mediaElement.muted = true;
    event.mediaElement.volume = 0;

    var video = document.createElement('video');

    try {
        video.setAttributeNode(document.createAttribute('autoplay'));
        video.setAttributeNode(document.createAttribute('playsinline'));
    } catch (e) {
        video.setAttribute('autoplay', true);
        video.setAttribute('playsinline', true);
    }

    if (event.type === 'local') {
        video.volume = 0;
        try {
            video.setAttributeNode(document.createAttribute('muted'));
        } catch (e) {
            video.setAttribute('muted', true);
        }
    }
    
    video.id = event.streamid;
    video.srcObject = event.stream;
   
    if (fullScreen || isCanvas) {
        video.classList.add("video-active")
    } else {
        video.classList.add("video")
    }

    console.log("Added")
  
    connection.videosContainer.appendChild(video);

};
connection.onstreamended = function (event) {
    var mediaElement = document.getElementById(event.streamid);
    mediaElement.remove();
}