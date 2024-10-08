const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const users = [];


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/style.css');
});

io.on('connection', (socket) => {  
  socket.on('disconnect', () => {
    io.emit('chat-message', { user: socket.username, msg: 'has disconnected' });
    users.splice(users.indexOf(socket.username), 1);
    console.log(users);
  });

  socket.on('send-username', function(username) {
    socket.username = username;
    io.emit('chat-message', { user: socket.username, msg: 'has connected' });
    users.push(socket.username);
    console.log(users);
  });

  socket.on('chat-message', (data) => {
    io.emit('chat-message', data);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});