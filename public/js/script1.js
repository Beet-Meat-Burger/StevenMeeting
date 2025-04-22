const urlParam = window.location.search;
const urlParams = new URLSearchParams(urlParam);
var chatName = urlParams.get('name')
var controls = "1"
var sharescreen = urlParams.get("screen")
var pjsID = ""
var pjsPort = window.location.href.indexOf("https://")==0?"443":"3030";
const videocontrols = urlParams.get("control")
var joinleavemessages = true
var openedMenu = ""
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
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const quitMeeting = () => {
  $(document).trigger( "notiEvent", ["Leaving Meeting...", " ", "error", true, "toast-top-center", true, "1000", "1000", "500", "100"] );
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
      window.open("/meet/" + ROOM_ID + "?name=" + chatName + " (Screen)&screen=1", '_blank').focus();
    }
  }
}
}


const onMenubarItemHovered = (type, xLocation, yLocation) => {
  if(openedMenu != type && openedMenu != "") {
    closeMenu("")
    showMenu(type, xLocation, yLocation);
  }
}

const menuItemClicked = (type, xLocation, yLocation) => {
  if(openedMenu == ""){
    showMenu(type, xLocation, yLocation);
  }else {
    closeMenu("");
  }
}

const leaveSilently = () => {
  $(document).trigger( "notiEvent", ["Leaving Meeting Silently...", " ", "error", true, "toast-top-center", true, "1000", "1000", "500", "100"] );
  socket.emit('byebye', "etvtvshtvhfbfgzfvggvryvrgvegter");
  setTimeout(function() {
    window.location.replace("about:blank");
  }, 1000);
}

const shareScreen = (openedFromMenu) => {
  if(openedFromMenu){
    closeMenu("")
  }
  window.open("/" + ROOM_ID + "?name=" + chatName + "&screen=1", '_blank').focus
}


const adjustQuality = () => {
  closeMenu("")
  showMenu("quality", 29, 221)
}

const showMenu = (type, xLocation, yLocation) => {
  const contextMenu = document.getElementById("stevenmeeting-menu");
  resetMenuStyles();
  
  const menuConfigs = {
    stevenMeeting: {
      targetElement: "menu-bar-logo",
      content: `
        <div class="stevenmeeting-menu-item" onclick="alert('youClickedMe!')">
          StevenMeeting<br>
          <small style="color: #68efad;">Version 1.3</small>
        </div>
      `
    },
    security: {
      styleMenuBar: true,
      targetElement: "menu-bar-security",
      content: `
        <div class="stevenmeeting-menu-item" onclick="alert('youClickedMe!')">Encryption</div>
        <div class="stevenmeeting-menu-item" onclick="leaveSilently()">Leave Silently</div>
      `
    },
    meeting: {
      styleMenuBar: true,
      targetElement: "menu-bar-meeting",
      content: `
        <div class="stevenmeeting-menu-item" onclick="shareScreen(true)">Share Screen</div>
        <div class="stevenmeeting-menu-item" onclick="rename()">Rename</div>
      `
    },
    connection: {
      styleMenuBar: true,
      targetElement: "menu-bar-connection",
      content: `
        <div class="stevenmeeting-menu-item" onclick="adjustQuality()">Quality</div>
        <div class="stevenmeeting-menu-item" onclick="leaveSilently()">Leave Silently</div>
      `
    },
    notifications: {
      styleMenuBar: true,
      targetElement: "menu-bar-notifications",
      content: `
        <div class="stevenmeeting-menu-slider">
          <table style="width:60%">
            <tbody>
            </tbody>
          </table>
        </div>
      `
    },
    quality: {
      styleMenuBar: true,
      targetElement: "menu-bar-connection",
      content: `
        <div class="stevenmeeting-menu-item-select">
          <table style="width:60%">
            <tbody>
              ${createQualityOption('Framerate', ['5 FPS', '15 FPS', '20 FPS', '30 FPS', '60 FPS', 'Unlimited'])}
              ${createQualityOption('Quality', ['120p', '240p', '360p', '420p', '1080p', 'Unlimited'])}
            </tbody>
          </table>
          <div class="px3-vertical-spacer"></div>
          <button class="button-3">Reload and Apply</button>
        </div>
      `
    }
  };

  const config = menuConfigs[type];
  if (!config) return;

  openedMenu = type === 'quality' ? 'connection' : type;
  const menuBar = document.getElementById("menu-bar");
  
  if (config.styleMenuBar) {
    menuBar.style.backgroundColor = "#1c1e20";
    menuBar.style.color = "#ffffff";
  }
  
  document.getElementById(config.targetElement).style.backgroundColor = "#706d70";
  contextMenu.innerHTML = config.content;
  
  positionMenu(contextMenu, xLocation, yLocation);
  contextMenu.style.visibility = "visible";
};

const createQualityOption = (label, options) => `
  <tr>
    <td><span>${label}</span>${label === 'Framerate' ? '<span style="color: #1c1e20">_</span>' : ''}</td>
    <td>
      <select class="quality-selector menu-component">
        ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
      </select>
    </td>
  </tr>
`;

const positionMenu = (menu, x, y) => {
  menu.style.top = `${x - window.scrollY}px`;
  menu.style.left = `${y - window.scrollX}px`;
};

const resetMenuStyles = () => {
  const menuBar = document.getElementById("menu-bar");
  menuBar.style.cssText = '';
  
  if (openedMenu === "stevenMeeting") {
    document.getElementById("menu-bar-logo").style.cssText = "";
  } else if (openedMenu) {
    document.getElementById(`menu-bar-${openedMenu}`).style.cssText = "";
  }
};

const closeMenu = (e) => {
  const contextMenu = document.getElementById("stevenmeeting-menu");
  const menuBar = document.getElementById("menu-bar");
  const isComponent = e?.target?.closest('.menu-component');
  
  const shouldClose = !e ? true : !contextMenu.contains(e.target) && 
                              !menuBar.contains(e.target) && 
                              !isComponent;

  if (shouldClose) {
    resetMenuStyles();
    contextMenu.style.visibility = "hidden";
    openedMenu = "";
  }
};

document.addEventListener("click", closeMenu);