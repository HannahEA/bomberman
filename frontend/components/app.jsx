import { Web_pilot } from "../../web_pilot/web_pilot";
import { NickNames } from "./nickName";
import { WaitForPlayers } from "./waitForPlayers.jsx";

const apiURL = process.env.WEB_PILOT_APP_API_URL;

/*Does not return a WebSocket
const ws = new WebSocket("ws://localhost:8082")
console.log("the WebSocket error is:", ws.error, ws);
ws.addEventListener("open", () => {
  console.log("We have connected to the WebSocket server!")
});
*/

/** @jsx Web_pilot.createElement */
export function App() {

    const [nr, setNr] = Web_pilot.useState(0)
    const [players, setPlayers] = Web_pilot.useState([]);


    return (
        <div>
            <NickNames
                nr={nr}
                setNr={setNr}
                players={players}
                setPlayers={setPlayers}
            />
            <WaitForPlayers
                nr={nr}
                setNr={setNr}
                players={players}
                setPlayers={setPlayers}
            />
        </div>
    )
}

//render the App component in index.html
let appendHere = document.getElementsByTagName("body")[0];
let showNkNm = Web_pilot.createElement(App);
Web_pilot.render(showNkNm, appendHere);

export default App;