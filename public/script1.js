    const socket = io("/");
    const videoGrid = document.getElementById("video-grid");
    const myVideo = document.createElement("video")
    const yourVideo = document.createElement("video")
    myVideo.muted = true;

    var peer = new Peer(undefined, {
        path: "/peerjs",
        host: "/",
        port: "3030"
    });

    let myVideoStream

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream)


        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        peer.on('call', function(call) {
        getUserMedia({video: true, audio: true}, function(stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function(remoteStream) {
          addVideoStream(yourVideo, remoteStream)
        });
        }, function(err) {
        console.log('Failed to get local stream' ,err);
        });
        });

        socket.on('user-connected', userId => {
          connectToNewUser(userId, stream)
        })
    })


    peer.on("open", id => {
        console.log("PeerJS ID: " + id);
        socket.emit("join-room", ROOM_ID, id);
    })

    const connectToNewUser = (userId, stream) => {
        console.log("User Connected, PJS ID: " + userId);
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({video: true, audio: true}, function(stream) {
        var call = peer.call(userId, stream);
        call.on('stream', function(remoteStream) {
            addVideoStream(yourVideo, remoteStream)
        }); 
        }, function(err) {
          console.log('Failed to get local stream' ,err);
        });
    }

    function addVideoStream (video, stream) {
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => {
            video.play();
        })
        videoGrid.append(video);
    }