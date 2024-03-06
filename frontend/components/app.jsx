import { Web_pilot } from "../../web_pilot/web_pilot";
import { NickNames } from "./nickName";
import { WaitForPlayers } from "./waitForPlayers.jsx";
import {Chat} from "./chat.jsx";
var http = require('http');

const apiURL = process.env.WEB_PILOT_APP_API_URL;



/** @jsx Web_pilot.createElement */
export function App() {

    //Create WebSocket connection
    const socket = new WebSocket('ws://localhost:8080');

    socket.addEventListener("error", (event) => {
    console.log("Error from socket WS:", event);
})

    // Connection opened
    socket.addEventListener("open", (event) => {
      socket.send("Hello Server! Bomberman Helena is here!",event);
    });

    // Handle incoming messages
    socket.addEventListener('message', function (event) {
      console.log("event inside message front end", event);
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

    const [nr, setNr] = Web_pilot.useState(0)
    const [players, setPlayers] = Web_pilot.useState([]);


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
            />
            <Chat 
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