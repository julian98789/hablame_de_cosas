import React, { useState, useEffect, useRef } from 'react';

export const Chat = () =>{
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const socketRef = useRef(null);
  
    useEffect(() => {
      socketRef.current = new WebSocket('ws://localhost:8080/chat');
  
      socketRef.current.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      };
  
      return () => {
        socketRef.current.close();
      };
    }, []);
  
    const sendMessage = () => {
      if (!username.trim() || !message.trim()) {
        setError('Nombre de usuario y mensaje no pueden estar vacíos.');
        return;
      }
  
      const fullMessage = `${username}: ${message}`;
      socketRef.current.send(fullMessage);
      setMessage('');
      setError('');
    };
 
    return(
        <div className="flex-1 p-4">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div id="messageArea" className="mb-4">
            {messages.map((msg, index) => (
              <p key={index} className="text-gray-700">{msg}</p>
            ))}
          </div>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
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
          <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Enviar
          </button>
        </div>
      </div>
    )
}