import React, { useState, useEffect, useRef, useCallback } from 'react';

const Message = ({ text, isOwnMessage }) => (
  <p className={`text-gray-700 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
    {text}
  </p>
);

const UsernameInput = ({ username, setUsername, setIsUsernameSet, error, setError }) => (
  <div className="mb-4">
    <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
      Nombre de usuario:
    </label>
    <input
      type="text"
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="username"
      placeholder="Introduce tu nombre"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <button
      onClick={() => {
        if (!username.trim()) {
          setError('El nombre de usuario no puede estar vacío.');
          return;
        }
        setIsUsernameSet(true);
        setError('');
      }}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
    >
      Confirmar Nombre
    </button>
  </div>
);

const MessageInput = ({ message, setMessage, sendMessage }) => (
  <div className="mb-6">
    <label htmlFor="messageInput" className="block text-gray-700 text-sm font-bold mb-2">
      Mensaje:
    </label>
    <textarea
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-none"
      id="messageInput"
      placeholder="Introduce tu mensaje"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />
    <button
      onClick={sendMessage}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
    >
      Enviar
    </button>
  </div>
);

export const Chat = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080/chat');

    const handleMessage = (event) => {
      const receivedMessage = event.data;
      if (receivedMessage.startsWith(`${username}:`)) {
        // Skip own messages from the server
        return;
      }

      // Add received message to state
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: receivedMessage, isOwnMessage: false, id: crypto.randomUUID() }
      ]);
    };

    socketRef.current.addEventListener('message', handleMessage);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socketRef.current.removeEventListener('message', handleMessage);
      socketRef.current.close();
    };
  }, [username]);

  const sendMessage = useCallback(() => {
    if (!username.trim() || !message.trim()) {
      setError('Nombre de usuario y mensaje no pueden estar vacíos.');
      return;
    }

    if (socketRef.current.readyState !== WebSocket.OPEN) {
      setError('El WebSocket no está conectado.');
      return;
    }

    const fullMessage = `${username}: ${message}`;
    
    // Send the message
    socketRef.current.send(fullMessage);

    // Add the sent message to the state with a flag indicating it's an own message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: fullMessage, isOwnMessage: true, id: crypto.randomUUID() }
    ]);

    setMessage('');
    setError('');
  }, [username, message]);

  return (
    <div className="flex justify-center ">
      <div className="w-4/5 bg-[rgba(236,240,250,255)] shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div id="messageArea" className="mb-4 h-48 overflow-y-auto">
          {messages.map((msg) => (
            <Message key={msg.id} text={msg.text} isOwnMessage={msg.isOwnMessage} />
          ))}
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        {!isUsernameSet ? (
          <UsernameInput 
            username={username}
            setUsername={setUsername}
            setIsUsernameSet={setIsUsernameSet}
            error={error}
            setError={setError}
          />
        ) : (
          <MessageInput 
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
};
