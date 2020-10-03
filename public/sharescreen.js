var connection = new RTCMultiConnection();
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

const startElem=document.getElementById("startShare");
const stopElem=document.getElementById("stopShare");
var videoElem=document.createElement("video");
var displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false,
    oneway:true,
};

var timer;
startElem.addEventListener("click", function (evt) {
   
    startCapture();
}, false);


stopElem.addEventListener("click", function (evt) {
  
    stopCapture();
  
}, false);

/* connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
};  */
connection.openOrJoin(ROOM_ID);
connection.videosContainer = document.getElementById('video-grid1');


async function startCapture() {
    try {
     navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(stream=>{
        startElem.style.display="none";
        stopElem.style.display="block";
        connection.session = {
            screen: true,
            oneway: true
        };
        
        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        };
        connection.mediaConstraints.video = true;
     
        connection.addStream(stream);
     
     });
        
    } catch (err) {
        console.error("Error: " + err);
    }
}

connection.onstream = function(event) {

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

    if(event.type === 'local') {
      video.volume = 0;
      try {
          video.setAttributeNode(document.createAttribute('muted'));
      } catch (e) {
          video.setAttribute('muted', true);
      }
    }
    video.id=event.streamid;
    video.srcObject = event.stream;
    video.classList.add("video")
    

    connection.videosContainer.appendChild(video);

};
connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    mediaElement.remove();
}
$(document).ready(()=>{
    $(document).on('click',"video ",function () {  
       
        var v = document.getElementsByTagName("video");
        for (var i = 0; i < v.length; i++) {
          v[i].classList.add("video-active");
          v[i].style.width="100px";
          v[i].style.height="100px";
        }  
        var currentElem=document.getElementById(this.id);
        currentElem.style.width="100%";
        currentElem.style.height="500px";
        currentElem.classList.remove("video-active")
        $("video").first().before(this);
    });
})
