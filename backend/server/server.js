/* =====> Example from JS project #4: Social Network <======
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const [isWebSocketConnected, setWebSocketConnected] = useState(false);
  

  const websocketRef = useRef(null);

  useEffect(() => {
    console.log(websocketRef.current)
    if (!websocketRef.current) {
      websocketRef.current = new WebSocket("ws://localhost:8000/websocket");

      websocketRef.current.onopen = (e) => {
        console.log("WebSocket Connection Successfully Opened");
        setWebSocketConnected(true);
        websocketRef.current.send(
          JSON.stringify({
            type: "connect",
            cookie: document.cookie,
          })
        );
      };

    //   websocketRef.current.onmessage = (e) => {
    //     // Handle WebSocket messages here
    //             let message = JSON.parse(e.data)
    //       console.log(message)
    //       allData.current.presences = message.presences.clients
    //       console.log(allData.current.presences)
    //   };

      websocketRef.current.onclose = () => {
        console.log("WebSocket connection ended");
        setWebSocketConnected(false);
        websocketRef.current = null; // Reset the ref to null
      };
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ websocketRef, isWebSocketConnected}}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export default WebSocketProvider;
*/

//no from: https://www.youtube.com/watch?v=FduLSXEHLng
//rather from: https://www.youtube.com/watch?v=RL_E56NPSN0
//import { Server } from "ws";


/*const apiURL = process.env.WEB_PILOT_APP_API_URL;

import WebSocket from 'ws';

const wss = new WebSocket('ws://localhost:8082');

wss.on("error", function(err){
  console.log("Error from frontend WS:", err);
})

wss.on("connection", ws => {
  console.log("A Bomberman player has joined.");

  ws.on('message', function incoming(data){
    wss.clients.forEach(function each(client){
      if(client!== ws && client.readyState === WebSocket.OPEN){
        client.send(data);
      }
    })
  })

  ws.on("close", () =>{
    console.log("A Bomberman player has left.");
  });


});
*/

//ChatGPT suggestion:
/*import {WebSocketServer, WebSocket} from 'ws';

const wss = new WebSocketServer({port:8080});

wss.on("error", function(err){
  console.log("Error from server WS:", err);
})

wss.on('connection', function connection(ws) {
    console.log('New client connected', ws.readyState);

    // ws.listen(8080, function () {
    //   console.log('Listening on http://localhost:8080');
    // });

    ws.on('message', function incoming(message) {
        console.log('Received: %s', message);
        
    // Broadcast received message to all clients
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
      });
    });

    ws.on('close', function () {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server started on port 8080');
*/

//backend server prior to Esteban test
/*
import  WebsocketServer from 'ws';
const wss = new WebsocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server started on port 8080');
*/



//Esteban test backend server that works in a separate file
import { WebSocketServer } from 'ws';
import { AddBricks } from './makeBoard.js';
const wss = new WebSocketServer({ port: 8080 });
//var clients = [];
const clients = new Map();
const Layout = AddBricks()
const map = JSON.stringify(AddBricks().flat())

