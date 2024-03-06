const chat = document.getElementById('chat');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');




/** @jsx Web_pilot.createElement */
export function Chat(props) {
    //create a server

  /*  http.createServer(function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('Hello World!');
        res.end();
    }).listen(8080);

    // Create WebSocket connection
    const socket = new WebSocket('ws://localhost:8080');

    socket.addEventListener("error", (event) => {
        console.log("Error from socket WS:", event);
    })

    // Connection opened
    socket.addEventListener("open", (event) => {
        socket.send("Hello Server!");
    });

    // Handle incoming messages
    socket.addEventListener('message', function (event) {
        const message = document.createElement('div');
        message.textContent = event.data;
        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight; // Scroll chat to bottom
    });*/

    // Send Bomberman nickname to server when Send button is clicked
    sendButton.addEventListener('click', function () {
        const message = messageInput.value;
        console.log('button click value:', messageInput.value)
        if (message.trim() !== '') {
            props.socket.send(JSON.stringify({
                type: "chatMessage",
                message: message
            }));
            messageInput.value = ''; // Clear input field after sending
        }
    });

    // Send Bomberman nickname to server when Enter key is pressed
    messageInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });


}