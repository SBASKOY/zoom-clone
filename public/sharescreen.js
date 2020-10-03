

const startElem=document.getElementById("startShare");
const stopElem=document.getElementById("stopShare");

var timer;
startElem.addEventListener("click", function (evt) {
    document.getElementById("video-grid").classList.add("video-grid-active");
    document.getElementById("video-grid1").classList.add("video-grid1-active");
    startElem.style.display = "none";
    stopElem.style.display = "block";
    var v = document.getElementsByTagName("video");
    for (var i = 0; i < v.length; i++) {
        v[i].classList.add("video-active");
    }
    document.getElementById("image").style.display="block"
  
  
        socket.emit("start","ada");
 
}, false);

socket.on("image",img=>{
   
    var image=document.getElementById("image");
    image.src="#"
    image.style.width="100%";
    image.style.height="500px";
    image.src=`data:image/jpg;base64,${img}`; ;
})

stopElem.addEventListener("click", function (evt) {
    stopShare();
  
}, false);

function stopShare() {
    document.getElementById("video-grid").classList.remove("video-grid-active");
    startElem.style.display = "block";
    stopElem.style.display = "none";
    var v = document.getElementsByTagName("video");
    for (var i = 0; i < v.length; i++) {
        v[i].classList.remove("video-active");
    }
    document.getElementById("image").style.display="none";
    socket.emit("stop");
}