wss.on('connection', function connection(ws) {

  let timeInterval = null,//time stamp at game start
    timer = null,
    timeStatus = false,
    minutes = 0,
    seconds = 0,
    leadingMins = 0,
    leadingSecs = 0;

  ws.on('error', console.error);

  //ws.send(JSON.stringify('Bomberman Hannah websocket is on'));

  ws.on('message', function message(data) {
    console.log('received: %s', JSON.parse(data));

    let wsMessage = JSON.parse(data);

    switch (wsMessage.type) {

      case 'openMessage':
        console.log('Bomberman client open', wsMessage.data);
        break;
      //new client nickname
      case 'nickName':
        console.log('Bomberman client nickname:', wsMessage.nickname);
       clients.set(wsMessage.nickname, ws);
       for (let [nickname, ws] of clients) {
        ////MERGE 
        if(nickname === wsMessage.nickname) {
          ws.send(
            JSON.stringify(
              { 
                type:'clientsMap', 
                data: Array.from(clients.keys()), 
                position: Array.from(clients.keys()).length-1  
              }
            )
          )
          console.log(nickname, Array.from(clients.keys()), Array.from(clients.keys()).length-1 )
        } else {
          ws.send(
            JSON.stringify(
              { 
                type:'clientsMap', 
                data: Array.from(clients.keys()) 
              }
            )
          )
        }
        ;
       }
      //  ws.send(JSON.stringify({ type:'clientsMap', data: Array.from(clients.keys()) }  ;
        
        clients.set(wsMessage.nickname, ws);
        //send the array of Bombermans to all clients
        for (let [nickname, ws] of clients) {
          console.log(nickname);
          ws.send(JSON.stringify({
            type: 'clientsMap',
            data: Array.from(clients.keys())
          }));
        }

        //greeting for first Bomberman
        if (clients.size === 1) {
          //console.log("there is one client now!")
          ws.send(JSON.stringify({
            type: 'countdownMsg',
            data: 'You are first'
          }));
          //Greeting for second Bomberman
        } else if (clients.size === 2) {
          //send greeting & start timer
          for (let [nickname, ws] of clients) {
            //console.log(nickname, ws);
            ws.send(JSON.stringify({
              type: 'countdownMsg',
              data: 'Waiting for more players'
            }));
          }
          //create random brick layout 
          
            let m = JSON.stringify(Layout.flat())
            console.log("flat array", m, map)
            for (let [nickname, ws] of clients) {
              ws.send(
                JSON.stringify(
                    {
                        type: "board",
                        map: map 
                    }
                )
            )
            }
            
          

          //start 20 second timer
          timer = setTimeout(function () {
            timeStatus = true;
            timeInterval = setInterval(startTimer, 1000);
          }, 100);

          //console.log("server sends seconds:", leadingSecs);

        }

        break;
      //client message
      case 'chatMessage':
        console.log('Bomberman client chat', wsMessage.message);
        for (let [nickname, ws] of clients) {
          //console.log(nickname, ws);
          ws.send(JSON.stringify({ type: 'chatMessage', data: wsMessage.message }));
        }
        break;
      case 'playerMove':
        console.log("ws says: player has moved")
        for (let [_, ws] of clients) {
          ws.send(
          JSON.stringify(
            {
              type: "playerMove",
              player: wsMessage.player,
              direction: wsMessage.direction
            }
          )
        )
        }
        
        break
      case "clearTimer":
        clear()
        console.log("Timer Cleared", seconds)
        break
      
    }

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocketServer.OPEN) {
        client.send(data);
      }
    });
    ws.send(JSON.stringify({
      type: 'message',
      data: data
    }));
    //ws.send(data, {binary: isBinary});
  });

  ws.on('close', function close() {
    console.log('Bomberman client disconnected');
  });

  //================== START ADDED on 30 March ======================

  //~~~~~~~~~~~~~~Timer variables start~~~~~~~~~~~~
  //Stop Watch from: https://codepen.io/madrine256/details/KKoRvBb
  /*
  let timeInterval = null,//time stamp at game start
  timer = null,
  timeStatus = false,
  minutes = 0,
  seconds = 0,
  leadingMins = 0,
  leadingSecs = 0;
  */
  //~~~~~~~~~~~~~~Timer variables end~~~~~~~~~~~~

  //This is the timer function

  function startTimer() {
    seconds++;

    //if seconds dived by 60 = 1 set back the seconds to 0 and increment the minutes 
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

    console.log("time", seconds);

    //send leadingSecs to all clients

    for (let [nickname, ws] of clients) {
      console.log("nickname", nickname)
      console.log("server sending leadingSecs:", leadingSecs);
      ws.send(JSON.stringify({
        type: 'seconds',
        data: leadingSecs
      }));
    }
    //console.log("leadingSecs", leadingSecs);

    //Change timer text content to actaul stop watch
    //timerContainer.innerHTML = `Count down: ${leadingMins} : ${leadingSecs}`;
    //timerContainer.innerHTML = `Count down: ${leadingSecs}`;
    // showLeadingSecs = `Count down: ${leadingSecs}`;
    // console.log("LeadingSeconds",showLeadingSecs);

    //load game when the countdown is finished

    //not needed
    /*
    if (seconds === 10 ) {
    let waitingPlayer = document.getElementById("waitForPlayers")
    let game = document.getElementById("game")
    clear()
    waitingPlayer.style.display = "none"
    game.style.display = "block"  
    GameLoad()
    }
    */
    //end of not needed
  }

  function clear() {
    //console.log(timer, timeInterval)
    clearTimeout(timer)
    clearInterval(timeInterval)
  }




  //================== END ADDED on 30 March ======================

});

//================== START ADDED on 30 March ======================



//================== END ADDED on 30 March ======================