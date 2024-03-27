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
                    //show seconds
                    timerContainer.innerHTML = `Count down: ${props.leadingSecs}`;
                    countdown.innerHTML = msg.data;
                    return
                } else if (msg.data === 'Game starting in 10 seconds') {
                    countdown.innerHTML = msg.data;
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

        }
    });

    //first player to join the game
    if (props.waiting === 'waitForPlayers') {
        //hide the timer
        document.getElementById('info').style.display = "none";
        //display the wait message
        countdown.innerHTML = props.waitMsg;

        //start the timer when there are at least 2 players
    } else if (props.waiting === 'wait20') {
        //show the timer
        document.getElementById('info').style.display = "block";
        //show seconds
        timerContainer.innerHTML = `Count down: ${props.leadingSecs}`;
        //display the wait message
        countdown.innerHTML = props.waitMsg;

        //start the 10 seconds countdown when 20 seconds have passed
    } else if (props.waiting === 'wait10') {
        //show the timer
        document.getElementById('info').style.display = "block";
        //show seconds
        timerContainer.innerHTML = `Count down: ${props.leadingSecs}`;
        //display the wait message
        countdown.innerHTML = props.waitMsg;
    }
    /*
    //to be moved inside app.jsx:
    //start the 10 seconds countdown if seconds = 20 & # players= 2 or 3
    if (props.waiting === 'waitTen' && seconds === 20) {

        //let waitingPlayer = document.getElementById("waitForPlayers")
        //let game = document.getElementById("game")

        tenSecondsStart()
        //waitingPlayer.style.display = "none"
        //game.style.display = "block"  
        //GameLoad()

        //send signal to start 10 seconds countdown to WS
        props.socket.send(JSON.stringify({
            type: "countdownMsg",
            data: 'Game starting in 10 seconds'
        }));


    }
    */
    //load game when the 10 seconds countdown is finished
    //moved to app.jsx
    else if (props.waiting === 'gameOn') {
        //tenSecondsEnd()
        let waitingPlayer = document.getElementById("waitForPlayers")
        let game = document.getElementById("game")
        waitingPlayer.style.display = "none"
        game.style.display = "block"
        GameLoad()

        //send game starts signal to WS
        //moved to app.jsx
        /* props.socket.send(JSON.stringify({
             type: 'gameOn',
             data: 'May the best win!'
         }));
         */
    }


    //}



    /*
        function clear() {
            console.log(timer, timeInterval)
            clearTimeout(timer)
            clearInterval(timeInterval)
        }
    
        // 10 seconds to start and no one else joins
        function tenSecondsStart() {
    
            clearTimeout(timer);
            clearInterval(timeInterval);
            timer = setTimeout(function () {
                timeStatus = true;
                timeInterval = setInterval(startTimer, 1000);
            }, 200);
        }
    
        function tenSecondsEnd() {
            clearTimeout(timer);
            clearInterval(timeInterval);
            timeStatus = false;
        }
    
        if (document.getElementById('waitForPlayers')) {
            timer = setTimeout(function () {
                timeStatus = true;
                timeInterval = setInterval(startTimer, 1000);
            }, 200);
        }
        //wait 200 milliseconds before start timer
        */

    if (document.getElementById('waitForPlayers')) {
        //update the number of players in the front-end
        let numPlay = document.getElementById('numPlay');
        if (props.numPlayers > 0 && props.numPlayers < 5) {
            numPlay.innerHTML = `Number of Players:  ${props.numPlayers}`;
        } else {
            numPlay.innerHTML = 'Number of Players:  0';
        }
    }
    //wait 200 milliseconds before start timer




    //using window.onload so the id='numPlay' will be rendered before js refers to it 
    // window.onload = function() {
    //     let opponents = document.querySelector("#numPlay");
    //     opponents.innerHTML = `Number of Players:  ${props.nr}`;
    // }

    //=====> Start of bomberChat function <========
    /*
    //renders the chat and sends messages to all clients through ws
    (function() {
        const sendBtn = document.querySelector('#send');
        const messages = document.querySelector('#messages');
        const messageBox = document.querySelector('#messageBox');
    
        let ws;
    
        function showMessage(message) {
          messages.textContent += `\n\n${message}`;
          messages.scrollTop = messages.scrollHeight;
          messageBox.value = '';
        }
    
        function init() {
          if (ws) {I feel so lucky!j
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close();
          }
    
          ws = new WebSocket('ws://localhost:8082');
          ws.onopen = () => {
            console.log('Connection opened!');
          }
          ws.onmessage = ({ data }) => showMessage(data);
          ws.onclose = function() {
            ws = null;
          }
        }
    
        sendBtn.onclick = function() {
          if (!ws) {
            showMessage("No WebSocket connection :(");
            return ;
          }
    
          ws.send(messageBox.value);
          showMessage(messageBox.value);
        }
    
        init();
      })();
      */
    //=====> End of bomberChat function <========


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