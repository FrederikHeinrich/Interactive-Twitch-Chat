import './style.scss'

var app = document.querySelector('#app');
const urlParams = new URLSearchParams(window.location.search);

document.querySelector('#stream').value = localStorage.getItem("stream");
if(urlParams.get("stream") != null) localStorage.setItem('stream', urlParams.get("stream"));

document.querySelector('#maxmessages').value = localStorage.getItem("maxmessages");
if(urlParams.get("maxmessages") != null) localStorage.setItem('maxmessages', urlParams.get("maxmessages"));


if(urlParams.get("stream") != null && urlParams.get("stream") != "" && urlParams.get("maxmessages") != null){
  document.querySelector('#prompt').remove();
}

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: [urlParams.get('stream')],
});

client.connect();

var gz = 0;

client.on("clearchat", (channel) => {
  app.innerHTML =""
});

client.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
  document.getElementById(`message=${userstate['target-msg-id']}`).remove();
});

function getMessageHTML(message, { emotes }) {
  if (!emotes) return message;

  // store all emote keywords
  // ! you have to first scan through 
  // the message string and replace later
  const stringReplacements = [];

  // iterate of emotes to access ids and positions
  Object.entries(emotes).forEach(([id, positions]) => {
    // use only the first position to find out the emote key word
    const position = positions[0];
    const [start, end] = position.split("-");
    const stringToReplace = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );

    stringReplacements.push({
      stringToReplace: stringToReplace,
      replacement: `<img src='https://static-cdn.jtvnw.net/emoticons/v2/${id}/animated/dark/1.0' onerror="this.src=src='https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0'">`,
    });
  });

  // generate HTML and replace all emote keywords with image elements
  const messageHTML = stringReplacements.reduce(
    (acc, { stringToReplace, replacement }) => {
      // obs browser doesn't seam to know about replaceAll
      return acc.split(stringToReplace).join(replacement);
    },
    message
  );

  return messageHTML;
}

client.on('message', (channel, tags, message, self) => {
  console.log(tags)
  console.log(`Message img ${getMessageHTML(message, tags)}`)
  console.log(`${tags['display-name']}: ${message}`);
  
  var messageBlock = document.createElement('div');
  messageBlock.id = `message=${tags['id']}`
/*  messageBlock.innerHTML = `
  <div class = "title-bar" >
    <div class = "title-bar-text" >
    ${tags['display-name']}
    </div>
    <div class="title-bar-controls">
      <button aria-label="Minimize"> </button>
      <button aria-label="Maximize"> </button>
      <button aria-label="Close"> </button>
      </div>
  </div>
  <div class = "window-body">
    <p> ${message} </p>
  </div>
  `*/
  var titleBar = document.createElement('div');
  titleBar.classList.add("title-bar");
    
  titleBar.onmousedown = function(event){
    titleBar.classList.add("active")
    titleBar.addEventListener("mousemove", onDrag);
    div.style.zIndex = gz;
    gz= gz + 1;
  }

  titleBar.onmouseup = function(event){
    titleBar.classList.remove("active");
    titleBar.removeEventListener("mousemove", onDrag);
    div.style.zIndex = gz;
    gz= gz + 1;
  }

  titleBar.onmouseleave = function(event){
    titleBar.classList.remove("active");
    titleBar.removeEventListener("mousemove", onDrag);
  }

  var titleBarText = document.createElement('div');
  titleBarText.innerHTML = `${tags['display-name']}`
  titleBarText.classList.add("title-bar-text");

  var titleBatControls = document.createElement('div');
  titleBatControls.classList.add('title-bar-controls')
   
  var minimizeButton = document.createElement('button');
  minimizeButton.ariaLabel = "Minimize";
  titleBatControls.appendChild(minimizeButton);

  var maximizeButton = document.createElement('button');
  maximizeButton.ariaLabel = "Maximize";
  titleBatControls.appendChild(maximizeButton);

  var closeButton = document.createElement('button');
  closeButton.ariaLabel = "Close";
  closeButton.onclick = function(event){
    messageBlock.remove();
  }
  titleBatControls.appendChild(closeButton);
  

  titleBar.appendChild(titleBarText);
  titleBar.appendChild(titleBatControls);

  var windowBody = document.createElement('div');
  windowBody.classList.add('window-body');

  var messageText = document.createElement('p');
  messageText.innerHTML = ` ${getMessageHTML(message, tags)} `
  windowBody.appendChild(messageText);

  messageBlock.appendChild(titleBar);
  messageBlock.appendChild(windowBody);

  var div = app.appendChild(messageBlock);

  function onDrag({movementX, movementY}){
    let getStyle = window.getComputedStyle(div);
    let leftVal = parseInt(getStyle.left);
    let topVal = parseInt(getStyle.top);
    div.style.left = `${leftVal + movementX}px`;
    div.style.top = `${topVal + movementY}px`;
  }

  var randomtop = Math.floor(Math.random() * window.innerHeight);
  var randomright = Math.floor(Math.random() * window.innerWidth);
  if (randomright < window.innerWidth + 250 && randomright > 250)
    randomright = randomright - 250;
  if (randomtop > window.innerHeight - messageBlock.clientHeight)
    randomtop = randomtop - messageBlock.clientHeight
  div.classList.add("window")
  div.style.width = "250px"
  div.style.position = "fixed"
  div.style.right = randomright + "px"
  div.style.top = randomtop + "px"
  div.style.zIndex = gz;
  div.onclick = function(event) {
    console.log(event);
    div.style.zIndex = gz;
    gz= gz + 1;
  }
  gz = gz + 1;
  if (app.children.length > urlParams.get("maxmessages")) {
    app.children[0].remove();
  }
});