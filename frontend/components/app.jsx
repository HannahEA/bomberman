import { Web_pilot } from "../../web_pilot/web_pilot";
import { NickNames } from "./nickName";
import { WaitForPlayers } from "./waitForPlayers.jsx";
import { Game } from "./game.jsx";
import { Chat } from "./chat.jsx";
var http = require('http');

const apiURL = process.env.WEB_PILOT_APP_API_URL;





/** @jsx Web_pilot.createElement */
export function App() {


  //========================================================
  //========== START OF Timer Variables and Functions ======
  //========================================================

  //~~~~~~~~~~~~~~Timer variables start~~~~~~~~~~~~~~~~~~~~~
  //Stop Watch from: https://codepen.io/madrine256/details/KKoRvBb
  let timeInterval = null,//time stamp at game start
    timer = null,
    timeStatus = false,
    minutes = 0,
    seconds = 0,
    leadingMins = 0,
    leadingSecs = 0;
  //~~~~~~~~~~~~~~Timer variables end~~~~~~~~~~~~~~~~~~~~~~~

  //~~~~~~~~~~~~~~Timer functions start~~~~~~~~~~~~~~~~~~~~~~
  function startTimer() {
    seconds++;

    //if seconds dived by 60 = 1 set back the seconds to 0 
    //and increment the minutes 

    if (seconds / 60 === 1) {
      seconds = 0;
      minutes++;
    }
    //add zero if seconds are less than 10
    if (seconds < 10) {
      leadingSecs = '0' + seconds.toString();
    } else {
      leadingSecs = seconds;
    };
    //add zero if minutes are less than 10
    if (minutes < 10) {
      leadingMins = '0' + minutes.toString();
    } else {
      leadingMins = minutes;
    };
  }


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

  if (waiting === 'wait20' || waiting === 'wait10') {
    timer = setTimeout(function () {
      timeStatus = true;
      timeInterval = setInterval(startTimer, 1000);
    }, 200);
  }

  /*
    if (document.getElementById('waitForPlayers')) {
      timer = setTimeout(function () {
        timeStatus = true;
        timeInterval = setInterval(startTimer, 1000);
      }, 200);
    }
    */
  //wait 200 milliseconds before start timer

  //~~~~~~~~~~~~~~Timer functions end~~~~~~~~~~~~~~~~~~~~~~~~


  //========================================================
  //========== END OF Timer Variables and Functions ========
  //========================================================

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
  // var countdown = document.getElementById('countdown');
  var waiting = '';
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
    console.log("event inside message front end", event.data);

    var msg = JSON.parse(event.data)
    console.log("Type inside message event:", msg.type); 
    switch (msg.type) {

      case "openMessage":
        console.log("event.data", msg.data);
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
        break;

      case "countdownMsg":
        waitMsg = msg.data;

        if (waitMsg === 'You are first') {
          //do not start timer
          waiting = 'waitForPlayers';
          //hide the timer
          // document.getElementById('info').style.display = "none";
          // //display the wait message
          // countdown.innerHTML = waitMsg;
        } else if (waitMsg === 'Waiting for more players') {
          //start the timer
          waiting = 'wait20';
          //send seconds and leadingSecs

          //show the timer
          // document.getElementById('info').style.display = "block";
          // //display the wait message
          // countdown.innerHTML = waitMsg;

        } else if (waitMsg === 'Waiting for more players' && leadingSecs === 20) {
          //start the 10 seconds countdown
          waiting = 'wait10';

          //send signal  to WS server so that 10 seconds countdown can begin
          socket.send(JSON.stringify({
            type: "countdownMsg",
            data: 'Game starting in 10 seconds'
          }));

        } else if (waitMsg === 'Game starting in 10 seconds') {

          waiting = 'start10';
          //re-start timer        
          tenSecondsStart();
          //send seconds and leadingSecs

          //show the timer
          countdown.style.display = "block";
          //display the wait message
          countdown.innerHTML = waitMsg;

        } else if (waitMsg === 'Game starting in 10 seconds' && leadingSecs === 10) {

          waiting = 'gameOn';
          //send game starts signal to WS
          props.socket.send(JSON.stringify({
            type: 'countdownMsg',
            data: 'gameOn'
          }));

          //stop the timer
          tenSecondsEnd()

          break;
        }


      case "chatMessage":
        const message = document.createElement('div');
        message.textContent = msg.data;
        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight; // Scroll chat to bottom
        break;
    }//end of switch msg.type

//=============== START potential duplicate of above =======================
    const message = document.createElement('div');

    //turn chars into string, from event object: {"type":"Buffer","data":[72,101,108,108,111,32,83,101,114,118,101,114,33]}
    const dataArray = event.target.data;
    console.log("event.data", dataArray.data)
    const stringData = String.fromCharCode(...dataArray);

    console.log(stringData);
    message.textContent = stringData;
    chat.appendChild(stringData);
    chat.scrollTop = chat.scrollHeight; // Scroll chat to bottom
  });
//=============== END potential duplicate of above =======================



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
        waiting={waiting}
        leadingSecs={leadingSecs}
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