import { Web_pilot } from "../../web_pilot/web_pilot.jsx"
import Explosion from "../static/explosion.gif"
import AngelHeart from "../static/Angel_Heart.png"
import { GameLoad } from "./game.jsx";

import WebSocket from 'ws';

const apiURL = process.env.REACT_APP_API_URL;


/** @jsx Web_pilot.createElement */
export function WaitForPlayers(props) {

    var countdown = document.getElementById('countdown');
    const timerContainer = document.querySelector('#time');//get timer element


    //possible values for waiting = 'waitForPlayers', 'wait20', 'wait10'
    //if there is only 1 player, display greeting and the timer will not start
    //get server greeting and players array
    props.socket.addEventListener('message', function (event) {
        var msg = JSON.parse(event.data)

        switch (msg.type) {
            case 'countdownMsg':
                // console.log("msg.data and msg.type", msg.data, msg.type);
                if (msg.data === 'You are first') {
                    //hide the timer
                    document.getElementById('info').style.display = "none";
                    //display message
                    countdown.innerHTML = msg.data;
                    return
                } else if (msg.data === 'Waiting for more players' || msg.data === 'Game starting in 10 seconds') {
                    //show the timer
                    document.getElementById('info').style.display = "block";
                    countdown.innerHTML = msg.data;
                    return
                } else if (msg.data === 'gameOn') {
                    countdown.innerHTML = "";
                    let waitingPlayer = document.getElementById("waitForPlayers")
                    let game = document.getElementById("game")
                    waitingPlayer.style.display = "none"
                    game.style.display = "block"
                    GameLoad()
                    return
                }
                break;

            case 'clientsMap':
                let y = msg.data.length;
                props.numPlayers = y;
                //update the number of players in the front-end
                let numPlay = document.getElementById('numPlay');
                if (props.numPlayers > 0 && props.numPlayers < 5) {
                    numPlay.innerHTML = `Number of Players:  ${props.numPlayers}`;
                    return;
                } else {
                    numPlay.innerHTML = 'Number of Players:  0';
                }
                break;

            case 'seconds':
                //let x = msg.data;
                props.leadingSecs = msg.data;
                //show seconds
                timerContainer.innerHTML = `Count down: ${props.leadingSecs}`;
                return

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
                    <div className="countdown">
                        <span>
                            {/* <h1>Bomberman Chat</h1>
                        <pre id="messages" style="height: 400px; overflow: scroll"></pre>
                        <input type="text" id="messageBox" placeholder="Type your message here" style="display: block; width: 100%; margin-bottom: 10px; padding: 10px;" />
                        <button id="send" title="Send Message!" style="width: 100%; height: 30px;">Send Message</button> */}
                        </span>
                    </div>
                </div>
            </center>
        </div>
    )
}