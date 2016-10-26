const PORT = 8080;

const fs = require('fs');

var html = fs.readFileSync('./client/lightbikes.html', {encoding: 'utf8'});
var js = fs.readFileSync('./client/lightbikes.js', {encoding: 'utf8'});
var css = fs.readFileSync('./client/lightbikes.css', {encoding: 'utf8'});

var players = [];
var games = 0;
const Game = require('./game');

/**
 * @function handleRequest()
 * Handles http requests, serving the html, css, and js
 * resources of the client.
 * @param {HTTPRequest} request - the request from the client
 * @param {HTTPResponse} response - the response object to send the client
 */
function handleRequest(request, response) {
  switch(request.url) {
    case '/':
    case '/index.html':
    case '/lightbikes.html':
      response.setHeader('Content-Type', 'text/html');
      response.end(html);
      break;
    case '/lightbikes.css':
      response.setHeader('Content-Type', 'text/css');
      response.end(css);
      break;
    case '/lightbikes.js':
      response.setHeader('Content-Type', 'text/js');
      response.end(js);
      break;
  }
}

/* The web server that serves our client */
var server = require('http').createServer(handleRequest);

/* The websocket server that provides bi-directional
   communication for our game */
var io = require('socket.io')(server);

/* Handles a player connection */
io.on('connection', function(socket){
  console.log('a user connected');
  players.push(socket);

  // If we have two players, Launch a game instance
  if(players.length == 2) {
    new Game(io, players, games);
    players = [];
    games++;
  }
});

/* Launch the server */
server.listen(PORT, function(){
  console.log("Server listening on: http://localhost:%s", PORT);
})
