// Node.js has a built-in module called HTTP,
// which allows Node.js to transfer data over the
//  HyperText Transfer Protocol (HTTP).
// To include the HTTP module, the require method is
// used


// The HTTP module can create an HTTP server that
// listens to server ports and gives a response back to the client.
// Use the createServer() method to create an HTTP server:

//Backend Server
var http = require('http');

var server = http.createServer(function(req, res)
{

  console.log('A request was made: ' + req.url)
  if (req.url === "example") {
  
  }

  
});

server.listen(3000, '127.0.0.1');
console.log('Listening to port 3000')