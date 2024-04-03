import { Web_pilot } from "../../web_pilot/web_pilot";
import { NickNames } from "./nickName";
import { WaitForPlayers } from "./waitForPlayers.jsx";
import { Game, StartMove, StopMove} from "./game.jsx";
import {Chat} from "./chat.jsx";
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
    var numPlayers = 0;

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


      var msg = JSON.parse(event.data)

    switch (msg.type) {

        case "openMessage":
            console.log("openMessage", msg.data);
            break;
        case "clientsMap":
            numPlayers = msg.data.length;
            console.log("clientsMap", msg.data)
            localStorage.setItem("numPlayers", numPlayers)
            let numPlay = document.getElementById('numPlay');
            if(numPlayers > 0){
              numPlay.innerHTML = `Number of Players:  ${numPlayers}`;
            }else{
              numPlay.innerHTML = 'Number of Players:  0';
            }
            console.log("what is my position?", msg.position)
            if (msg.position != null) {
              
              localStorage.setItem("position", msg.position)
            }
          
            break;
    }
    const message = document.createElement('div');
    //turn chars into string, from event object: {"type":"Buffer","data":[72,101,108,108,111,32,83,101,114,118,101,114,33]}
    const dataArray = event.target.data.data;
    console.log("event.data.data",dataArray)
    const stringData = String.fromCharCode(...dataArray);
    
    console.log(stringData); 
    message.textContent = stringData;
    chat.appendChild(stringData);
    chat.scrollTop = chat.scrollHeight; // Scroll chat to bottom
  });
  
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
              socket={socket}
            />
        </div>
    )
}

//render the App component in index.html
let appendHere = document.getElementsByTagName("body")[0];
let showNkNm = Web_pilot.createElement(App);
Web_pilot.render(showNkNm, appendHere);

export default App;