import './style.scss'

var app = document.querySelector('#app');
const urlParams = new URLSearchParams(window.location.search);

document.querySelector('#stream').value = localStorage.getItem("stream");
if(urlParams.get("stream") != null) localStorage.setItem('stream', urlParams.get("stream"));

if(urlParams.get("stream") != null || urlParams.get("stream") != null){
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

client.on('message', (channel, tags, message, self) => {
  console.log(`${tags['display-name']}: ${message}`);
  
  var messageBlock = document.createElement('div');
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
  messageText.innerHTML = ` ${message} `
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
  if (app.children.length > 1000) {
    app.children[0].remove();
  }
});