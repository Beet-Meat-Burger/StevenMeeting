
const urlParam = window.location.search;
const urlParams = new URLSearchParams(urlParam);
var chatName = urlParams.get('name')
var controls = "1"
var sharescreen = urlParams.get("screen")
var pjsID = ""
const videocontrols = urlParams.get("control")
var joinleavemessages = true
if(chatName == null){
  chatName = "User"
}
if(sharescreen == null){
  sharescreen = 0
}
function timeNow() {
  var d = new Date(),
    h = (d.getHours()<10?'0':'') + d.getHours(),
    m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    return  h + ':' + m;
}
const timeJoined = timeNow()

var count = 1;
const socket = io('/', {transports: ['polling']})
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}

if(!sharescreen == 1){
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    joinRoom()
    
    myPeer.on('call', call => {
      count = count + 1
      console.log("answer")
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        console.log("add")
        addVideoStream(video, userVideoStream)
      })
    })
  
    socket.on("user-connected", (userId, chatname) => {
      count = count + 1;
      console.log("User Connected", userId);
      if(joinleavemessages == true){
        if(chatname == undefined){
          $("ul").append(`<li class="message"><b style="color:#ffffff"></b><br/>A User Joined The Meeting</li>`);
        }else{
          $("ul").append(`<li class="message"><b style="color:#ffffff"></b><br/>${chatname} Joined The Meeting</li>`);
        }
      }
      setTimeout(connectToNewUser,100,userId,stream)
   });
  
    
    // input value
    let text = $("input");
    // when press enter send message
    $('html').keydown(function (e) {
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit('message', text.val(), chatName);
        text.val('')
      }
    });
    socket.on("createMessage", (message, name) => {
      $("ul").append(`<li class="message"><b>${name}</b><br/>${message}</li>`);
      scrollToBottom()
    })
  })
}else{
  navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
  }).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    joinRoom()

    myPeer.on('call', call => {
      count = count + 1
      console.log("answer")
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        console.log("add")
        addVideoStream(video, userVideoStream)
      })
    })
  
    socket.on("user-connected", (userId, chatname) => {
      count = count + 1;
      console.log("User Connected", userId);
      if(joinleavemessages == true){
        if(chatname == undefined){
          $("ul").append(`<li class="message"><b style="color:#ffffff"></b><br/>A User Joined The Meeting</li>`);
        }else{
          $("ul").append(`<li class="message"><b style="color:#ffffff"></b><br/>${chatname} Joined The Meeting</li>`);
        }
      }
      setTimeout(connectToNewUser,100,userId,stream)
   });
  
    
    // input value
    let text = $("input");
    // when press enter send message
    $('html').keydown(function (e) {
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit('message', text.val(), chatName);
        text.val('')
      }
    });
    socket.on("createMessage", (message, name) => {
      $("ul").append(`<li class="message"><b>${name}</b><br/>${message}</li>`);
      scrollToBottom()
    })
  })
}


socket.on('user-disconnected', (userId, chatname) => {
  console.log("user disconnected")
  var elementExists = document.getElementById(userId);
  if (peers[userId] && elementExists && chatname != "etvtvshtvhfbfgzfvggvryvrgvegter" && joinleavemessages == true){
    if(chatname == undefined){
      $("ul").append(`<li class="message"><b style="color:#F75D59"></b><br/>A User Left The Meeting</li>`);
    }else{
      $("ul").append(`<li class="message"><b style="color:#F75D59"></b><br/>${chatname} Left The Meeting</li>`);
    }
  }
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  //socket.emit('join-room', ROOM_ID, id, chatName)
  pjsID = id
})

function connectToNewUser(userId, stream) {
    console.log("call")
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    video.id = userId
    call.on('stream', userVideoStream => {
      console.log("stream")
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      count = count - 1
      console.log("remove")
      video.remove()
    })

  peers[userId] = call
}

function joinRoom(){
  socket.emit('join-room', ROOM_ID, pjsID, chatName)
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
    video.controls = true;
  })
  videoGrid.append(video)
}



const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const quitMeeting = () => {
  socket.emit('byebye', chatName);
  setTimeout(function() {
    window.location.replace("about:blank");
  }, 1000);

}

const info = () => {

  $("ul").append(`<li class="message"><b></b><br/></li>`);
  $("ul").append(`<li class="message"><b style="color:#90EE90">StevenMeeting Info</b><br/>${chatName}, Joined at ${timeJoined}.</li>`);
  $("ul").append(`<li class="message"><b></b><br/></li>`);
  $("ul").append(`<li class="message"><b>Number Of Participants:</b><br/>${count}</li>`);
  $("ul").append(`<li class="message"><b></b><br/></li>`);
  $("ul").append(`<li class="message"><b>Room ID:</b><br/>${ROOM_ID}</li>`);
  $("ul").append(`<li class="message"><b></b><br/></li>`);
  scrollToBottom()
}

const invite = () => {

  $("ul").append(`<li class="message"><b></b><br/></li>`);
  $("ul").append(`<li class="message"><b style="color:#90EE90">Invitation Link:</b><br/><a href="${window.location.href.replace("?name=" + chatName, "")}">${window.location.href.replace("?name=" + chatName, "")}</a></li>`);
 
  scrollToBottom()
}

const rename = () => {
  let newName = prompt("Please enter new name:", chatName);
  if (newName != null && newName != "" && newName != " ") {
    chatName = newName
  }
}

const more = () => {
  let mode = prompt("1 Send Chat Message | 2 Toggle Join/Leave Messages | 3 Quit Silently | 4 Share Screen", "1");

if (mode != null) {
  if(mode == 1){
    let text = $("input");
    if (text.val().length !== 0) {
      socket.emit('message', text.val(), chatName);
      text.val('')
    }
  }else if(mode == 2){
    joinleavemessages = confirm("Enable Join/Leave Messages?");
  }else if(mode == 3){
    socket.emit('byebye', "etvtvshtvhfbfgzfvggvryvrgvegter");
    $("ul").append(`<li class="message"><b></b><br/></li>`);
    $("ul").append(`<li class="message"><b style="color:#FF0000">Silently Left Meeting</b><br/></li>`);
  }else if(mode == 4){
    if(confirm("Share Screen Now?")){
      window.open("/" + ROOM_ID + "?name=" + chatName + "&screen=1", '_blank').focus();
    }
  }
}
}