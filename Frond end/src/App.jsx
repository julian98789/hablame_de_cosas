import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Inicializar el WebSocket
    socketRef.current = new WebSocket('ws://localhost:8080/chat');

    socketRef.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      // Cerrar el WebSocket cuando el componente se desmonta
      socketRef.current.close();
    };
  }, []);

  const sendMessage = () => {
    const fullMessage = `${username}: ${message}`;
    socketRef.current.send(fullMessage);
    setMessage('');
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <div id="messageArea">
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Nombre de usuario:</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Introduce tu nombre"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="messageInput" className="form-label">Mensaje:</label>
            <input
              type="text"
              className="form-control"
              id="messageInput"
              placeholder="Introduce tu mensaje"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button onClick={sendMessage} className="btn btn-primary mt-3">Send</button>
        </div>
      </div>
    </div>
  );
};

export default App;
