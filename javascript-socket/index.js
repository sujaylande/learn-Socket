const http = require('http');
const express= require('express');
const path = require('path');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });

    socket.on('client-message', (msg) => { // listen for message from client
        io.emit('server-message', {msg, id: socket.id}); // send message to all clients
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
