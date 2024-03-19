import { Web_pilot } from "../../web_pilot/web_pilot";
import { NickNames } from "./nickName";
import { WaitForPlayers } from "./waitForPlayers.jsx";
import { Game } from "./game.jsx";
import { Chat } from "./chat.jsx";
var http = require('http');

const apiURL = process.env.WEB_PILOT_APP_API_URL;



/** @jsx Web_pilot.createElement */
export function App() {

  const [nr, setNr] = Web_pilot.useState(0)
  const [players, setPlayers] = Web_pilot.useState([]);

  const chat = document.getElementById('chat');
  const messageInput = document.getElementById('message');
  const sendButton = document.getElementById('send');

  //Create WebSocket connection
  const socket = new WebSocket('ws://localhost:8080');
  var nNameChk = '';
  var thePlayers = [];
  var numPlayers = 0;
  var countdown = document.getElementById('countdown');
  var countTen = '';
  let waitMsg = '';
  var gameStart = 'waitGame';


  socket.addEventListener("error", (event) => {
    console.log("Error from socket WS:", event);
  })

  // Connection opened
  socket.addEventListener("open", (event) => {
    let openMsg = "Hello from Bomberman!"
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
      case "nkNameChk":
        console.log("nkNameChk message:", msg.data);
        nNameChk = msg.data;
        break;
      case "nickName":
        console.log("nickName message:", msg.data);
        nNameChk = msg.data;
        break;
      //array of cients sent from back-end server to front-end to clients
      case "clientsMap":
        console.log("thePlayers array and numPlayers:%n", msg.data, msg.data.length);
        thePlayers = msg.data;
        numPlayers = msg.data.length;
        //update state variables
        setPlayers(() => thePlayers);
        setNr(() => numPlayers);
        //update the number of players in the front-end
        let numPlay = document.getElementById('numPlay');
        if (numPlayers > 0 && numPlayers < 5) {
          numPlay.innerHTML = `Number of Players:  ${numPlayers}`;
        } else {
          numPlay.innerHTML = 'Number of Players:  0';
        }
        break;

      case "countdownMsg":
        waitMsg = msg.data;

        if (waitMsg === 'You are first') {
          countTen = '';
          //hide the countdown timer
          document.getElementById('info').style.display = "none";
          //display the countdown message
          countdown.innerHTML = waitMsg;
        } else if (waitMsg === 'Waiting for more players') {
          //show the countdown timer
          document.getElementById('info').style.display = "block";
          countdown.innerHTML = waitMsg;
          //start the timer
          countTen = 'wait10';
        } else if (waitMsg === 'Game starting in 10 seconds') {
          countTen = 'start10';
          countdown.innerHTML = waitMsg;
          countdown.style.display = "block";
          countTen = 'start10'
          break;
        }


      case "chatMessage":
        const message = document.createElement('div');
        message.textContent = msg.data;
        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight; // Scroll chat to bottom
    }

    const message = document.createElement('div');

    //turn chars into string, from event object: {"type":"Buffer","data":[72,101,108,108,111,32,83,101,114,118,101,114,33]}
    const dataArray = event.target.data.data;
    console.log("event.data.data", dataArray)
    const stringData = String.fromCharCode(...dataArray);

    console.log(stringData);
    message.textContent = stringData;
    chat.appendChild(stringData);
    chat.scrollTop = chat.scrollHeight; // Scroll chat to bottom
  });




  return (
    <div>
      <NickNames
        numPlayers={numPlayers}
        nr={nr}
        setNr={setNr}
        thePlayers={thePlayers}
        players={players}
        setPlayers={setPlayers}
        socket={socket}
        nNameChk={nNameChk}
      />
      <WaitForPlayers
        nr={nr}
        setNr={setNr}
        players={players}
        setPlayers={setPlayers}
        socket={socket}
        numPlayers={numPlayers}
        waitMsg={waitMsg}
        countTen={countTen}
      />
      <Chat
        socket={socket}
      />
      <Game />
    </div>
  )
}

//render the App component in index.html
let appendHere = document.getElementsByTagName("body")[0];
let showNkNm = Web_pilot.createElement(App);
Web_pilot.render(showNkNm, appendHere);

export default App;