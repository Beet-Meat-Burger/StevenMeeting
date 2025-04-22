
var count = 1;

const socket = io('/', {transports: ['polling']})
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: pjsPort
})
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}

const quitMeetingFast = () => {
  socket.emit('byebye', chatName);
}
addEventListener("beforeunload", quitMeetingFast);
const handleMediaStream = async (mediaSource, notificationType) => {
  try {
    const stream = await navigator.mediaDevices[mediaSource]({ video: true, audio: true });
    document.getElementById("menu-bar").style.cssText = '';
    document.getElementsByClassName("modal-background")[0].remove();
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    
    setTimeout(joinRoom, 500);

    // Common peer call handler
    myPeer.on('call', call => {
      count++;
      console.log("answer");
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', userVideoStream => {
        console.log("add");
        addVideoStream(video, userVideoStream);
      });
    });

    // Common user connection handler
    const handleUserConnected = (userId, chatname) => {
      count++;
      console.log("User Connected", userId);
      setTimeout(connectToNewUser, 0, userId, stream);

      if (joinleavemessages) {
        const message = chatname ? `${chatname} Joined The Meeting` : "A User Joined The Meeting";
        if (notificationType === 'toast') {
          $(document).trigger("notiEvent", [message, " ", "success", false, "toast-top-center", true, "3000", "1000", "500", "100"]);
        } else {
          $("ul").append(`<li class="message"><b style="color:#ffffff"></b><br/>${message}</li>`);
        }
      }
    };

    // Common message handling
    const setupMessageHandling = () => {
      const text = $("input");
      $('html').off('keydown').on('keydown', e => {
        if (e.which === 13 && text.val().length) {
          socket.emit('message', text.val(), chatName);
          text.val('');
        }
      });

      socket.off("createMessage").on("createMessage", (message, name) => {
        $("ul").append(`<li class="message"><b>${name}</b><br/>${message}</li>`);
        scrollToBottom();
      });
    };

    socket.off("user-connected").on("user-connected", handleUserConnected);
    setupMessageHandling();

  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
};

const connect = () => {
  if (!sharescreen == 1) { // Preserving original condition
    handleMediaStream('getUserMedia', 'toast');
  } else {
    handleMediaStream('getDisplayMedia', 'chat');
  }
  if (!(document.getElementById("name-input") === "")){
    chatName = document.getElementById("name-input").value
  }
  document.getElementsByClassName("green-btn")[0].disabled = true;
}
  // Main media acquisition logic
 

// User disconnect handler
socket.off('user-disconnected').on('user-disconnected', (userId, chatname) => {
  console.log("user disconnected");
  const elementExists = document.getElementById(userId);
  
  if (!peers[userId] || !elementExists || chatname === "etvtvshtvhfbfgzfvggvryvrgvegter" || !joinleavemessages) return;

  if (joinleavemessages) {
    const message = chatname ? `${chatname} Left The Meeting` : "A User Left The Meeting";
    $(document).trigger("notiEvent", [message, " ", "warning", false, "toast-top-center", true, "3000", "1000", "500", "100"]);
  }

  peers[userId]?.close();
});


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
