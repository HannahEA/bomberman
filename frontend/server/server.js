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
import WebSocket from 'ws';

const wss = new WebSocket.Server({port:8080});

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
