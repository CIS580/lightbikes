window.onload = function(){
  var canvas = document.getElementById('screen');
  var ctx = canvas.getContext('2d');
  var socket = io();
  var colors = ['red', 'blue']

  // Fill the canvas with gray background
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, 500, 500);

  // Handle movement updates from the server
  socket.on('move', function(move){
    ctx.fillStyle = colors[move.id];
    ctx.fillRect(5 * move.x, 5 * move.y, 5, 5);
  });

  // TODO: Handle disconnected event
  // TODO: Handle victory
  // TODO: Handle loss

  var input = {
    up: false,
    down: false,
    left: false,
    right: false
  }

  window.onkeydown = function(event) {
    event.preventDefault();
    switch(event.keyCode) {
      // UP
      case 38:
      case 87:
        input.up = true;
        break;
      // LEFT
      case 37:
      case 65:
        input.left = true;
        break;
      // RIGHT
      case 39:
      case 68:
        input.right = true;
        break;
      // DOWN
      case 40:
      case 83:
        input.down = true;
        break;
    }
    // Send the updated input to the server
    socket.emit('input', input);
  }

  window.onkeyup  = function(event) {
    event.preventDefault();
    switch(event.keyCode) {
      // UP
      case 38:
      case 87:
        input.up = false;
        break;
      // LEFT
      case 37:
      case 65:
        input.left = false;
        break;
      // RIGHT
      case 39:
      case 68:
        input.right = false;
        break;
      // DOWN
      case 40:
      case 83:
        input.down = false;
        break;
    }
    // Send the updated input to the server
    socket.emit('input', input);
  }
}
