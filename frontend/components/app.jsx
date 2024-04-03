import { Web_pilot } from "../../web_pilot/web_pilot";
import { NickNames } from "./nickName";
import { WaitForPlayers } from "./waitForPlayers.jsx";
import { Game, StartMove, StopMove, GameLoad} from "./game.jsx";
import {Chat} from "./chat.jsx";
var http = require('http');

const apiURL = process.env.WEB_PILOT_APP_API_URL;



/** @jsx Web_pilot.createElement */
export function App() {

  const chat = document.getElementById('chat');
  const dataArray = []
  const messageInput = document.getElementById('message');
  const sendButton = document.getElementById('send');

  //Create WebSocket connection
  const socket = new WebSocket('ws://localhost:8080');
  var numPlayers = 0;

  var timerContainer = document.querySelector('#time');
  var countdown = document.getElementById('countdown');

  socket.addEventListener("error", (event) => {
    console.log("Error from socket WS:", event);
  })

  // Connection opened
  socket.addEventListener("open", (event) => {
    let openMsg = "Hello Server! One more Bomberman is here!"
    socket.send(JSON.stringify({
      type: "openMessage",
      data: openMsg
    }));
  });

  // Handle incoming messages
  socket.addEventListener('message', function (event) {
    console.log("event inside message front end", event);

    var msg = JSON.parse(event.data)

    switch (msg.type) {
      case "openMessage":
        console.log("event.data.data", msg.data);
        break;


      case "countdownMsg":
        if (msg.data === 'You are first') {
          //hide the timer
          if (document.getElementById("waitForPlayers")) {
            //document.getElementById("time").style.display = "none";
            //display message
            document.getElementById("countdown").innerHTML = msg.data;
          } else {
            console.log("App: no waitForPlayers")
          }
          countdown.innerHTML = msg.data;
        } else if (msg.data === 'Waiting for more players') {
          //show the timer
          if (document.querySelector(".waitForPlayers")) {
            document.getElementById("time").style.display = "block";
            document.getElementById("countdown").innerHTML = msg.data;
          } else {
            console.log("App: no waitForPlayers")
          }
          //display message
          //let countdown = document.getElementById('countdown');
          document.getElementById("time").style.display = "block";
          document.getElementById("countdown").innerHTML = msg.data;
        }
        break

      case "clientsMap":
        console.log("length of players array", msg.data.length);
        numPlayers = msg.data.length;
        let numPlay = document.getElementById('numPlay');
        if (numPlayers > 0) {
          numPlay.innerHTML = `Number of Players:  ${numPlayers}`;
        } else {
          numPlay.innerHTML = 'Number of Players:  0';
        }
        
          localStorage.setItem("numPlayers", numPlayers)
          
          console.log("what is my position?", msg.position)
          if (msg.position != null) {
            
            localStorage.setItem("position", msg.position)
          }
        
        break;

      case "seconds":
        console.log("Seconds remaining: ", msg.data);
        //let timer = document.getElementById('timer');
        leadSecs = msg.data 
        if( document.getElementById("waitForPlayers")){
          document.querySelector('#time').innerHTML = `Count down: ${msg.data}`;
        }
        if (leadSecs === 10) {
          let waitingPlayer = document.getElementById("waitForPlayers")
          let game = document.getElementById("game")
          socket.send(
            JSON.stringify(
              {
                type: "clearTimer"
              }
            )
          )
          waitingPlayer.style.display = "none"
          game.style.display = "block"
          let n = localStorage.getItem("numPlayers")
          let p = localStorage.getItem("position")
          GameLoad(n, p)
        }
        
        break;

      case "chatMessage":
        const message = document.createElement('div');
        message.textContent = msg.data;
        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight; // Scroll chat to bottom
      break
    }

    const message = document.createElement('div');

    //turn chars into string, from event object: {"type":"Buffer","data":[72,101,108,108,111,32,83,101,114,118,101,114,33]}
    if(msg.type === "chatMessage" && event.target.data.data !== undefined){
      dataArray = event.target.data.data;
    }
   
    console.log("event.data.data", dataArray)
    const stringData = String.fromCharCode(...dataArray);

    console.log(stringData);
    message.textContent = stringData;
    chat.appendChild(stringData);
    chat.scrollTop = chat.scrollHeight; // Scroll chat to bottom

  });


  const [nr, setNr] = Web_pilot.useState(0)
  const [players, setPlayers] = Web_pilot.useState([]);

  // add game movemnet eventlistener to movement
  //onkeydown - start moving - clear Timeout
  window.addEventListener("keydown", StartMove)
  //onkeyup - stop moving - clear Timeout
  window.addEventListener("keyup", StopMove)

  return (
    <div>
      <NickNames
        nr={nr}
        setNr={setNr}
        players={players}
        setPlayers={setPlayers}
        socket={socket}
      />
      <WaitForPlayers
        nr={nr}
        setNr={setNr}
        players={players}
        setPlayers={setPlayers}
        socket={socket}
        numPlayers={numPlayers}
      />
      <Chat
        socket={socket}
      />
      <Game 
      numPlayers={numPlayers}
      socket={socket}/>
    </div>
  )
}

//render the App component in index.html
let appendHere = document.getElementsByTagName("body")[0];
let showNkNm = Web_pilot.createElement(App);
Web_pilot.render(showNkNm, appendHere);

export default App;