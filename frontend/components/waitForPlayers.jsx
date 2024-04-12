import { Web_pilot } from "../../web_pilot/web_pilot.jsx"
import Explosion from "../static/explosion.gif"
import AngelHeart from "../static/Angel_Heart.png"
import { Game, StartMove, StopMove, GameLoad } from "./game.jsx";


/** @jsx Web_pilot.createElement */
export function WaitForPlayers(props) {

    var thePlayers = []
    var numPlayers = 0;
    var timerMsg = "";


    props.socket.addEventListener("message", (event) => {

        var msg = JSON.parse(event.data);

        switch (msg.type) {

            case "clientsMap":
                //used to render the number of Bombermen in the lobby
                console.log("Inside waitForPlayers, the length of players array", msg.data.length);
                thePlayers = msg.data;
                numPlayers = msg.data.length;
                document.querySelector("#numPlay").innerHTML = `Number of Players:  ${numPlayers}`;

                break;

            case "countdownMsg":
                //assign value to timerMsg variable
                timerMsg = msg.data;
                //display message
                document.getElementById("countdown").innerHTML = timerMsg;

                break

            case "seconds":
                //used to render the countdown timer
                leadSecs = msg.data;
                console.log("lobby receives seconds:", leadSecs)
                document.querySelector('#time').innerHTML = `Count down: ${leadSecs}`;


                break;
        }
    });


    return (
        <div id="waitForPlayers">

            <center>
                <div>
                    <h1 >Bomberman</h1>
                </div>
                <div>
                    <span className="info">
                        <h2 id="numPlay" >0</h2>
                    </span>
                    <span className="info">
                        <h2 id="lives" >Lives:</h2>
                    </span>
                    <span className="info">
                        <img className="angel" id="heart1" src={AngelHeart} alt="angel_heart" />
                        <img className="explosion" id="explosion1" src={Explosion} alt="explosion" />
                        <img className="angel" id="heart2" src={AngelHeart} alt="angel_heart" />
                        <img className="explosion" id="explosion2" src={Explosion} alt="explosion" />
                        <img className="angel" id="heart3" src={AngelHeart} alt="angel_heart" />
                        <img className="explosion" id="explosion3" src={Explosion} alt="explosion" />
                    </span>
                </div>
                <div className="game-container">
                    <span className="game">
                        <div className="container">
                            <div className="grid"></div>
                        </div>
                    </span>
                    <div className="menu">

                        <span className="info">
                            <h2 id="time" >Count down: 00</h2>
                        </span>

                        {/* <h3>'p' to play</h3>
                        <h3>'s' to stop</h3>
                        <h3>'r' to re-start</h3>
                        <h3>'c' to continue</h3>
                        <h3>'space bar' to shoot</h3>
                        <h3><strong>⇦ ⇨</strong> move left right</h3> */}
                    </div>
                    <div id="countdown"></div>
                    {/* <div className="bomberChat">
                        <span>
                        <h1>Bomberman Chat</h1>
                        <pre id="messages" style="height: 400px; overflow: scroll"></pre>
                        <input type="text" id="messageBox" placeholder="Type your message here" style="display: block; width: 100%; margin-bottom: 10px; padding: 10px;" />
                        <button id="send" title="Send Message!" style="width: 100%; height: 30px;">Send Message</button>
                        </span>
                        </div> */}
                </div>
            </center>
        </div>
    )
}