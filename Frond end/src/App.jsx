import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
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
    <div className="container mx-auto mt-5">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Área para mostrar los mensajes recibidos */}
        <div id="messageArea" className="mb-4">
          {messages.map((msg, index) => (
            <p key={index} className="text-gray-700">{msg}</p>
          ))}
        </div>
        {/* Mostrar el mensaje de error si existe */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        {/* Campo de entrada para el nombre de usuario */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Nombre de usuario:</label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            placeholder="Introduce tu nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        {/* Campo de entrada para el mensaje */}
        <div className="mb-6">
          <label htmlFor="messageInput" className="block text-gray-700 text-sm font-bold mb-2">Mensaje:</label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="messageInput"
            placeholder="Introduce tu mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        {/* Botón para enviar el mensaje */}
        <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default App;
