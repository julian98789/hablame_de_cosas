import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  // Estados locales para almacenar el nombre de usuario, el mensaje actual, los mensajes recibidos y posibles errores
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  
  // Referencia mutable para almacenar el WebSocket
  const socketRef = useRef(null);

  useEffect(() => {
    // Inicializar el WebSocket cuando el componente se monta
    socketRef.current = new WebSocket('ws://localhost:8080/chat');

    // Manejar los mensajes recibidos del WebSocket
    socketRef.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    // Limpiar el WebSocket cuando el componente se desmonta
    return () => {
      socketRef.current.close();
    };
  }, []);

  const sendMessage = () => {
    // Verificar que el nombre de usuario y el mensaje no estén vacíos
    if (!username.trim() || !message.trim()) {
      setError('Nombre de usuario y mensaje no pueden estar vacíos.');
      return;
    }

    // Construir el mensaje completo en el formato "username: message"
    const fullMessage = `${username}: ${message}`;
    
    // Enviar el mensaje a través del WebSocket
    socketRef.current.send(fullMessage);
    
    // Limpiar el campo de mensaje y el error
    setMessage('');
    setError('');
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          {/* Área para mostrar los mensajes recibidos */}
          <div id="messageArea">
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
          {/* Mostrar el mensaje de error si existe */}
          {error && <div className="alert alert-danger">{error}</div>}
          {/* Campo de entrada para el nombre de usuario */}
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
          {/* Campo de entrada para el mensaje */}
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
          {/* Botón para enviar el mensaje */}
          <button onClick={sendMessage} className="btn btn-primary mt-3">Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default App;
