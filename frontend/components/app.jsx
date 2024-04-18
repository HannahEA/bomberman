import { Web_pilot } from "../../web_pilot/web_pilot";
import { NickNames } from "./nickName";
import { WaitForPlayers } from "./waitForPlayers.jsx";
import { Game, StartMove, GameLoad } from "./game.jsx";
import { Chat } from "./chat.jsx";

//Bomberman soundtracks in frontend/static/sounds are sourced from: 
//https://downloads.khinsider.com/game-soundtracks/album/bomberman-nes

/** @jsx Web_pilot.createElement */
export function App() {

  const chat = document.getElementById('chat');
  const dataArray = []
  var leadSecs = 0;

  //=======================================================
  //=============== Create WebSocket connection Start =====
  //=======================================================

  const socket = new WebSocket('ws://localhost:8080');

  //========================================================
  //=============== Create WebSocket connection End  =======
  //========================================================

  var thePlayers = []
  var numPlayers = 0;
  var timerMsg = "";

  // Connection opened
  //signal to server that a new client has connected
  socket.addEventListener("open", (event) => {
    let openMsg = "Hello from Bombman client!"
    socket.send(JSON.stringify({
      type: "openMessage",
      data: openMsg
    }));
  });

  socket.addEventListener("error", (event) => {
    console.log("Error from Bombman client:", event);
  })

  // Handle incoming messages
  socket.addEventListener('message', function (event) {

    var msg = JSON.parse(event.data)

    switch (msg.type) {

      case "countdownMsg":
        //assign value to timerMsg variable
        timerMsg = msg.data;

        if (msg.data === 'You are first') {
          //assign value to timerMsg variable
          timerMsg = msg.data;

          //hide the timer
          document.getElementById("time").style.display = "none";
          //display message
          document.getElementById("countdown").innerHTML = msg.data;
        } else if (msg.data === 'Waiting for more players') {
          //assign value to timerMsg variable
          timerMsg = msg.data;
          //display message, timer and number of players

          document.getElementById("time").style.display = "block";
          document.getElementById("countdown").innerHTML = msg.data;
          document.getElementById("numPlay").innerHTML = `Number of Players:  ${numPlayers}`;


        } else if (msg.data === 'Game starting in 10 seconds') {

          //assign value to timerMsg variable
          timerMsg = msg.data;

          //display message
          document.getElementById("countdown").innerHTML = msg.data;
          document.getElementById("numPlay").innerHTML = `Number of Players:  ${numPlayers}`;


        } else if (msg.data === 'gameOn') {
          timerMsg = msg.data;

        }

        break

      case "clientsMap":
        numPlayers = msg.data.length;
        thePlayers = msg.data;
        console.log("Inside App.js, the leadSecs ====>", leadSecs);

        //display number of players in front end
        document.getElementById('numPlay').innerHTML = `Number of Players:  ${numPlayers}`;

        //save number of players in local storage
        localStorage.setItem("numPlayers", numPlayers)

        if (msg.position !== undefined) {

          localStorage.setItem("position", msg.position)
        }

        if (numPlayers === 4 && leadSecs < 20 && timerMsg === 'Waiting for more players') {
          //stop the timer
          socket.send(JSON.stringify({
            type: "clearTimer"
          }))
        }

        break;
      
      case "seconds":

        leadSecs = msg.data;
        document.querySelector('#time').innerHTML = `Count down: ${leadSecs}`;

        console.log("the timerMsg inside seconds case:", timerMsg)


        if (leadSecs === 20 && timerMsg === 'Waiting for more players') {
          //stop the timer
          socket.send(JSON.stringify({
            type: "clearTimer"
          }))

          //start 10 seconds countdown
          socket.send(JSON.stringify({
            type: 'wait10'
          }))

        } else if (leadSecs === 10 && timerMsg === 'Game starting in 10 seconds') {
          let waitingPlayer = document.getElementById("waitForPlayers")
          let game = document.getElementById("game")

          //stop the timer
          socket.send(JSON.stringify({
            type: "clearTimer"
          }))

          gameStarts = setTimeout(() => {

            //load the game
            waitingPlayer.style.display = "none"
            game.style.display = "block"
            let n = localStorage.getItem("numPlayers")
            let p = localStorage.getItem("position")
            GameLoad(n, p)
            clearTimeout(gameStarts);
          }, 15);
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

    if (msg.type === 'chatMessage') {
      dataArray = msg.data

      const stringData = String.fromCharCode(...dataArray);

      message.textContent = stringData;
      chat.appendChild(stringData);
      chat.scrollTop = chat.scrollHeight; // Scroll chat to bottom
    }
  });


  const [nr, setNr] = Web_pilot.useState(0)
  const [players, setPlayers] = Web_pilot.useState([]);

  // add game movemnet eventlistener to movement
  //onkeydown - start moving - clear Timeout
  window.addEventListener("keydown", function(e){StartMove(socket, e)})
  //onkeyup - stop moving - clear Timeout
  //window.addEventListener("keyup", StopMove)

  return (
    <div>
      <NickNames
        socket={socket}
        setNr={setNr}
        setPlayers={setPlayers}
      />
      <WaitForPlayers
        socket={socket}
        thePlayers={thePlayers}
        setNr={setNr}
        setPlayers={setPlayers}
      />
      <Chat
        socket={socket}
      />
      <Game
        numPlayers={numPlayers}
        socket={socket} />
    </div>
  )
}

//render the App component in index.html
let appendHere = document.getElementsByTagName("body")[0];
let showNkNm = Web_pilot.createElement(App);
Web_pilot.render(showNkNm, appendHere);

export default App;