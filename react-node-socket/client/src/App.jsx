import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client'
import { Container, TextField, Button, Stack } from '@mui/material';

function App() {

  //only create the socket once at the time of mounting the component
  const socket = useMemo( ()=> io('http://localhost:8000'), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [roomNameGroup, setRoomNameGroup] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', {message, room});
    setMessage("");
  }

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('join-room-group', roomNameGroup);
    setRoomNameGroup("");
  }

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
      console.log('connected', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('disconnected', socket.id);
    }, []);

    socket.on('receive-message', (message) => {
      setAllMessages((prev) => [...prev, message]);
      console.log('received message:', message);
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <Container maxWidth="sm">
      <h3>Your socket id is: {socketId}</h3>
      <form onSubmit={joinRoomHandler}>
        <TextField
          fullWidth
          placeholder='enter room name to join group'
          value={roomNameGroup}
          onChange={(e) => setRoomNameGroup(e.target.value)}
        />
        <Button type="submit">Join Room</Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          placeholder='enter message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          fullWidth
          placeholder='enter socket id of the room'
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>

      <Stack spacing={2}>
        {allMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </Stack>
    </Container>
  )
}

export default App
