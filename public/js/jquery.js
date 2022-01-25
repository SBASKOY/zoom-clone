

$(document).ready(() => {


    $("#startChat").click(() => {
        NAME = $("#getName").val();
        if (!NAME) {
            alert("Lütfen isin giriniz");
        } else {
            $(".chat-panel").css("padding-top", "40px")
            $(".chat-panel").css("height", "94%")
            $(".chat-panel-start-chat").hide();
            $(".chat").show();
        }
    })
    $("#copyLink").click(() => {

        var dummy = document.createElement('input'),
            text = window.location.href;

        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
    })
    $("#toggleMenu").click(() => {
        $(".chat-panel").toggleClass("chat-panel-active");
    })

    $(document).on('click', "video ", function () {
       // if(isCanvas)return;
        fullScreen = true;
        document.getElementById("reset").style.display="block"
        var v = document.getElementsByTagName("video");
       
        for (var i = 0; i < v.length; i++) {
            v[i].classList.add("video-active");
            v[i].style.width = "150px";
            v[i].style.height = "150px";
            v[i].removeEventListener("click", f);
        }
        var currentElem = document.getElementById(this.id);
        currentElem.addEventListener("click", f)
        currentElem.style.width = "auto";
        currentElem.style.height = "95%";
        currentElem.classList.remove("video-active")
        currentElem.style.float="bottom"
        $("video").first().before(this);
    });
    document.getElementById("reset").addEventListener("click",()=>{
        if(isCanvas)return;
        document.getElementById("reset").style.display="none"
        fullScreen=false;
        var v = document.getElementsByTagName("video");
           
        for (var i = 0; i < v.length; i++) {
            v[i].classList.remove("video-active");
            v[i].style.width = "300px";
            v[i].style.height = "300px";
            v[i].removeEventListener("click", f);
        }
    })
})
function f() {

    var v = document.getElementsByTagName("video");
    for (var i = 0; i < v.length; i++) {
        v[i].classList.remove("video-active");
        v[i].style.width = "300px";
        v[i].style.height = "300px";
    }
}

