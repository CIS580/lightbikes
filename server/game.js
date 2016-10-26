const WIDTH = 100;
const HEIGHT = 100;

module.exports = exports = Game;

function Game(io, sockets, room) {
  this.io = io;
  this.room = room;
  this.state = new Uint8Array(WIDTH * HEIGHT);
  this.players = sockets.map(function(socket) {
    // Initialize the player
    var player = {
      socket: socket,
      input: {
        up: false,
        left: false,
        right: false,
        down: false
      }
    }

    // Join the room
    player.socket.join(room);

    // Handle disconnect events
    player.socket.on('disconnect', function() {
      // Broadcast to the other player that they disconnected
      player.socket.broadcast.emit('player disconnected');
    });

    // Handle input events
    player.socket.on('input', function(input) {
      player.input = input;
    });

    return player;
  });

  // Place players on the screen and set direction
  this.players[0].x = 10;
  this.players[0].y = 50;
  this.players[0].direction = 'right';
  this.io.to(this.room).emit('move', {
    x: this.players[0].x,
    y: this.players[0].y,
    id: 0
  });

  this.players[1].x = 90;
  this.players[1].y = 50;
  this.players[1].direction = 'left';
  this.io.to(this.room).emit('move', {
    x: this.players[1].x,
    y: this.players[1].y,
    id: 1
  });

  // Start the game
  var game = this;
  this.interval = setInterval(function(){
    game.update();
  }, 1000/60);
}

Game.prototype.update = function() {
  var state = this.state;
  var interval = this.interval;

  // Update players
  this.players.forEach(function(player, i, players){

    // Update direction
    if(player.input.left) player.direction = 'left';
    if(player.input.right) player.direction = 'right';
    if(player.input.up) player.direction = 'up';
    if(player.input.down) player.direction = 'down';

    // Move in current direction
    switch(player.direction) {
      case 'left': player.x--; break;
      case 'right': player.x++; break;
      case 'down': player.y++; break;
      case 'up': player.y--; break;
    }

    // check for collision with other player
    if(
      players[(i+1)%2].x == player.x &&
      players[(i+1)%2].y == player.y
    ) {
      // TODO: Broadcast game over
      console.log("collided with other player");
      clearInterval(interval);
    }

    if(state[player.y * WIDTH + player.x] != 0) {
      // collided with light trail
      // TODO: Broadcast game over
      console.log("collided with light trail");
      clearInterval(interval);
    } else {
      // claim the current position for player's light trail
      state[player.y * WIDTH + player.x] = i;
    }
  });

  // TODO: Broadcast updated game state
  this.io.to(this.room).emit('move', {
    x: this.players[0].x,
    y: this.players[0].y,
    id: 0
  });
  this.io.to(this.room).emit('move', {
    x: this.players[1].x,
    y: this.players[1].y,
    id: 1
  });
}
