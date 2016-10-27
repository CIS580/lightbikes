// Start the game after all files have loaded
window.onload = function() {

  // Global variables
  var canvas = document.getElementById('screen');
  var message = document.getElementById('message');
  var ctx = canvas.getContext('2d');
  var socket = io();
  var colors = [];
  colors[1] = 'red';
  colors[2] = 'blue';

  // Fill the canvas with gray background
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, 500, 500);

  // Handle movement updates from the server
  socket.on('move', function(move){
    ctx.fillStyle = colors[move.id];
    ctx.fillRect(5 * move.x, 5 * move.y, 5, 5);
  });

  // Handle game on events
  socket.on('game on', function() {
    message.style.display = 'none';
  });

  // Handle disconnected event
  socket.on('player left', function() {
    message.innerHTML = 'Player Left...';
    message.style.display = 'block';
  });

  // Handle victory
  socket.on('victory', function() {
    message.innerHTML = 'You win!';
    message.style.display = 'block';
  });

  // Handle loss
  socket.on('defeat', function() {
    message.innerHTML = 'You loose!';
    message.style.display = 'block';
  });

  // Handle key presses by sending a message to the
  // server with our new direction
  window.onkeydown = function(event) {
    event.preventDefault();
    switch(event.keyCode) {
      // UP
      case 38:
      case 87:
        socket.emit('steer', 'up');
        break;
      // LEFT
      case 37:
      case 65:
        socket.emit('steer', 'left');
        break;
      // RIGHT
      case 39:
      case 68:
        socket.emit('steer', 'right');
        break;
      // DOWN
      case 40:
      case 83:
        socket.emit('steer', 'down');
        break;
    }
  }

}
